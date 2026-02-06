import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VERSION = "v1.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  console.log(`[${VERSION}] update-admin-settings: ${req.method}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Use service role to bypass RLS for writes
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    console.log('Updating admin settings:', JSON.stringify(body));

    // Build update object from provided fields
    const updateData: Record<string, unknown> = {};

    if (body.displayMode !== undefined) updateData.display_mode = body.displayMode;
    if (body.testStyle !== undefined) updateData.test_style = body.testStyle;
    if (body.telegramBotToken !== undefined) updateData.telegram_bot_token = body.telegramBotToken;
    if (body.telegramChatId !== undefined) updateData.telegram_chat_id = body.telegramChatId;
    if (body.redirectUrl !== undefined) updateData.redirect_url = body.redirectUrl;
    if (body.requiredFields !== undefined) updateData.required_fields = body.requiredFields;
    if (body.hiddenFields !== undefined) updateData.hidden_fields = body.hiddenFields;
    if (body.helpTips !== undefined) updateData.help_tips = body.helpTips;
    if (body.calibration !== undefined) updateData.calibration = body.calibration;

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ error: 'No fields to update' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from('admin_settings')
      .update(updateData)
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Settings updated successfully');

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
