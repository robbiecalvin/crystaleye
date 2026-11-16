/** Run with `npm ci --prefix account` then `node tests/account-database.mjs`. */
import {PGlite} from '../account/node_modules/@electric-sql/pglite/dist/index.js';
import {readFile} from 'node:fs/promises';import assert from 'node:assert/strict';
const db=new PGlite();
await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
GRANT USAGE ON SCHEMA public, auth TO anon,authenticated,service_role; GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated;
INSERT INTO auth.users VALUES ('00000000-0000-4000-8000-000000000001'),('00000000-0000-4000-8000-000000000002');`);
await db.exec(await readFile(new URL('../supabase/migrations/202611160001_customer_accounts.sql',import.meta.url),'utf8'));
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002';
async function role(name,id=''){await db.exec(`RESET ROLE; SELECT set_config('request.jwt.claim.sub','${id}',false); SET ROLE ${name};`);}
async function denied(sql){await assert.rejects(()=>db.exec(sql));}
await role('authenticated',a);
await db.query('INSERT INTO crystaleye_profiles(user_id,display_name,sun) VALUES($1,$2,$3)',[a,'Customer A','aries']);
await db.query("INSERT INTO crystaleye_saved_readings(user_id,kind,title,payload) VALUES($1,'numerology','My chart','{}')",[a]);
await denied(`INSERT INTO crystaleye_profiles(user_id) VALUES('${b}')`);
await denied(`INSERT INTO crystaleye_subscriptions(user_id,plan,status) VALUES('${a}','tarot','active')`);
await denied(`UPDATE crystaleye_subscriptions SET status='active'`);
await role('service_role');await db.exec(`INSERT INTO crystaleye_subscriptions(user_id,plan,status) VALUES('${a}','tarot','active')`);
await role('authenticated',b);
for(const table of ['crystaleye_profiles','crystaleye_saved_readings','crystaleye_subscriptions'])assert.equal((await db.query(`SELECT * FROM ${table}`)).rows.length,0,table);
await denied(`INSERT INTO crystaleye_saved_readings(user_id,kind,title,payload) VALUES('${a}','astrology','Other user','{}')`);
await db.exec(`DELETE FROM crystaleye_saved_readings WHERE user_id='${a}'`);
await db.exec(`UPDATE crystaleye_profiles SET display_name='Hacked' WHERE user_id='${a}'`);
await role('authenticated',a);assert.equal((await db.query('SELECT display_name FROM crystaleye_profiles')).rows[0].display_name,'Customer A');assert.equal((await db.query('SELECT * FROM crystaleye_saved_readings')).rows.length,1);
await db.exec('DELETE FROM crystaleye_saved_readings');assert.equal((await db.query('SELECT * FROM crystaleye_saved_readings')).rows.length,0);
await denied(`UPDATE crystaleye_profiles SET sun='invalid'`);
await role('anon');for(const table of ['crystaleye_profiles','crystaleye_saved_readings','crystaleye_subscriptions'])await denied(`SELECT * FROM ${table}`);
await role('authenticated',a);await db.exec('INSERT INTO crystaleye_saved_readings(id,user_id,kind,title,payload) VALUES (\'00000000-0000-4000-8000-000000000010\',\''+a+'\',\'numerology\',\'Snapshot\',\'{}\') ON CONFLICT (id) DO NOTHING');
await db.exec('INSERT INTO crystaleye_saved_readings(id,user_id,kind,title,payload) VALUES (\'00000000-0000-4000-8000-000000000010\',\''+a+'\',\'numerology\',\'Snapshot\',\'{}\') ON CONFLICT (id) DO NOTHING');
assert.equal((await db.query('SELECT * FROM crystaleye_saved_readings')).rows.length,1);
await db.close();console.log('Passed real PostgreSQL migration/RLS checks: owner isolation, anonymous denial, owner deletion, input constraints, retry-safe inserts, and backend-only subscription writes.');
