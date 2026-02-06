import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, Clock, MessageSquare } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-primary mb-4 font-medium">
            Точное научное тестирование
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Узнайте свои<br />истинные способности
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Наше тестирование — не просто психологический опрос. Суть теста в том, чтобы объяснить прошлое 
            и избежать трудностей в будущем. Мы поможем вам увидеть ваши сильные стороны и зоны роста.
          </p>

          {/* Features badges */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium">200 вопросов</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium">Точный результат</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="font-medium">Личная консультация</span>
            </div>
          </div>

          <Button 
            size="lg" 
            className="text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all" 
            onClick={() => navigate('/register')}
          >
            Пройти тест бесплатно
          </Button>

          <p className="text-sm text-muted-foreground mt-6">
            <Clock className="w-4 h-4 inline-block mr-1" />
            Время прохождения: ~30-45 минут. Результаты конфиденциальны.
          </p>
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
            <MessageSquare className="w-8 h-8 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Личная консультация</p>
              <p className="text-sm text-muted-foreground">Разбор результатов со специалистом</p>
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
            className="text-lg px-10 py-6 rounded-full"
            onClick={() => navigate('/register')}
          >
            Начать тест
          </Button>
        </div>
      </div>
    </div>
  );
}
