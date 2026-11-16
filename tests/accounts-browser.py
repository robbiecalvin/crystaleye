"""Exercise real browser SDK flows with mocked Supabase; serve site locally first."""
import json,time,base64,os
from playwright.sync_api import sync_playwright
BASE=os.environ.get('CRYSTALEYE_TEST_URL','http://localhost:8007').rstrip('/')
UID='00000000-0000-4000-8000-000000000001'
def b64(value):return base64.urlsafe_b64encode(json.dumps(value).encode()).decode().rstrip('=')
token=b64({'alg':'HS256','typ':'JWT'})+'.'+b64({'sub':UID,'exp':int(time.time())+3600,'role':'authenticated'})+'.example'
user={'id':UID,'email':'client@example.com','aud':'authenticated','role':'authenticated','app_metadata':{'provider':'email'},'user_metadata':{},'created_at':'2026-11-16T00:00:00Z'}
session={'access_token':token,'refresh_token':'test-refresh-token','token_type':'bearer','expires_in':3600,'expires_at':int(time.time())+3600,'user':user}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.route('**/account/config.json',lambda r:r.fulfill(json={'enabled':False,'supabase_url':'','publishable_key':''}))
 page.goto(BASE+'/account/');page.wait_for_function("document.querySelector('#account-status').textContent.includes('being connected')")
 assert page.locator('#login-email').is_disabled()
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.route('**/account/config.json',lambda r:r.fulfill(json={'supabase_url':'https://test-project.supabase.co','publishable_key':'sb_publishable_test'}))
 rows=[];profile={'display_name':'Test Customer','sun':'aries','moon':'cancer','rising':'leo'};payloads=[]
 def api(route):
  req=route.request;url=req.url
  if req.method=='OPTIONS':route.fulfill(status=204,headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*','Access-Control-Allow-Methods':'*'});return
  if '/auth/v1/otp' in url:route.fulfill(json={});return
  if '/auth/v1/token' in url:route.fulfill(json=session);return
  if '/auth/v1/user' in url:route.fulfill(json=user);return
  if '/auth/v1/logout' in url:route.fulfill(status=204);return
  if '/rest/v1/crystaleye_profiles' in url:
   if req.method=='POST':profile.update(req.post_data_json);route.fulfill(status=201,json=None)
   else:route.fulfill(json=[profile])
   return
  if '/rest/v1/crystaleye_subscriptions' in url:route.fulfill(json=[]);return
  if '/rest/v1/crystaleye_saved_readings' in url:
   if req.method=='POST':
    data=req.post_data_json;payloads.append(data);rows.insert(0,{**data,'created_at':'2026-11-16T10:00:00Z'});route.fulfill(status=201,json=None)
   elif req.method=='DELETE':rows.clear();route.fulfill(status=204)
   else:route.fulfill(json=rows)
   return
  route.fulfill(status=404,json={'message':'Unexpected endpoint'})
 page.route('https://test-project.supabase.co/**',api)
 page.reload();page.wait_for_function("!document.querySelector('#login-email').disabled")
 page.fill('#login-email','client@example.com');page.locator('#login-form button').click();page.wait_for_function("document.querySelector('#login-status').textContent.includes('Check your email')")
 page.goto(BASE+'/account/?code=test-auth-code');page.locator('#dashboard').wait_for(state='visible')
 page.wait_for_function("document.querySelector('#welcome-title').textContent.includes('Test Customer')")
 assert 'No subscription' in page.locator('#subscription-list').inner_text()
 page.fill('#display-name','New Display Name');page.locator('#profile-form button').click();page.wait_for_function("document.querySelector('#profile-status').textContent==='Profile saved.'")
 page.click('#save-today');page.wait_for_function("document.querySelector('#today-status').textContent.includes('saved')")
 assert len(payloads)==1 and payloads[0]['kind']=='astrology'
 page.locator('.saved-reading details').click();assert 'Sun · aries' in page.locator('#saved-readings').inner_text()
 page.locator('[data-reading-filter=numerology]').click();assert 'No loaded readings' in page.locator('#saved-readings').inner_text()
 page.locator('[data-reading-filter=all]').click();page.locator('.reading-delete').click();page.wait_for_function("document.querySelector('#saved-status').textContent==='Reading removed.'")
 page.goto(BASE+'/numerology/');page.fill('#birth-name','John Smith');page.fill('#birth-date','1980-10-22');page.click('#mini-submit');page.locator('.account-save button').click();page.wait_for_function("document.querySelector('.account-save p').textContent.includes('Saved to your private account')")
 assert payloads[-1]['kind']=='numerology';assert 'John' not in json.dumps(payloads[-1]);assert '1980-10-22' not in json.dumps(payloads[-1])
 page.goto(BASE+'/numerology-calculator/');page.fill('#first','John');page.fill('#last','Smith');page.select_option('#month','10');page.select_option('#year','1980');page.select_option('#day','22');page.locator('#form button[type=submit]').click();page.locator('.account-save button').click();page.wait_for_function("document.querySelector('.account-save p').textContent.includes('Saved to your private account')")
 assert len(payloads[-1]['payload']['chart'])==21
 assert 'John' not in json.dumps(payloads[-1])
 page.goto(BASE+'/astrology/');page.locator('.account-save button').click();page.wait_for_function("document.querySelector('.account-save p').textContent.includes('Saved to your private account')");assert payloads[-1]['kind']=='astrology'
 page.goto(BASE+'/account/');page.locator('#dashboard').wait_for(state='visible');page.locator('.saved-reading').first.wait_for();page.screenshot(path='/tmp/customer-account-mobile.png',full_page=True)
 for width in [320,768,1024,1440]:
  page.set_viewport_size({'width':width,'height':850});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
 page.click('#sign-out');page.wait_for_function("document.querySelector('#dashboard').hidden")
 assert page.locator('#saved-readings').inner_text()==''
 assert not errors,errors
 print('Passed passwordless sign-in/callback, profile editing, astrology saving/deleting/filtering, both calculator saves without birth identity, subscription status, sign-out clearing, and responsive layouts. Supabase is mocked; no real emails or customer records were created.')
 b.close()
