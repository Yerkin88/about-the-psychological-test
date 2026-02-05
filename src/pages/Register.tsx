 import { useNavigate } from 'react-router-dom';
 import { useForm } from 'react-hook-form';
 import { zodResolver } from '@hookform/resolvers/zod';
 import * as z from 'zod';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { useTestState } from '@/hooks/useTestState';
 import { ClientInfo, Gender } from '@/types/oca';
import DevModeButton from '@/components/test/DevModeButton';
 
 const formSchema = z.object({
   name: z.string().min(2, 'Введите имя (минимум 2 символа)'),
   phone: z.string().min(10, 'Введите корректный номер телефона'),
   email: z.string().email('Введите корректный email'),
   city: z.string().optional(),
   age: z.number().min(14, 'Минимальный возраст 14 лет').max(100, 'Максимальный возраст 100 лет'),
   gender: z.enum(['male', 'female'], { required_error: 'Выберите пол' }),
 });
 
 type FormData = z.infer<typeof formSchema>;
 
 export default function Register() {
   const navigate = useNavigate();
   const { setClientInfo } = useTestState();
 
   const form = useForm<FormData>({
     resolver: zodResolver(formSchema),
     defaultValues: {
       name: '',
       phone: '',
       email: '',
       city: '',
       age: undefined,
       gender: undefined,
     },
   });
 
   const onSubmit = (data: FormData) => {
     const clientInfo: ClientInfo = {
       name: data.name,
       phone: data.phone,
       email: data.email,
       city: data.city || '',
       age: data.age,
       gender: data.gender as Gender,
     };
     
     setClientInfo(clientInfo);
     navigate('/test');
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
                 <FormField
                   control={form.control}
                   name="name"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Имя *</FormLabel>
                       <FormControl>
                         <Input placeholder="Введите ваше имя" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
 
                 <FormField
                   control={form.control}
                   name="phone"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Телефон *</FormLabel>
                       <FormControl>
                         <Input placeholder="+7 (999) 123-45-67" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
 
                 <FormField
                   control={form.control}
                   name="email"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Email *</FormLabel>
                       <FormControl>
                         <Input type="email" placeholder="example@mail.com" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
 
                 <FormField
                   control={form.control}
                   name="city"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Город</FormLabel>
                       <FormControl>
                         <Input placeholder="Ваш город" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
 
                 <div className="grid grid-cols-2 gap-4">
                   <FormField
                     control={form.control}
                     name="age"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Возраст *</FormLabel>
                         <FormControl>
                           <Input 
                             type="number" 
                             placeholder="Возраст" 
                             {...field}
                             onChange={e => field.onChange(parseInt(e.target.value) || '')}
                           />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
 
                   <FormField
                     control={form.control}
                     name="gender"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Пол *</FormLabel>
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
                 </div>
 
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