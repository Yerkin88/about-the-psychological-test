 import { useEffect, useCallback } from 'react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, Minus, X } from 'lucide-react';
 import { useTestState } from '@/hooks/useTestState';
import { useIsMobile } from '@/hooks/use-mobile';
 import { AnswerType } from '@/types/oca';
import ThemeToggle from '@/components/ThemeToggle';
import HelpTipsDialog from '@/components/HelpTipsDialog';
import { cn } from '@/lib/utils';
 
 interface Props {
   onComplete: () => void;
 }
 
 export default function SingleQuestionMode({ onComplete }: Props) {
   const {
     currentQuestion,
     currentQuestionIndex,
     totalQuestions,
     answeredCount,
     isComplete,
     setAnswer,
     getAnswer,
     nextQuestion,
     prevQuestion,
   } = useTestState();

  const isMobile = useIsMobile();
 
   const currentAnswer = getAnswer(currentQuestion.id);
   const progress = (answeredCount / totalQuestions) * 100;
 
   const handleAnswer = useCallback((answer: AnswerType) => {
     setAnswer(currentQuestion.id, answer);
     // Автоматический переход к следующему вопросу
     if (currentQuestionIndex < totalQuestions - 1) {
       setTimeout(() => nextQuestion(), 150);
     }
   }, [currentQuestion.id, currentQuestionIndex, totalQuestions, setAnswer, nextQuestion]);
 
   // Горячие клавиши
   useEffect(() => {
    // Отключаем горячие клавиши на мобильных
    if (isMobile) return;

     const handleKeyDown = (e: KeyboardEvent) => {
       switch (e.key) {
         case '1':
         case 'y':
         case 'Y':
         case 'н':
         case 'Н':
           handleAnswer('yes');
           break;
         case '2':
         case 'm':
         case 'M':
         case 'ь':
         case 'Ь':
           handleAnswer('maybe');
           break;
         case '3':
         case 'n':
         case 'N':
         case 'т':
         case 'Т':
           handleAnswer('no');
           break;
         case 'ArrowLeft':
           prevQuestion();
           break;
         case 'ArrowRight':
           nextQuestion();
           break;
       }
     };
 
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswer, nextQuestion, prevQuestion, isMobile]);
 
   return (
     <div className="min-h-screen flex flex-col">
       {/* Header с прогрессом */}
      <div className="bg-card border-b p-3 md:p-4">
        <div className="container mx-auto max-w-2xl">
          {/* Верхняя панель с темой и помощью */}
          <div className="flex items-center justify-end gap-1 mb-3">
            <HelpTipsDialog />
            <ThemeToggle />
          </div>

           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-muted-foreground">
               Вопрос {currentQuestionIndex + 1} из {totalQuestions}
             </span>
             <span className="text-sm text-muted-foreground">
               Отвечено: {answeredCount}
             </span>
           </div>
           <Progress value={progress} className="h-2" />
         </div>
       </div>
 
       {/* Основной контент */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-2xl shadow-lg border-0 md:border">
          <CardContent className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Текст вопроса - главный фокус */}
            <p className="text-xl md:text-2xl text-foreground text-center leading-relaxed font-medium">
               {currentQuestion.text}
             </p>
 
             {/* Кнопки ответов */}
            <div className="flex gap-2 md:gap-3 justify-center">
              {/* Да */}
              <button
                onClick={() => handleAnswer('yes')}
                className={cn(
                  'flex-1 max-w-[100px] md:max-w-[120px] py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold text-sm md:text-base transition-all duration-200',
                  'flex items-center justify-center gap-1.5 md:gap-2',
                  'active:scale-95 touch-manipulation',
                  currentAnswer === 'yes'
                    ? 'bg-success text-success-foreground shadow-lg ring-2 ring-success/50'
                    : 'bg-success/10 text-success hover:bg-success/20 border border-success/30'
                )}
              >
                <Check className="w-4 h-4 md:w-5 md:h-5" />
                <span>Да</span>
              </button>

              {/* Может быть */}
              <button
                onClick={() => handleAnswer('maybe')}
                className={cn(
                  'flex-1 max-w-[100px] md:max-w-[120px] py-3 md:py-4 px-3 md:px-6 rounded-xl font-semibold text-sm md:text-base transition-all duration-200',
                  'flex items-center justify-center gap-1.5 md:gap-2',
                  'active:scale-95 touch-manipulation',
                  currentAnswer === 'maybe'
                    ? 'bg-warning text-warning-foreground shadow-lg ring-2 ring-warning/50'
                    : 'bg-warning/10 text-warning hover:bg-warning/20 border border-warning/30'
                )}
              >
                <Minus className="w-4 h-4 md:w-5 md:h-5" />
                <span>Может</span>
              </button>

              {/* Нет */}
              <button
                onClick={() => handleAnswer('no')}
                className={cn(
                  'flex-1 max-w-[100px] md:max-w-[120px] py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold text-sm md:text-base transition-all duration-200',
                  'flex items-center justify-center gap-1.5 md:gap-2',
                  'active:scale-95 touch-manipulation',
                  currentAnswer === 'no'
                    ? 'bg-destructive text-destructive-foreground shadow-lg ring-2 ring-destructive/50'
                    : 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30'
                )}
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
                <span>Нет</span>
              </button>
             </div>
 
             {/* Подсказка по клавишам */}
            {!isMobile && (
              <p className="text-xs text-muted-foreground text-center">
                Горячие клавиши: 1/Y — Да, 2/M — Возможно, 3/N — Нет, ← → — навигация
              </p>
            )}
           </CardContent>
         </Card>
       </div>
 
       {/* Footer с навигацией */}
      <div className="bg-card border-t p-3 md:p-4">
        <div className="container mx-auto max-w-2xl flex items-center justify-between">
           <Button
             variant="outline"
             onClick={prevQuestion}
             disabled={currentQuestionIndex === 0}
            size="sm"
            className="md:size-default"
           >
            <ChevronLeft className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Назад</span>
           </Button>
 
           {isComplete ? (
            <Button onClick={onComplete} className="bg-success hover:bg-success/90" size="sm">
               Завершить тест
             </Button>
           ) : (
             <Button
               variant="outline"
               onClick={nextQuestion}
               disabled={currentQuestionIndex === totalQuestions - 1}
              size="sm"
              className="md:size-default"
             >
              <span className="hidden md:inline">Вперёд</span>
              <ChevronRight className="w-4 h-4 md:ml-2" />
             </Button>
           )}
         </div>
       </div>
     </div>
   );
 }