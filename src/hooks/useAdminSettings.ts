 import { useState, useCallback, useEffect } from 'react';
 import { AdminSettings, DisplayMode } from '@/types/oca';
 
 const SETTINGS_KEY = 'oca_admin_settings';
 
 const defaultSettings: AdminSettings = {
   displayMode: 'single',
   telegramBotToken: '',
   telegramChatId: '',
   redirectUrl: '/',
   requiredFields: {
     name: true,
     phone: true,
     email: true,
     city: false,
     age: true,
     gender: true,
   },
  hiddenFields: {
    name: false,
    phone: false,
    email: false,
    city: false,
    age: false,
    gender: false,
  },
  helpTips: '## Инструкция по прохождению теста\n\n1. Отвечайте на вопросы честно, не задумываясь слишком долго\n2. Выбирайте тот вариант, который первым приходит в голову\n3. Не пропускайте вопросы — на все нужно ответить\n4. Горячие клавиши (на компьютере): 1/Y — Да, 2/M — Возможно, 3/N — Нет, ← → — навигация\n\nСреднее время прохождения: 25-40 минут',
 };
 
 export function useAdminSettings() {
   const [settings, setSettings] = useState<AdminSettings>(() => {
     const saved = localStorage.getItem(SETTINGS_KEY);
     if (saved) {
       try {
         return { ...defaultSettings, ...JSON.parse(saved) };
       } catch {
         return defaultSettings;
       }
     }
     return defaultSettings;
   });
 
   useEffect(() => {
     localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
   }, [settings]);
 
   const updateSettings = useCallback((updates: Partial<AdminSettings>) => {
     setSettings(prev => ({ ...prev, ...updates }));
   }, []);
 
   const setDisplayMode = useCallback((mode: DisplayMode) => {
     setSettings(prev => ({ ...prev, displayMode: mode }));
   }, []);
 
   return {
     settings,
     updateSettings,
     setDisplayMode,
   };
 }