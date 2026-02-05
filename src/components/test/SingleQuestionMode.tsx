import { useEffect, useCallback, useMemo } from 'react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, Minus, X } from 'lucide-react';
 import { useTestState } from '@/hooks/useTestState';
import { useAdminSettings } from '@/hooks/useAdminSettings';
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

  const { settings } = useAdminSettings();
  const isMobile = useIsMobile();
 
   const currentAnswer = getAnswer(currentQuestion.id);
   const progress = (answeredCount / totalQuestions) * 100;

  // Стили для разных тем
  const styleClasses = useMemo(() => {
    switch (settings.testStyle) {
      case 'apple':
        return {
          container: 'min-h-screen flex flex-col bg-gradient-to-b from-[hsl(var(--primary)/0.1)] via-background to-[hsl(var(--primary)/0.05)]',
          header: 'backdrop-blur-md bg-background/80 border-b p-3 md:p-4',
          card: 'w-full max-w-3xl bg-transparent border-0 shadow-none',
          questionNumber: 'text-6xl md:text-7xl font-light text-primary/80',
          questionText: 'text-xl md:text-2xl lg:text-3xl text-foreground text-center leading-relaxed font-normal',
          buttonBase: 'py-4 md:py-5 px-6 md:px-10 rounded-full font-medium text-base md:text-lg transition-all duration-300 border-2',
          buttonYes: 'border-success/50 hover:bg-success hover:text-success-foreground hover:border-success',
          buttonYesActive: 'bg-success text-success-foreground border-success shadow-lg',
          buttonMaybe: 'border-warning/50 hover:bg-warning hover:text-warning-foreground hover:border-warning',
          buttonMaybeActive: 'bg-warning text-warning-foreground border-warning shadow-lg',
          buttonNo: 'border-destructive/50 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive',
          buttonNoActive: 'bg-destructive text-destructive-foreground border-destructive shadow-lg',
          footer: 'backdrop-blur-md bg-background/80 border-t p-3 md:p-4',
          progressLabel: 'text-sm uppercase tracking-wider text-muted-foreground',
          showIcons: false,
        };
      case 'minimal':
        return {
          container: 'min-h-screen flex flex-col bg-background',
          header: 'bg-card border-b p-3 md:p-4',
          card: 'w-full max-w-2xl shadow-none border-0 md:border md:shadow-sm',
          questionNumber: 'text-sm text-muted-foreground mb-2',
          questionText: 'text-lg md:text-xl text-foreground text-center leading-relaxed font-normal',
          buttonBase: 'py-3 md:py-4 px-6 md:px-8 rounded-lg font-medium text-sm md:text-base transition-all duration-200 border',
          buttonYes: 'border-border hover:border-success hover:bg-success/10',
          buttonYesActive: 'bg-success text-success-foreground border-success',
          buttonMaybe: 'border-border hover:border-warning hover:bg-warning/10',
          buttonMaybeActive: 'bg-warning text-warning-foreground border-warning',
          buttonNo: 'border-border hover:border-destructive hover:bg-destructive/10',
          buttonNoActive: 'bg-destructive text-destructive-foreground border-destructive',
          footer: 'bg-card border-t p-3 md:p-4',
          progressLabel: 'text-sm text-muted-foreground',
          showIcons: false,
        };
      default:
        return {
          container: 'min-h-screen flex flex-col bg-background',
          header: 'bg-card border-b p-3 md:p-4',
          card: 'w-full max-w-2xl shadow-lg border-0 md:border',
          questionNumber: 'text-lg md:text-xl text-primary font-semibold',
          questionText: 'text-2xl md:text-3xl text-foreground text-center leading-relaxed font-semibold',
          buttonBase: 'py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold text-sm md:text-base transition-all duration-200',
          buttonYes: 'bg-success/10 text-success hover:bg-success/20 border border-success/30',
          buttonYesActive: 'bg-success text-success-foreground shadow-lg ring-2 ring-success/50',
          buttonMaybe: 'bg-warning/10 text-warning hover:bg-warning/20 border border-warning/30',
          buttonMaybeActive: 'bg-warning text-warning-foreground shadow-lg ring-2 ring-warning/50',
          buttonNo: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30',
          buttonNoActive: 'bg-destructive text-destructive-foreground shadow-lg ring-2 ring-destructive/50',
          footer: 'bg-card border-t p-3 md:p-4',
          progressLabel: 'text-sm text-muted-foreground',
          showIcons: true,
        };
    }
  }, [settings.testStyle]);
 
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
    <div className={styleClasses.container}>
       {/* Header с прогрессом */}
      <div className={styleClasses.header}>
        <div className="container mx-auto max-w-2xl">
          {/* Верхняя панель с темой и помощью */}
          <div className="flex items-center justify-end gap-1 mb-3">
            <HelpTipsDialog />
            <ThemeToggle />
          </div>

           <div className="flex items-center justify-between mb-2">
            <span className={styleClasses.progressLabel}>
               Вопрос {currentQuestionIndex + 1} из {totalQuestions}
             </span>
            <span className={styleClasses.progressLabel}>
               Отвечено: {answeredCount}
             </span>
           </div>
           <Progress value={progress} className="h-2" />
         </div>
       </div>
 
       {/* Основной контент */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6">
        <Card className={styleClasses.card}>
          <CardContent className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Номер и текст вопроса - главный фокус */}
            <div className="text-center space-y-3 md:space-y-4">
              <span className={styleClasses.questionNumber}>
                {currentQuestionIndex + 1}.
              </span>
              <p className={styleClasses.questionText}>
               {currentQuestion.text}
              </p>
            </div>
 
             {/* Кнопки ответов */}
            <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
              {/* Да */}
              <button
                onClick={() => handleAnswer('yes')}
                className={cn(
                  styleClasses.buttonBase,
                  'flex items-center justify-center gap-1.5 md:gap-2',
                  'active:scale-95 touch-manipulation',
                  currentAnswer === 'yes'
                    ? styleClasses.buttonYesActive
                    : styleClasses.buttonYes
                )}
              >
                {styleClasses.showIcons && <Check className="w-4 h-4 md:w-5 md:h-5" />}
                <span>Да</span>
              </button>

              {/* Может быть */}
              <button
                onClick={() => handleAnswer('maybe')}
                className={cn(
                  styleClasses.buttonBase,
                  'flex items-center justify-center gap-1.5 md:gap-2',
                  'active:scale-95 touch-manipulation',
                  currentAnswer === 'maybe'
                    ? styleClasses.buttonMaybeActive
                    : styleClasses.buttonMaybe
                )}
              >
                {styleClasses.showIcons && <Minus className="w-4 h-4 md:w-5 md:h-5" />}
                <span>Может быть</span>
              </button>

              {/* Нет */}
              <button
                onClick={() => handleAnswer('no')}
                className={cn(
                  styleClasses.buttonBase,
                  'flex items-center justify-center gap-1.5 md:gap-2',
                  'active:scale-95 touch-manipulation',
                  currentAnswer === 'no'
                    ? styleClasses.buttonNoActive
                    : styleClasses.buttonNo
                )}
              >
                {styleClasses.showIcons && <X className="w-4 h-4 md:w-5 md:h-5" />}
                <span>Нет</span>
              </button>
             </div>
           </CardContent>
         </Card>
       </div>
 
       {/* Footer с навигацией */}
      <div className={styleClasses.footer}>
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