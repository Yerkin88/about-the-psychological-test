import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useTestState } from '@/hooks/useTestState';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { ClientInfo, Gender } from '@/types/oca';
import DevModeButton from '@/components/test/DevModeButton';

export default function Register() {
  const navigate = useNavigate();
  const { setClientInfo } = useTestState();
  const { settings } = useAdminSettings();
  const { requiredFields, hiddenFields } = settings;

  // Динамическая схема на основе настроек админки
  const formSchema = z.object({
    name: hiddenFields.name 
      ? z.string().optional()
      : requiredFields.name 
        ? z.string().min(2, 'Введите имя (минимум 2 символа)')
        : z.string().optional(),
    phone: hiddenFields.phone
      ? z.string().optional()
      : requiredFields.phone
        ? z.string().min(10, 'Введите корректный номер телефона')
        : z.string().optional(),
    email: hiddenFields.email
      ? z.string().optional()
      : requiredFields.email
        ? z.string().email('Введите корректный email')
        : z.string().email().optional().or(z.literal('')),
    city: z.string().optional(),
    age: hiddenFields.age
      ? z.any().optional()
      : requiredFields.age
        ? z.preprocess(
            (v) => (v === '' || v === null || v === undefined ? undefined : v),
            z.coerce
              .number({ invalid_type_error: 'Введите возраст' })
              .min(14, 'Минимальный возраст 14 лет')
              .max(100, 'Максимальный возраст 100 лет'),
          )
        : z.preprocess(
            (v) => (v === '' || v === null || v === undefined ? undefined : v),
            z.coerce.number().optional(),
          ),
    gender: hiddenFields.gender
      ? z.enum(['male', 'female']).optional()
      : requiredFields.gender
        ? z.enum(['male', 'female'], { required_error: 'Выберите пол' })
        : z.enum(['male', 'female']).optional(),
    consent: z.boolean().refine(val => val === true, {
      message: 'Необходимо дать согласие на обработку данных',
    }),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      city: '',
      age: undefined,
      gender: undefined,
      consent: false,
    },
  });

  const onSubmit = (data: FormData) => {
    const clientInfo: ClientInfo = {
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      city: data.city || '',
      age: data.age || 0,
      gender: (data.gender as Gender) || 'male',
    };
    
    setClientInfo(clientInfo);
    navigate('/instructions');
  };

  return (
    <div className="min-h-screen bg-background py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-lg">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
            <p className="text-muted-foreground mt-2">
              Заполните форму для начала тестирования
            </p>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {!hiddenFields.name && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя{requiredFields.name ? ' *' : ''}</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите ваше имя" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!hiddenFields.phone && (
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон{requiredFields.phone ? ' *' : ''}</FormLabel>
                        <FormControl>
                          <Input placeholder="+7 (999) 123-45-67" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!hiddenFields.email && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email{requiredFields.email ? ' *' : ''}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@mail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!hiddenFields.city && (
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Город{requiredFields.city ? ' *' : ''}</FormLabel>
                        <FormControl>
                          <Input placeholder="Ваш город" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  {!hiddenFields.age && (
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Возраст{requiredFields.age ? ' *' : ''}</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Возраст" 
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {!hiddenFields.gender && (
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Пол{requiredFields.gender ? ' *' : ''}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Мужской</SelectItem>
                              <SelectItem value="female">Женский</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Согласие на обработку данных */}
                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <Label 
                          className="text-sm text-muted-foreground leading-relaxed cursor-pointer font-normal"
                          onClick={() => field.onChange(!field.value)}
                        >
                          Я даю согласие на обработку моих персональных данных
                        </Label>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full mt-6">
                  Начать тест
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
       
        {/* Кнопка режима разработчика */}
        <DevModeButton />
      </div>
    </div>
  );
}