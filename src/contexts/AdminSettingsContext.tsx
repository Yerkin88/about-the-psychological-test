import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { AdminSettings, DisplayMode, TestStyle, CalibrationPoints } from '@/types/oca';
import { supabase } from '@/integrations/supabase/client';

const SETTINGS_ROW_ID = '00000000-0000-0000-0000-000000000001';

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
  helpTips:
    '## Инструкция по прохождению теста\n\n1. Отвечайте на вопросы честно, не задумываясь слишком долго\n2. Выбирайте тот вариант, который первым приходит в голову\n3. Не пропускайте вопросы — на все нужно ответить\n\n## Горячие клавиши (на компьютере)\n- 1/Y — Да\n- 2/M — Может быть\n- 3/N — Нет\n- ← → — навигация\n\nСреднее время прохождения: 25-40 минут',
};

interface AdminSettingsContextValue {
  settings: AdminSettings;
  updateSettings: (updates: Partial<AdminSettings>) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setTestStyle: (style: TestStyle) => void;
  calibration: CalibrationPoints;
  updateCalibration: (points: CalibrationPoints) => void;
  saveAll: () => Promise<boolean>;
  isLoading: boolean;
}

const AdminSettingsContext = createContext<AdminSettingsContextValue | null>(null);

// Convert DB row to app settings format
function rowToSettings(row: Record<string, unknown>): { settings: AdminSettings; calibration: CalibrationPoints } {
  return {
    settings: {
      displayMode: (row.display_mode as DisplayMode) || 'single',
      testStyle: (row.test_style as TestStyle) || 'default',
      telegramBotToken: (row.telegram_bot_token as string) || '',
      telegramChatId: (row.telegram_chat_id as string) || '',
      redirectUrl: (row.redirect_url as string) || '/',
      requiredFields: {
        ...defaultSettings.requiredFields,
        ...(row.required_fields as Record<string, boolean> || {}),
      },
      hiddenFields: {
        ...defaultSettings.hiddenFields,
        ...(row.hidden_fields as Record<string, boolean> || {}),
      },
      helpTips: (row.help_tips as string) || defaultSettings.helpTips,
    },
    calibration: {
      ...defaultCalibration,
      ...(row.calibration as CalibrationPoints || {}),
    },
  };
}

export function AdminSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [calibration, setCalibration] = useState<CalibrationPoints>(defaultCalibration);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from database on mount
  useEffect(() => {
    async function loadFromDb() {
      try {
        console.log('Loading admin settings from database...');
        const { data, error } = await supabase
          .from('admin_settings')
          .select('*')
          .eq('id', SETTINGS_ROW_ID)
          .single();

        if (error) {
          console.error('Error loading settings from DB:', error);
          setIsLoading(false);
          return;
        }

        if (data) {
          console.log('Settings loaded from DB:', data);
          const parsed = rowToSettings(data);
          setSettings(parsed.settings);
          setCalibration(parsed.calibration);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFromDb();
  }, []);

  const updateSettings = useCallback((updates: Partial<AdminSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev };

      for (const key of Object.keys(updates) as (keyof AdminSettings)[]) {
        const value = updates[key];
        if (key === 'requiredFields' && typeof value === 'object' && value !== null) {
          newSettings.requiredFields = { ...prev.requiredFields, ...value };
        } else if (key === 'hiddenFields' && typeof value === 'object' && value !== null) {
          newSettings.hiddenFields = { ...prev.hiddenFields, ...value };
        } else if (value !== undefined) {
          (newSettings as Record<string, unknown>)[key] = value;
        }
      }

      return newSettings;
    });
  }, []);

  const setDisplayMode = useCallback((mode: DisplayMode) => {
    setSettings((prev) => ({ ...prev, displayMode: mode }));
  }, []);

  const setTestStyle = useCallback((style: TestStyle) => {
    setSettings((prev) => ({ ...prev, testStyle: style }));
  }, []);

  const updateCalibration = useCallback((points: CalibrationPoints) => {
    setCalibration(points);
  }, []);

  // Save all settings to database via edge function
  const saveAll = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Saving settings to database...');
      
      const { error } = await supabase.functions.invoke('update-admin-settings', {
        body: {
          displayMode: settings.displayMode,
          testStyle: settings.testStyle,
          telegramBotToken: settings.telegramBotToken,
          telegramChatId: settings.telegramChatId,
          redirectUrl: settings.redirectUrl,
          requiredFields: settings.requiredFields,
          hiddenFields: settings.hiddenFields,
          helpTips: settings.helpTips,
          calibration,
        },
      });

      if (error) {
        console.error('Error saving settings:', error);
        return false;
      }

      console.log('Settings saved successfully');
      return true;
    } catch (err) {
      console.error('Failed to save settings:', err);
      return false;
    }
  }, [settings, calibration]);

  return (
    <AdminSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        setDisplayMode,
        setTestStyle,
        calibration,
        updateCalibration,
        saveAll,
        isLoading,
      }}
    >
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  const ctx = useContext(AdminSettingsContext);
  if (!ctx) {
    throw new Error('useAdminSettings must be used within AdminSettingsProvider');
  }
  return ctx;
}

export { defaultCalibration };
