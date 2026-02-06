import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestResult {
  id: string;
  clientInfo: {
    name: string;
    phone: string;
    email: string;
    city: string;
    age: number;
    gender: string;
  };
  answers: Array<{ questionId: number; answer: string }>;
  rawScores: Record<string, number>;
  percentiles: Record<string, number>;
  question22Answer: string;
  question197Answer: string;
  maybeCount: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  createdAt: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const result: TestResult = await req.json();
    console.log('Received test result for:', result.clientInfo.name);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save result to database (let DB generate UUID)
    const { data: savedResult, error: insertError } = await supabase
      .from('test_results')
      .insert({
        client_name: result.clientInfo.name,
        client_phone: result.clientInfo.phone,
        client_email: result.clientInfo.email,
        client_city: result.clientInfo.city,
        client_age: result.clientInfo.age,
        client_gender: result.clientInfo.gender,
        answers: result.answers,
        raw_scores: result.rawScores,
        percentiles: result.percentiles,
        question_22_answer: result.question22Answer,
        question_197_answer: result.question197Answer,
        maybe_count: result.maybeCount,
        duration_minutes: result.durationMinutes,
        start_time: result.startTime,
        end_time: result.endTime,
        created_at: result.createdAt,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error saving result:', insertError);
      throw new Error(`Failed to save result: ${insertError.message}`);
    }

    console.log('Result saved to database:', savedResult?.id);

    // Fetch Telegram settings from admin_settings
    const { data: settings, error: settingsError } = await supabase
      .from('admin_settings')
      .select('telegram_bot_token, telegram_chat_id')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single();

    if (settingsError) {
      console.error('Error fetching settings:', settingsError);
    }

    // Send Telegram notification if configured
    if (settings?.telegram_bot_token && settings?.telegram_chat_id) {
      console.log('Sending Telegram notification...');
      
      // Format message
      const scales = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      const scalesLine = scales
        .map(s => `${s}: ${result.percentiles[s] > 0 ? '+' : ''}${result.percentiles[s]}`)
        .join(' | ');

      const message = `🆕 *Новый результат теста OCA*

👤 *Клиент:* ${escapeMarkdown(result.clientInfo.name)}
📱 *Телефон:* ${escapeMarkdown(result.clientInfo.phone)}
📧 *Email:* ${escapeMarkdown(result.clientInfo.email)}
🏙 *Город:* ${escapeMarkdown(result.clientInfo.city || '-')}
🎂 *Возраст:* ${result.clientInfo.age} лет
⚧ *Пол:* ${result.clientInfo.gender === 'male' ? 'Мужской' : 'Женский'}

📊 *Результаты по шкалам:*
\`${scalesLine}\`

⏱ *Время прохождения:* ${result.durationMinutes} мин
❓ *Ответов "Возможно":* ${result.maybeCount}
📅 *Дата:* ${new Date(result.createdAt).toLocaleString('ru-RU')}`;

      try {
        const telegramUrl = `https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`;
        const telegramResponse = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: settings.telegram_chat_id,
            text: message,
            parse_mode: 'Markdown',
          }),
        });

        const telegramResult = await telegramResponse.json();
        
        if (!telegramResponse.ok) {
          console.error('Telegram API error:', telegramResult);
        } else {
          console.log('Telegram notification sent successfully');
        }
      } catch (telegramError) {
        console.error('Error sending Telegram notification:', telegramError);
      }
    } else {
      console.log('Telegram not configured, skipping notification');
    }

    return new Response(
      JSON.stringify({ success: true, id: savedResult?.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in submit-test:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper to escape Markdown special characters
function escapeMarkdown(text: string): string {
  if (!text) return '';
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
}
