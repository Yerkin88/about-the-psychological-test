import { useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Check, Minus, X } from 'lucide-react';
import { useTestState } from '@/hooks/useTestState';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { questions } from '@/data/questions';
import { AnswerType } from '@/types/oca';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';
import HelpTipsDialog from '@/components/HelpTipsDialog';
 
 interface Props {
   onComplete: () => void;
 }
 
export default function ListQuestionMode({ onComplete }: Props) {
  const { answeredCount, totalQuestions, isComplete, setAnswer, getAnswer } = useTestState();
  const { settings } = useAdminSettings();
  const containerRef = useRef<HTMLDivElement>(null);

  const progress = (answeredCount / totalQuestions) * 100;

  // Стили для разных тем
  const styleClasses = useMemo(() => {
    switch (settings.testStyle) {
      case 'apple':
        return {
          container: 'min-h-screen flex flex-col bg-gradient-to-b from-[hsl(var(--primary)/0.1)] via-background to-[hsl(var(--primary)/0.05)]',
          header: 'backdrop-blur-md bg-background/80 border-b p-4 shadow-sm',
          card: 'bg-card/50 backdrop-blur-sm border-0 shadow-lg rounded-2xl',
          cardAnswered: 'border-success/30 bg-success/5',
          questionNumber: 'text-primary/80 font-light',
          questionText: 'text-lg text-foreground leading-relaxed font-normal',
          buttonBase: 'flex-1 min-w-0 py-2 px-1.5 sm:px-3 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 border-2',
          buttonYes: 'border-success/50 text-success hover:bg-success hover:text-white hover:border-success dark:text-success dark:hover:text-white',
          buttonYesActive: 'bg-success text-white border-success shadow-lg',
          buttonMaybe: 'border-warning/50 text-warning hover:bg-warning hover:text-white hover:border-warning dark:text-warning dark:hover:text-white',
          buttonMaybeActive: 'bg-warning text-white border-warning shadow-lg',
          buttonNo: 'border-destructive/50 text-destructive hover:bg-destructive hover:text-white hover:border-destructive dark:text-destructive dark:hover:text-white',
          buttonNoActive: 'bg-destructive text-white border-destructive shadow-lg',
          showIcons: false,
        };
      case 'minimal':
        return {
          container: 'min-h-screen flex flex-col bg-background',
          header: 'bg-card border-b p-4',
          card: 'shadow-none border rounded-lg',
          cardAnswered: 'border-success/50 bg-success/5',
          questionNumber: 'text-muted-foreground',
          questionText: 'text-base text-foreground leading-relaxed font-normal',
          buttonBase: 'flex-1 min-w-0 py-2 px-1.5 sm:px-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-200 border',
          buttonYes: 'border-border text-foreground hover:border-success hover:bg-success/10',
          buttonYesActive: 'bg-success text-white border-success',
          buttonMaybe: 'border-border text-foreground hover:border-warning hover:bg-warning/10',
          buttonMaybeActive: 'bg-warning text-white border-warning',
          buttonNo: 'border-border text-foreground hover:border-destructive hover:bg-destructive/10',
          buttonNoActive: 'bg-destructive text-white border-destructive',
          showIcons: false,
        };
      default:
        return {
          container: 'min-h-screen flex flex-col bg-background',
          header: 'bg-card border-b p-4 shadow-sm',
          card: 'shadow-sm border rounded-xl',
          cardAnswered: 'border-success/50 bg-success/5',
          questionNumber: 'text-primary font-semibold',
          questionText: 'text-base text-foreground leading-relaxed font-medium',
          buttonBase: 'flex-1 min-w-0 py-1.5 px-1 sm:px-2 rounded-lg font-medium text-xs transition-all duration-200',
          buttonYes: 'bg-success/10 text-success hover:bg-success/20 border border-success/30 dark:text-success',
          buttonYesActive: 'bg-success text-white shadow-md',
          buttonMaybe: 'bg-warning/10 text-warning hover:bg-warning/20 border border-warning/30 dark:text-warning',
          buttonMaybeActive: 'bg-warning text-white shadow-md',
          buttonNo: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30 dark:text-destructive',
          buttonNoActive: 'bg-destructive text-white shadow-md',
          showIcons: true,
        };
    }
  }, [settings.testStyle]);

  const handleAnswer = (questionId: number, answer: AnswerType) => {
    setAnswer(questionId, answer);
  };
 
  return (
    <div className={styleClasses.container}>
      {/* Sticky Header */}
      <div className={cn("sticky top-0 z-10", styleClasses.header)}>
        <div className="container mx-auto max-w-4xl">
          {/* Верхняя панель с темой и помощью */}
          <div className="flex items-center justify-end gap-1 mb-3">
            <HelpTipsDialog />
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Прогресс: {answeredCount} из {totalQuestions}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          
          {isComplete && (
            <Button 
              onClick={onComplete} 
              className="w-full mt-4 bg-success hover:bg-success/90"
              size="lg"
            >
              Завершить тест
            </Button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl py-4 px-4 space-y-3">
          {questions.map((question, index) => {
            const answer = getAnswer(question.id);
            const isAnswered = answer !== undefined;

            return (
              <Card 
                key={question.id}
                className={cn(
                  'transition-all',
                  styleClasses.card,
                  isAnswered && styleClasses.cardAnswered
                )}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-2.5">
                    {/* Текст вопроса */}
                    <p className={styleClasses.questionText}>
                      <span className={styleClasses.questionNumber}>{index + 1}. </span>{question.text}
                    </p>

                    {/* Кнопки ответов */}
                    <div className="flex gap-1.5 sm:gap-2">
                      <button
                        onClick={() => handleAnswer(question.id, 'yes')}
                        className={cn(
                          styleClasses.buttonBase,
                          'flex items-center justify-center gap-1',
                          'active:scale-95 touch-manipulation',
                          answer === 'yes'
                            ? styleClasses.buttonYesActive
                            : styleClasses.buttonYes
                        )}
                      >
                        {styleClasses.showIcons && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span className="truncate">Да</span>
                      </button>

                      <button
                        onClick={() => handleAnswer(question.id, 'maybe')}
                        className={cn(
                          styleClasses.buttonBase,
                          'flex items-center justify-center gap-1',
                          'active:scale-95 touch-manipulation',
                          answer === 'maybe'
                            ? styleClasses.buttonMaybeActive
                            : styleClasses.buttonMaybe
                        )}
                      >
                        {styleClasses.showIcons && <Minus className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span className="truncate">Может быть</span>
                      </button>

                      <button
                        onClick={() => handleAnswer(question.id, 'no')}
                        className={cn(
                          styleClasses.buttonBase,
                          'flex items-center justify-center gap-1',
                          'active:scale-95 touch-manipulation',
                          answer === 'no'
                            ? styleClasses.buttonNoActive
                            : styleClasses.buttonNo
                        )}
                      >
                        {styleClasses.showIcons && <X className="w-3.5 h-3.5 flex-shrink-0" />}
                        <span className="truncate">Нет</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
 
       {/* Bottom Complete Button (Fixed) */}
       {isComplete && (
         <div className="sticky bottom-0 bg-card border-t p-4">
           <div className="container mx-auto max-w-4xl">
             <Button 
               onClick={onComplete} 
               className="w-full bg-success hover:bg-success/90"
               size="lg"
             >
               Завершить тест
             </Button>
           </div>
         </div>
       )}
     </div>
   );
 }