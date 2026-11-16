-- Namespaced tables: keep any existing Supabase application tables unchanged.
BEGIN;
CREATE TABLE public.crystaleye_profiles (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 display_name text NOT NULL DEFAULT '' CHECK (char_length(display_name) <= 80),
 sun text, moon text, rising text,
 updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT valid_sun CHECK (sun IS NULL OR sun IN ('aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces')),
 CONSTRAINT valid_moon CHECK (moon IS NULL OR moon IN ('aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces')),
 CONSTRAINT valid_rising CHECK (rising IS NULL OR rising IN ('aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'))
);
CREATE TABLE public.crystaleye_saved_readings (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK (kind IN ('numerology','astrology')),
 title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 160),
 payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object' AND octet_length(payload::text) <= 30000),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX crystaleye_readings_owner_date ON public.crystaleye_saved_readings(user_id, created_at DESC, id DESC);
CREATE TABLE public.crystaleye_subscriptions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 plan text NOT NULL CHECK (plan IN ('tarot','astrology')),
 status text NOT NULL CHECK (status IN ('active','trialing','past_due','canceled','unpaid','incomplete','incomplete_expired','paused')),
 current_period_end timestamptz,
 cancel_at_period_end boolean NOT NULL DEFAULT false,
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(user_id,plan)
);
ALTER TABLE public.crystaleye_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crystaleye_saved_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crystaleye_subscriptions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.crystaleye_profiles, public.crystaleye_saved_readings, public.crystaleye_subscriptions FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.crystaleye_profiles TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.crystaleye_saved_readings TO authenticated;
-- Customers can only READ billing state; verified backend/payment webhooks own writes.
GRANT SELECT ON public.crystaleye_subscriptions TO authenticated;
GRANT ALL ON public.crystaleye_profiles, public.crystaleye_saved_readings, public.crystaleye_subscriptions TO service_role;
CREATE POLICY profiles_select_self ON public.crystaleye_profiles FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY profiles_insert_self ON public.crystaleye_profiles FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY profiles_update_self ON public.crystaleye_profiles FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY readings_select_self ON public.crystaleye_saved_readings FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY readings_insert_self ON public.crystaleye_saved_readings FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY readings_delete_self ON public.crystaleye_saved_readings FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY subscriptions_select_self ON public.crystaleye_subscriptions FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
COMMIT;
