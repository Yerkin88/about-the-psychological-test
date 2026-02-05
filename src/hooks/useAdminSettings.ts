import { useState, useCallback, useEffect } from 'react';
import { AdminSettings, DisplayMode, TestStyle, CalibrationPoints } from '@/types/oca';
 
 const SETTINGS_KEY = 'oca_admin_settings';
const CALIBRATION_KEY = 'oca_calibration';

const defaultCalibration: CalibrationPoints = {
  top: 127,
  bottom: 596,
  left: 116,
  right: 1040,
};
 
 const defaultSettings: AdminSettings = {
   displayMode: 'single',
  testStyle: 'default',
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
  helpTips: '## Инструкция по прохождению теста\n\n1. Отвечайте на вопросы честно, не задумываясь слишком долго\n2. Выбирайте тот вариант, который первым приходит в голову\n3. Не пропускайте вопросы — на все нужно ответить\n\n## Горячие клавиши (на компьютере)\n- 1/Y — Да\n- 2/M — Может быть\n- 3/N — Нет\n- ← → — навигация\n\nСреднее время прохождения: 25-40 минут',
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
 
  const [calibration, setCalibration] = useState<CalibrationPoints>(() => {
    const saved = localStorage.getItem(CALIBRATION_KEY);
    if (saved) {
      try {
        return { ...defaultCalibration, ...JSON.parse(saved) };
      } catch {
        return defaultCalibration;
      }
    }
    return defaultCalibration;
  });

   useEffect(() => {
     localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
   }, [settings]);
 
  useEffect(() => {
    localStorage.setItem(CALIBRATION_KEY, JSON.stringify(calibration));
  }, [calibration]);

   const updateSettings = useCallback((updates: Partial<AdminSettings>) => {
     setSettings(prev => ({ ...prev, ...updates }));
   }, []);
 
   const setDisplayMode = useCallback((mode: DisplayMode) => {
     setSettings(prev => ({ ...prev, displayMode: mode }));
   }, []);
 
  const setTestStyle = useCallback((style: TestStyle) => {
    setSettings(prev => ({ ...prev, testStyle: style }));
  }, []);

  const updateCalibration = useCallback((points: CalibrationPoints) => {
    setCalibration(points);
  }, []);

   return {
     settings,
     updateSettings,
     setDisplayMode,
    setTestStyle,
    calibration,
    updateCalibration,
   };
 }

export { defaultCalibration };