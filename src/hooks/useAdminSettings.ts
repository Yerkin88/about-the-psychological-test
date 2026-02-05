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