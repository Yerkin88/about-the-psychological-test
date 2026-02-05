 import { useEffect, useCallback } from 'react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
 import { ChevronLeft, ChevronRight, CheckCircle, Circle, XCircle } from 'lucide-react';
 import { useTestState } from '@/hooks/useTestState';
import { useIsMobile } from '@/hooks/use-mobile';
 import { AnswerType } from '@/types/oca';
import ThemeToggle from '@/components/ThemeToggle';
import HelpTipsDialog from '@/components/HelpTipsDialog';
 
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
      <div className="flex-1 flex items-center justify-center p-3 md:p-4">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardContent className="p-4 md:p-8">
            <p className="text-lg md:text-2xl text-foreground text-center leading-relaxed mb-6 md:mb-8">
               {currentQuestion.text}
             </p>
 
             {/* Кнопки ответов */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
               <Button
                 variant={currentAnswer === 'yes' ? 'default' : 'outline'}
                 size="lg"
                className={`h-16 md:h-20 flex-col gap-1 md:gap-2 text-xs md:text-base ${currentAnswer === 'yes' ? 'bg-success hover:bg-success/90' : ''}`}
                 onClick={() => handleAnswer('yes')}
               >
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                 <span>ДА</span>
               </Button>
 
               <Button
                 variant={currentAnswer === 'maybe' ? 'default' : 'outline'}
                 size="lg"
                className={`h-16 md:h-20 flex-col gap-1 md:gap-2 text-xs md:text-base ${currentAnswer === 'maybe' ? 'bg-warning hover:bg-warning/90' : ''}`}
                 onClick={() => handleAnswer('maybe')}
               >
                <Circle className="w-5 h-5 md:w-6 md:h-6" />
                 <span>ВОЗМОЖНО</span>
               </Button>
 
               <Button
                 variant={currentAnswer === 'no' ? 'default' : 'outline'}
                 size="lg"
                className={`h-16 md:h-20 flex-col gap-1 md:gap-2 text-xs md:text-base ${currentAnswer === 'no' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                 onClick={() => handleAnswer('no')}
               >
                <XCircle className="w-5 h-5 md:w-6 md:h-6" />
                 <span>НЕТ</span>
               </Button>
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