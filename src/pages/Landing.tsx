 import { useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { CheckCircle, Brain, Target, TrendingUp, Clock, Shield } from 'lucide-react';
 
 export default function Landing() {
   const navigate = useNavigate();
 
   const benefits = [
     {
       icon: Brain,
       title: 'Глубокий анализ личности',
       description: 'Узнайте свои сильные стороны и области для развития',
     },
     {
       icon: Target,
       title: '10 ключевых характеристик',
       description: 'Получите полную картину вашего психологического профиля',
     },
     {
       icon: TrendingUp,
       title: 'Научная методология',
       description: 'Основан на проверенных методах психологического тестирования',
     },
     {
       icon: Clock,
       title: '30-40 минут',
       description: 'Инвестируйте немного времени для важных открытий о себе',
     },
   ];
 
   return (
     <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
       {/* Hero Section */}
       <div className="container mx-auto px-4 py-16 md:py-24">
         <div className="text-center max-w-3xl mx-auto">
           <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
             Oxford Capacity Analysis
           </h1>
           <p className="text-xl text-muted-foreground mb-8">
             Профессиональный тест личности, который поможет вам лучше понять себя 
             и раскрыть ваш потенциал
           </p>
           <Button 
             size="lg" 
             className="text-lg px-8 py-6"
              onClick={() => navigate('/register')}
           >
             Пройти тест
           </Button>
         </div>
       </div>
 
       {/* Benefits Section */}
       <div className="container mx-auto px-4 pb-16">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {benefits.map((benefit, index) => (
             <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
               <CardContent className="p-6 text-center">
                 <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                   <benefit.icon className="w-6 h-6 text-primary" />
                 </div>
                 <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                 <p className="text-sm text-muted-foreground">{benefit.description}</p>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>
 
       {/* What You'll Learn Section */}
       <div className="bg-card py-16">
         <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-12">Что вы узнаете о себе</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
             {[
               'Эмоциональная стабильность',
               'Уровень счастья и удовлетворённости',
               'Способность к самоконтролю',
               'Уверенность в себе',
               'Уровень активности',
               'Коммуникативные способности',
               'Ответственность и надёжность',
               'Объективность восприятия',
             ].map((item, index) => (
               <div key={index} className="flex items-center gap-3 p-3">
                 <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                 <span className="text-foreground">{item}</span>
               </div>
             ))}
           </div>
         </div>
       </div>
 
       {/* Trust Section */}
       <div className="container mx-auto px-4 py-16">
         <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
           <div className="flex items-center gap-3">
             <Shield className="w-8 h-8 text-primary" />
             <div>
               <p className="font-semibold text-foreground">Конфиденциальность</p>
               <p className="text-sm text-muted-foreground">Ваши данные защищены</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <CheckCircle className="w-8 h-8 text-primary" />
             <div>
               <p className="font-semibold text-foreground">200 вопросов</p>
               <p className="text-sm text-muted-foreground">Полный анализ личности</p>
             </div>
           </div>
         </div>
       </div>
 
       {/* CTA Section */}
       <div className="bg-primary text-primary-foreground py-16">
         <div className="container mx-auto px-4 text-center">
           <h2 className="text-3xl font-bold mb-4">Готовы узнать себя лучше?</h2>
           <p className="text-lg opacity-90 mb-8">
             Начните прохождение теста прямо сейчас
           </p>
           <Button 
             size="lg" 
             variant="secondary"
             className="text-lg px-8 py-6"
             onClick={() => navigate('/register')}
           >
             Начать тест
           </Button>
         </div>
       </div>
     </div>
   );
 }