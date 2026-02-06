import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Crosshair, Save } from 'lucide-react';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { DisplayMode, TestStyle } from '@/types/oca';
import GraphCalibration from './GraphCalibration';
 
export default function AdminSettings() {
  const { settings, updateSettings, setDisplayMode, setTestStyle, calibration, updateCalibration, saveAll } = useAdminSettings();
  const [showCalibration, setShowCalibration] = useState(false);

  const handleSave = () => {
    const ok = saveAll();
    ok ? toast.success('Настройки сохранены') : toast.error('Не удалось сохранить настройки');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          Сохранить настройки
        </Button>
      </div>
       {/* Режим отображения вопросов */}
       <Card>
         <CardHeader>
           <CardTitle>Режим отображения вопросов</CardTitle>
           <CardDescription>
             Выберите как будут отображаться вопросы во время прохождения теста
           </CardDescription>
         </CardHeader>
         <CardContent>
           <RadioGroup
             value={settings.displayMode}
             onValueChange={(value) => setDisplayMode(value as DisplayMode)}
             className="space-y-4"
           >
             <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
               <RadioGroupItem value="single" id="single" className="mt-1" />
               <div>
                 <Label htmlFor="single" className="font-medium cursor-pointer">
                   Один вопрос на экран
                 </Label>
                 <p className="text-sm text-muted-foreground mt-1">
                   Пользователь видит по одному вопросу. Есть навигация, горячие клавиши. 
                   Оптимально для мобильных устройств.
                 </p>
               </div>
             </div>
 
             <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
               <RadioGroupItem value="list" id="list" className="mt-1" />
               <div>
                 <Label htmlFor="list" className="font-medium cursor-pointer">
                   Все 200 вопросов на странице
                 </Label>
                 <p className="text-sm text-muted-foreground mt-1">
                   Все вопросы на одной странице со скроллом. Кнопка завершения появляется 
                   когда все вопросы отвечены. Быстрее для десктопа.
                 </p>
               </div>
             </div>
           </RadioGroup>
         </CardContent>
       </Card>
 
      {/* Стиль интерфейса теста */}
      <Card>
        <CardHeader>
          <CardTitle>Стиль интерфейса теста</CardTitle>
          <CardDescription>
            Выберите визуальный стиль для прохождения теста
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings.testStyle}
            onValueChange={(value) => setTestStyle(value as TestStyle)}
            className="space-y-4"
          >
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value="default" id="style-default" className="mt-1" />
              <div>
                <Label htmlFor="style-default" className="font-medium cursor-pointer">
                  По умолчанию
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Классический стиль с цветными кнопками и иконками
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value="apple" id="style-apple" className="mt-1" />
              <div>
                <Label htmlFor="style-apple" className="font-medium cursor-pointer">
                  Стиль Apple
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Минималистичный стиль с градиентным фоном и элегантными кнопками. Крупный номер вопроса.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
              <RadioGroupItem value="minimal" id="style-minimal" className="mt-1" />
              <div>
                <Label htmlFor="style-minimal" className="font-medium cursor-pointer">
                  Минимализм
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Простой и чистый дизайн без отвлекающих элементов
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

       {/* Telegram настройки */}
       <Card>
         <CardHeader>
           <CardTitle>Telegram уведомления</CardTitle>
           <CardDescription>
             Настройте бота для получения результатов в Telegram
           </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="botToken">Bot Token</Label>
             <Input
               id="botToken"
               type="password"
               placeholder="123456:ABC-DEF..."
               value={settings.telegramBotToken}
               onChange={(e) => updateSettings({ telegramBotToken: e.target.value })}
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="chatId">Chat ID</Label>
             <Input
               id="chatId"
               placeholder="-1001234567890"
               value={settings.telegramChatId}
               onChange={(e) => updateSettings({ telegramChatId: e.target.value })}
             />
           </div>
         </CardContent>
       </Card>
 
       {/* Редирект */}
       <Card>
         <CardHeader>
           <CardTitle>После завершения теста</CardTitle>
           <CardDescription>
             URL для перенаправления после завершения теста
           </CardDescription>
         </CardHeader>
         <CardContent>
           <div className="space-y-2">
             <Label htmlFor="redirectUrl">URL редиректа</Label>
             <Input
               id="redirectUrl"
               placeholder="/"
               value={settings.redirectUrl}
               onChange={(e) => updateSettings({ redirectUrl: e.target.value })}
             />
           </div>
         </CardContent>
       </Card>
 
       {/* Обязательные поля */}
       <Card>
         <CardHeader>
           <CardTitle>Поля регистрации</CardTitle>
           <CardDescription>
              Настройте какие поля обязательны для заполнения или скрыты
           </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           {Object.entries({
             name: 'Имя',
             phone: 'Телефон',
             email: 'Email',
             city: 'Город',
             age: 'Возраст',
             gender: 'Пол',
           }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-4 py-2 border-b last:border-b-0">
                <div className="flex items-center gap-2">
                  <Label htmlFor={key} className="font-medium">{label}</Label>
                  {settings.hiddenFields[key as keyof typeof settings.hiddenFields] && (
                    <Badge variant="secondary" className="text-xs">скрыто</Badge>
                  )}
                  {!settings.hiddenFields[key as keyof typeof settings.hiddenFields] && 
                   settings.requiredFields[key as keyof typeof settings.requiredFields] && (
                    <Badge variant="default" className="text-xs">обязательно</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${key}-required`} className="text-xs text-muted-foreground">Обязательно</Label>
                    <Switch
                      id={`${key}-required`}
                      checked={settings.requiredFields[key as keyof typeof settings.requiredFields]}
                      disabled={settings.hiddenFields[key as keyof typeof settings.hiddenFields]}
                      onCheckedChange={(checked) => 
                        updateSettings({
                          requiredFields: {
                            ...settings.requiredFields,
                            [key]: checked,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${key}-hidden`} className="text-xs text-muted-foreground">Скрыть</Label>
                    <Switch
                      id={`${key}-hidden`}
                      checked={settings.hiddenFields[key as keyof typeof settings.hiddenFields]}
                      onCheckedChange={(checked) => 
                        updateSettings({
                          hiddenFields: {
                            ...settings.hiddenFields,
                            [key]: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>
             </div>
           ))}
         </CardContent>
       </Card>

      {/* Калибровка графика */}
      <Card>
        <CardHeader>
          <CardTitle>Калибровка графика</CardTitle>
          <CardDescription>
            Настройте точное позиционирование графика на трафарете OCA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-secondary/50 rounded-lg text-center">
              <p className="text-muted-foreground">+100 (Y)</p>
              <p className="font-mono font-bold">{calibration.top}</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg text-center">
              <p className="text-muted-foreground">-100 (Y)</p>
              <p className="font-mono font-bold">{calibration.bottom}</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg text-center">
              <p className="text-muted-foreground">A (X)</p>
              <p className="font-mono font-bold">{calibration.left}</p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg text-center">
              <p className="text-muted-foreground">J (X)</p>
              <p className="font-mono font-bold">{calibration.right}</p>
            </div>
          </div>
          <Button onClick={() => setShowCalibration(true)} className="w-full gap-2">
            <Crosshair className="w-4 h-4" />
            Открыть калибровку
          </Button>
        </CardContent>
      </Card>

      <GraphCalibration
        open={showCalibration}
        onClose={() => setShowCalibration(false)}
        onSave={updateCalibration}
        currentPoints={calibration}
      />

      {/* Подсказки для клиента */}
      <Card>
        <CardHeader>
          <CardTitle>Подсказки для клиента</CardTitle>
          <CardDescription>
            Текст, который пользователь увидит нажав на кнопку (?) во время теста. Поддерживает простой Markdown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="## Заголовок&#10;&#10;Текст подсказки..."
            value={settings.helpTips}
            onChange={(e) => updateSettings({ helpTips: e.target.value })}
            className="min-h-[200px] font-mono text-sm"
          />
        </CardContent>
      </Card>
     </div>
   );
 }