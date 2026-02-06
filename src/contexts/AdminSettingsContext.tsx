import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
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
  helpTips:
    '## Инструкция по прохождению теста\n\n1. Отвечайте на вопросы честно, не задумываясь слишком долго\n2. Выбирайте тот вариант, который первым приходит в голову\n3. Не пропускайте вопросы — на все нужно ответить\n\n## Горячие клавиши (на компьютере)\n- 1/Y — Да\n- 2/M — Может быть\n- 3/N — Нет\n- ← → — навигация\n\nСреднее время прохождения: 25-40 минут',
};

function safeGetItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function loadSettings(): AdminSettings {
  const saved = safeGetItem(SETTINGS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as Partial<AdminSettings>;
      return {
        ...defaultSettings,
        ...parsed,
        requiredFields: {
          ...defaultSettings.requiredFields,
          ...(parsed.requiredFields ?? {}),
        },
        hiddenFields: {
          ...defaultSettings.hiddenFields,
          ...(parsed.hiddenFields ?? {}),
        },
      };
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
}

function loadCalibration(): CalibrationPoints {
  const saved = safeGetItem(CALIBRATION_KEY);
  if (saved) {
    try {
      return { ...defaultCalibration, ...JSON.parse(saved) };
    } catch {
      return defaultCalibration;
    }
  }
  return defaultCalibration;
}

interface AdminSettingsContextValue {
  settings: AdminSettings;
  updateSettings: (updates: Partial<AdminSettings>) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setTestStyle: (style: TestStyle) => void;
  calibration: CalibrationPoints;
  updateCalibration: (points: CalibrationPoints) => void;
  saveAll: () => boolean;
}

const AdminSettingsContext = createContext<AdminSettingsContextValue | null>(null);

export function AdminSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AdminSettings>(loadSettings);
  const [calibration, setCalibration] = useState<CalibrationPoints>(loadCalibration);

  // Слушаем изменения в localStorage из других вкладок
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as Partial<AdminSettings>;
          setSettings({
            ...defaultSettings,
            ...parsed,
            requiredFields: {
              ...defaultSettings.requiredFields,
              ...(parsed.requiredFields ?? {}),
            },
            hiddenFields: {
              ...defaultSettings.hiddenFields,
              ...(parsed.hiddenFields ?? {}),
            },
          });
        } catch {
          // ignore
        }
      }
      if (e.key === CALIBRATION_KEY && e.newValue) {
        try {
          setCalibration({ ...defaultCalibration, ...JSON.parse(e.newValue) });
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
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

      safeSetJson(SETTINGS_KEY, newSettings);
      return newSettings;
    });
  }, []);

  const setDisplayMode = useCallback((mode: DisplayMode) => {
    setSettings((prev) => {
      const next = { ...prev, displayMode: mode };
      safeSetJson(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  const setTestStyle = useCallback((style: TestStyle) => {
    setSettings((prev) => {
      const next = { ...prev, testStyle: style };
      safeSetJson(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  const updateCalibration = useCallback((points: CalibrationPoints) => {
    setCalibration(() => {
      safeSetJson(CALIBRATION_KEY, points);
      return points;
    });
  }, []);

  const saveAll = useCallback(() => {
    const ok1 = safeSetJson(SETTINGS_KEY, settings);
    const ok2 = safeSetJson(CALIBRATION_KEY, calibration);
    return ok1 && ok2;
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
