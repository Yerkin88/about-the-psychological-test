import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VERSION = "v1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  console.log(`[${VERSION}] Test Telegram request received: ${req.method}`);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch Telegram settings from admin_settings
    const { data: settings, error: settingsError } = await supabase
      .from('admin_settings')
      .select('telegram_bot_token, telegram_chat_id')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
      return new Response(
        JSON.stringify({ success: false, error: 'Ошибка получения настроек: ' + settingsError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!settings?.telegram_bot_token || !settings?.telegram_chat_id) {
      console.log('Telegram not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Telegram не настроен. Укажите Bot Token и Chat ID в настройках.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sending test Telegram message...');
    console.log('Chat ID:', settings.telegram_chat_id);
    console.log('Bot Token length:', settings.telegram_bot_token?.length || 0);

    // Send test message
    const testMessage = `✅ *Тестовое уведомление OCA*

🕐 Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}

Если вы видите это сообщение, значит Telegram уведомления работают корректно!`;

    const telegramUrl = `https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`;
    
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: settings.telegram_chat_id,
        text: testMessage,
        parse_mode: 'Markdown',
      }),
    });

    const telegramResult = await telegramResponse.json();
    console.log('Telegram API response:', JSON.stringify(telegramResult));

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramResult);
      
      let errorMessage = 'Ошибка Telegram API';
      if (telegramResult.description) {
        if (telegramResult.description.includes('chat not found')) {
          errorMessage = 'Чат не найден. Проверьте Chat ID и убедитесь, что бот добавлен в группу.';
        } else if (telegramResult.description.includes('bot was blocked')) {
          errorMessage = 'Бот заблокирован пользователем.';
        } else if (telegramResult.description.includes('Unauthorized')) {
          errorMessage = 'Неверный Bot Token.';
        } else {
          errorMessage = telegramResult.description;
        }
      }
      
      return new Response(
        JSON.stringify({ success: false, error: errorMessage }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Test message sent successfully!');

    return new Response(
      JSON.stringify({ success: true, message: 'Тестовое сообщение отправлено!' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in test-telegram:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
