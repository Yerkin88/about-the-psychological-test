 import { useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
 
 export default function Instructions() {
   const navigate = useNavigate();
 
   return (
     <div className="min-h-screen bg-background py-8 md:py-16">
       <div className="container mx-auto px-4 max-w-3xl">
         <Card className="shadow-lg">
           <CardHeader className="text-center pb-2">
             <CardTitle className="text-3xl font-bold">Инструкция</CardTitle>
             <p className="text-muted-foreground mt-2">
               Пожалуйста, прочитайте краткую инструкцию
             </p>
           </CardHeader>
           
           <CardContent className="space-y-6 pt-6">
             {/* Основная информация */}
             <div className="bg-secondary/50 rounded-lg p-4">
               <p className="text-foreground">
                 Вы должны ответить на <strong>200 вопросов</strong>, чтобы получить результат. 
                 На каждый вопрос можно ответить <strong>"ДА"</strong>, <strong>"ВОЗМОЖНО"</strong> или <strong>"НЕТ"</strong>.
               </p>
             </div>
 
             {/* Правила */}
             <div className="space-y-4">
               <h3 className="font-semibold text-lg text-foreground">Правила прохождения:</h3>
               
               <ul className="space-y-3">
                 <li className="flex gap-3">
                   <span className="text-primary font-bold">1.</span>
                   <span className="text-foreground">
                     Не задерживайтесь долго на одном вопросе, отвечайте на него сразу, 
                     как только вы его поняли, и переходите к следующему.
                   </span>
                 </li>
                 <li className="flex gap-3">
                   <span className="text-primary font-bold">2.</span>
                   <span className="text-foreground">
                     Отвечая на вопросы, не спрашивайте других, как они ответили бы, 
                     или как лучше ответить вам. Не обращайтесь ни к кому за помощью.
                   </span>
                 </li>
                 <li className="flex gap-3">
                   <span className="text-primary font-bold">3.</span>
                   <span className="text-foreground">
                     Отвечайте на каждый вопрос так, как вы чувствуете будет правильно 
                     <strong> СЕЙЧАС</strong>, а не в вашем прошлом.
                   </span>
                 </li>
                 <li className="flex gap-3">
                   <span className="text-primary font-bold">4.</span>
                   <span className="text-foreground">
                     Если вы не знаете как ответить, то сразу отвечайте "ВОЗМОЖНО", 
                     не заставляйте себя выбирать между "ДА" и "НЕТ".
                   </span>
                 </li>
                 <li className="flex gap-3">
                   <span className="text-primary font-bold">5.</span>
                   <span className="text-foreground font-medium">
                     Точность результатов теста зависит от того, насколько честно 
                     вы отвечаете на вопросы.
                   </span>
                 </li>
               </ul>
             </div>
 
             {/* Расшифровка кнопок */}
             <div className="border-t pt-6">
               <h3 className="font-semibold text-lg text-foreground mb-4">Значение кнопок:</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
                   <CheckCircle className="w-8 h-8 text-success" />
                   <div>
                     <p className="font-semibold text-foreground">ДА</p>
                     <p className="text-sm text-muted-foreground">да или скорее всего да</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3 p-4 bg-warning/10 rounded-lg">
                   <Circle className="w-8 h-8 text-warning" />
                   <div>
                     <p className="font-semibold text-foreground">ВОЗМОЖНО</p>
                     <p className="text-sm text-muted-foreground">может быть или неуверен</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
                   <XCircle className="w-8 h-8 text-destructive" />
                   <div>
                     <p className="font-semibold text-foreground">НЕТ</p>
                     <p className="text-sm text-muted-foreground">нет или скорее всего нет</p>
                   </div>
                 </div>
               </div>
             </div>
 
             {/* Кнопка продолжения */}
             <div className="pt-4">
              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  size="lg" 
                  className="py-6"
                  onClick={() => navigate('/register')}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
               <Button 
                 size="lg" 
                className="flex-1 text-lg py-6"
                onClick={() => navigate('/test')}
               >
                Начать тест
                 <ArrowRight className="ml-2 w-5 h-5" />
               </Button>
              </div>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }