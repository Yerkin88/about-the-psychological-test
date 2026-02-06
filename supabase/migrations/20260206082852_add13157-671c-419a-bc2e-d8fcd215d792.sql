-- Create table for admin settings (singleton row)
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  display_mode TEXT NOT NULL DEFAULT 'single',
  test_style TEXT NOT NULL DEFAULT 'default',
  telegram_bot_token TEXT NOT NULL DEFAULT '',
  telegram_chat_id TEXT NOT NULL DEFAULT '',
  redirect_url TEXT NOT NULL DEFAULT '/',
  required_fields JSONB NOT NULL DEFAULT '{"name": true, "phone": true, "email": true, "city": false, "age": true, "gender": true}',
  hidden_fields JSONB NOT NULL DEFAULT '{"name": false, "phone": false, "email": false, "city": false, "age": false, "gender": false}',
  help_tips TEXT NOT NULL DEFAULT '## Инструкция по прохождению теста

1. Отвечайте на вопросы честно, не задумываясь слишком долго
2. Выбирайте тот вариант, который первым приходит в голову
3. Не пропускайте вопросы — на все нужно ответить

## Горячие клавиши (на компьютере)
- 1/Y — Да
- 2/M — Может быть
- 3/N — Нет
- ← → — навигация

Среднее время прохождения: 25-40 минут',
  calibration JSONB NOT NULL DEFAULT '{"top": 127, "bottom": 596, "left": 116, "right": 1040}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public read, no write from client)
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (public config)
CREATE POLICY "Anyone can read admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (true);

-- Insert default settings row
INSERT INTO public.admin_settings (id) VALUES ('00000000-0000-0000-0000-000000000001');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();