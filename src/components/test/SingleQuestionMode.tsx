import { useEffect, useCallback, useMemo } from 'react';
 import { Card, CardContent } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
 import { Button } from '@/components/ui/button';
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
      answerCurrentAndAdvance,
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
          container: 'min-h-screen flex flex-col bg-gradient-to-b from-[#1a365d] via-[#234e7a] to-[#1a365d] dark:from-[#1a365d] dark:via-[#234e7a] dark:to-[#1a365d] from-[#e8eef5] via-[#dce5f0] to-[#e8eef5]',
          header: 'bg-transparent border-b border-black/10 dark:border-white/10 p-3 md:p-4',
          card: 'w-full max-w-3xl bg-transparent border-0 shadow-none',
          questionNumber: 'text-foreground/70 dark:text-white/70 font-light text-lg md:text-xl',
          questionText: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground dark:text-white text-center leading-relaxed font-medium px-2',
          buttonBase: 'min-w-[92px] sm:min-w-[110px] md:min-w-[130px] h-[44px] md:h-[48px] rounded-full font-medium text-xs sm:text-sm md:text-base transition-all duration-300 border-2 shadow-lg whitespace-nowrap',

          buttonYes: 'border-foreground/20 dark:border-white/50 text-foreground dark:text-white bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 dark:hover:bg-white/10 hover:border-foreground/40 dark:hover:border-white/70',
          buttonYesActive: 'bg-foreground dark:bg-white text-background dark:text-[#1a365d] border-foreground dark:border-white shadow-black/20',
          buttonMaybe: 'border-foreground/20 dark:border-white/50 text-foreground dark:text-white bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 dark:hover:bg-white/10 hover:border-foreground/40 dark:hover:border-white/70',
          buttonMaybeActive: 'bg-foreground dark:bg-white text-background dark:text-[#1a365d] border-foreground dark:border-white shadow-black/20',
          buttonNo: 'border-foreground/20 dark:border-white/50 text-foreground dark:text-white bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 dark:hover:bg-white/10 hover:border-foreground/40 dark:hover:border-white/70',
          buttonNoActive: 'bg-foreground dark:bg-white text-background dark:text-[#1a365d] border-foreground dark:border-white shadow-black/20',

          footer: 'bg-transparent border-t border-black/10 dark:border-white/10 p-3 md:p-4',
          progressLabel: 'text-sm uppercase tracking-wider text-foreground/70 dark:text-white/70',
          navButton: 'text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white',
          showIcons: false,
        };
      case 'minimal':
        return {
          container: 'min-h-screen flex flex-col bg-background',
          header: 'bg-card border-b p-3 md:p-4',
          card: 'w-full max-w-2xl shadow-none border-0 md:border md:shadow-sm',
          questionNumber: 'text-primary font-medium text-lg md:text-xl',
          questionText: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground text-center leading-relaxed font-medium px-2',
          buttonBase: 'flex-1 min-w-[80px] sm:min-w-[90px] py-2.5 md:py-3 px-3 md:px-5 rounded-xl font-medium text-xs sm:text-sm md:text-base transition-all duration-200 border-2',
          buttonYes: 'border-success/30 text-success bg-success/5 hover:border-success hover:bg-success/10',
          buttonYesActive: 'bg-success text-white border-success shadow-lg',
          buttonMaybe: 'border-warning/30 text-warning bg-warning/5 hover:border-warning hover:bg-warning/10',
          buttonMaybeActive: 'bg-warning text-white border-warning shadow-lg',
          buttonNo: 'border-destructive/30 text-destructive bg-destructive/5 hover:border-destructive hover:bg-destructive/10',
          buttonNoActive: 'bg-destructive text-white border-destructive shadow-lg',
          footer: 'bg-card border-t p-3 md:p-4',
          progressLabel: 'text-sm text-muted-foreground',
          navButton: '',
          showIcons: false,
        };
      default:
        return {
          container: 'min-h-screen flex flex-col bg-background',
          header: 'bg-card border-b p-3 md:p-4',
          card: 'w-full max-w-2xl shadow-xl border-0 md:border rounded-2xl',
          questionNumber: 'text-primary font-bold text-lg md:text-xl',
          questionText: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground text-center leading-relaxed font-semibold px-2',
          buttonBase: 'flex-1 min-w-[80px] sm:min-w-[90px] py-2.5 md:py-3 px-3 md:px-5 rounded-xl font-semibold text-xs sm:text-sm md:text-base transition-all duration-200 border-2 shadow-md',
          buttonYes: 'bg-success/10 text-success border-success/30 hover:bg-success/20 hover:border-success/50',
          buttonYesActive: 'bg-success text-white shadow-lg shadow-success/30 ring-2 ring-success/50 border-success',
          buttonMaybe: 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20 hover:border-warning/50',
          buttonMaybeActive: 'bg-warning text-white shadow-lg shadow-warning/30 ring-2 ring-warning/50 border-warning',
          buttonNo: 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20 hover:border-destructive/50',
          buttonNoActive: 'bg-destructive text-white shadow-lg shadow-destructive/30 ring-2 ring-destructive/50 border-destructive',
          footer: 'bg-card border-t p-3 md:p-4',
          progressLabel: 'text-sm text-muted-foreground',
          navButton: '',
          showIcons: false,
        };
    }
  }, [settings.testStyle]);
 
    const isApple = settings.testStyle === 'apple';


    const handleAnswer = useCallback((answer: AnswerType) => {
      // Use atomic answerCurrentAndAdvance to prevent stale closure race conditions
      answerCurrentAndAdvance(answer);
    }, [answerCurrentAndAdvance]);
 
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
            // Блокируем переход вперёд если нет ответа
            if (currentAnswer) {
              nextQuestion();
            }
            break;
       }
     };
 
     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnswer, nextQuestion, prevQuestion, isMobile]);
 
    return (
    <div className={cn(styleClasses.container, "h-[100dvh] overflow-hidden")}>
       {/* Header с прогрессом */}
      <div className={styleClasses.header}>
        <div className="container mx-auto max-w-2xl">
          {/* Верхняя панель с темой и помощью */}
          <div className="flex items-center justify-end gap-1 mb-3">
            <HelpTipsDialog className={isApple ? 'text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white' : ''} />
            <ThemeToggle className={isApple ? 'text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white' : ''} />
          </div>

          {settings.testStyle !== 'apple' && (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className={styleClasses.progressLabel}>
                  Вопрос {currentQuestionIndex + 1} из {totalQuestions}
                </span>
                <span className={styleClasses.progressLabel}>
                  Отвечено: {answeredCount}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </>
          )}
         </div>
       </div>
 
        {/* Основной контент */}
       <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden">
        {/* Стрелка влево для Apple стиля */}
        {settings.testStyle === 'apple' && (
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className={cn(
              "hidden md:flex items-center justify-center w-12 h-12 mr-8",
              "text-white/50 hover:text-white transition-colors disabled:opacity-30"
            )}
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
        )}

        <Card className={styleClasses.card}>
          <CardContent className="p-5 md:p-10 flex flex-col min-h-[320px] md:min-h-[380px]">
            {/* Номер и текст вопроса — фиксированная область */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {/* Номер вопроса только в Apple режиме */}
              {settings.testStyle === 'apple' && (
                <span className={cn(styleClasses.questionNumber, "mb-6")}>
                  Вопрос {currentQuestionIndex + 1} из {totalQuestions}
                </span>
              )}
              <p className={styleClasses.questionText}>
                {currentQuestion.text}
              </p>
            </div>
 
             {/* Кнопки ответов — всегда внизу карточки */}
            <div className={cn(
              "flex justify-center pt-6 md:pt-8 flex-shrink-0",
              settings.testStyle === 'apple' ? "gap-3 md:gap-5" : "gap-3 md:gap-4 w-full max-w-lg mx-auto"
            )}>
              <button
                onClick={() => handleAnswer('yes')}
                className={cn(
                  styleClasses.buttonBase,
                  'flex items-center justify-center',
                  'active:scale-95 touch-manipulation',
                  currentAnswer === 'yes'
                    ? styleClasses.buttonYesActive
                    : styleClasses.buttonYes
                )}
              >
                {styleClasses.showIcons && <Check className="w-4 h-4 md:w-5 md:h-5 mr-1" />}
                <span>Да</span>
              </button>

              <button
                onClick={() => handleAnswer('maybe')}
                className={cn(
                  styleClasses.buttonBase,
                  'flex items-center justify-center',
                  'active:scale-95 touch-manipulation',
                  currentAnswer === 'maybe'
                    ? styleClasses.buttonMaybeActive
                    : styleClasses.buttonMaybe
                )}
              >
                {styleClasses.showIcons && <Minus className="w-4 h-4 md:w-5 md:h-5 mr-1" />}
                <span>Может быть</span>
              </button>

              <button
                onClick={() => handleAnswer('no')}
                className={cn(
                  styleClasses.buttonBase,
                  'flex items-center justify-center',
                  'active:scale-95 touch-manipulation',
                  currentAnswer === 'no'
                    ? styleClasses.buttonNoActive
                    : styleClasses.buttonNo
                )}
              >
                {styleClasses.showIcons && <X className="w-4 h-4 md:w-5 md:h-5 mr-1" />}
                <span>Нет</span>
              </button>
             </div>
           </CardContent>
         </Card>

        {/* Стрелка вправо для Apple стиля */}
        {settings.testStyle === 'apple' && (
          <button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1 || !currentAnswer}
            className={cn(
              "hidden md:flex items-center justify-center w-12 h-12 ml-8",
              "text-white/50 hover:text-white transition-colors disabled:opacity-30"
            )}
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        )}
       </div>
 
       {/* Footer с навигацией */}
      <div className={styleClasses.footer}>
        <div className="container mx-auto max-w-2xl">
          {/* Прогресс для Apple стиля */}
          {settings.testStyle === 'apple' && (
            <div className="mb-4">
              <p className="text-center text-foreground/70 dark:text-white/70 text-sm uppercase tracking-wider mb-2">
                Продвижение по тесту
              </p>
              <Progress value={progress} className="h-1 bg-foreground/20 dark:bg-white/20" />
            </div>
          )}

          {settings.testStyle === 'apple' ? (
            <div className="flex items-center justify-center gap-4 md:hidden">
              <Button
                variant="ghost"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                size="sm"
                className="text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white hover:bg-foreground/10 dark:hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              {isComplete && (
                <Button onClick={onComplete} className="bg-foreground dark:bg-white text-background dark:text-[#1a365d] hover:bg-foreground/90 dark:hover:bg-white/90" size="sm">
                  Завершить
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={nextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1 || !currentAnswer}
                size="sm"
                className="text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white hover:bg-foreground/10 dark:hover:bg-white/10"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
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
                  disabled={currentQuestionIndex === totalQuestions - 1 || !currentAnswer}
                  size="sm"
                  className="md:size-default"
                >
                  <span className="hidden md:inline">Вперёд</span>
                  <ChevronRight className="w-4 h-4 md:ml-2" />
                </Button>
              )}
            </div>
          )}

          {/* Кнопка завершения для Apple на десктопе */}
          {settings.testStyle === 'apple' && isComplete && (
            <div className="hidden md:flex justify-center mt-4">
              <Button onClick={onComplete} className="bg-foreground dark:bg-white text-background dark:text-[#1a365d] hover:bg-foreground/90 dark:hover:bg-white/90">
                Завершить тест
              </Button>
            </div>
          )}
         </div>
       </div>
     </div>
   );
 }