 import { useEffect, useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Card, CardContent } from '@/components/ui/card';
 import { CheckCircle } from 'lucide-react';
 import { useAdminSettings } from '@/hooks/useAdminSettings';
 
 export default function Complete() {
   const navigate = useNavigate();
   const { settings } = useAdminSettings();
   const [countdown, setCountdown] = useState(5);
 
   useEffect(() => {
     const timer = setInterval(() => {
       setCountdown(prev => {
         if (prev <= 1) {
           clearInterval(timer);
           const redirectUrl = settings.redirectUrl || '/';
           navigate(redirectUrl);
           return 0;
         }
         return prev - 1;
       });
     }, 1000);
 
     return () => clearInterval(timer);
   }, [navigate, settings.redirectUrl]);
 
   return (
     <div className="min-h-screen bg-background flex items-center justify-center p-4">
       <Card className="max-w-md w-full shadow-lg">
         <CardContent className="pt-8 pb-8 text-center">
           <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="w-12 h-12 text-success" />
           </div>
           
           <h1 className="text-2xl font-bold text-foreground mb-4">
             Спасибо!
           </h1>
           
           <p className="text-muted-foreground mb-6">
             Вы успешно завершили тест.
             <br />
             Мы свяжемся с вами в ближайшее время.
           </p>
           
           <p className="text-sm text-muted-foreground">
             Перенаправление через {countdown} сек...
           </p>
         </CardContent>
       </Card>
     </div>
   );
 }