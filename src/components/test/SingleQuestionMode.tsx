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
          container: 'min-h-screen flex flex-col bg-gradient-to-b from-[#1a365d] via-[#234e7a] to-[#1a365d]',
          header: 'bg-transparent border-b border-white/10 p-3 md:p-4',
          card: 'w-full max-w-3xl bg-transparent border-0 shadow-none',
          questionNumber: 'text-white/80 font-medium',
          questionText: 'text-xl md:text-2xl lg:text-3xl text-white text-center leading-relaxed font-medium',
          buttonBase: 'min-w-[80px] md:min-w-[120px] py-2 md:py-2.5 px-3 md:px-6 rounded-full font-normal text-xs md:text-sm transition-all duration-300 border-2 uppercase tracking-wide',
          buttonYes: 'border-white/50 text-white/90 bg-white/5 hover:bg-white/15 hover:border-white',
          buttonYesActive: 'bg-white text-[#1a365d] border-white shadow-lg',
          buttonMaybe: 'border-white/50 text-white/90 bg-white/5 hover:bg-white/15 hover:border-white',
          buttonMaybeActive: 'bg-white text-[#1a365d] border-white shadow-lg',
          buttonNo: 'border-white/50 text-white/90 bg-white/5 hover:bg-white/15 hover:border-white',
          buttonNoActive: 'bg-white text-[#1a365d] border-white shadow-lg',
          footer: 'bg-transparent border-t border-white/10 p-3 md:p-4',
          progressLabel: 'text-sm uppercase tracking-wider text-white/70',
          navButton: 'text-white/70 hover:text-white',
          showIcons: false,
        };
      case 'minimal':
        return {
          container: 'min-h-screen flex flex-col bg-background',
          header: 'bg-card border-b p-3 md:p-4',
          card: 'w-full max-w-2xl shadow-none border-0 md:border md:shadow-sm',
          questionNumber: 'text-primary font-medium',
          questionText: 'text-xl md:text-2xl lg:text-3xl text-foreground text-center leading-relaxed font-medium',
          buttonBase: 'flex-1 min-w-0 py-2 md:py-2.5 px-2 md:px-4 rounded-lg font-normal text-xs transition-all duration-200 border',
          buttonYes: 'border-border text-muted-foreground hover:border-success hover:bg-success/10 dark:text-muted-foreground',
          buttonYesActive: 'bg-success text-white border-success',
          buttonMaybe: 'border-border text-muted-foreground hover:border-warning hover:bg-warning/10 dark:text-muted-foreground',
          buttonMaybeActive: 'bg-warning text-white border-warning',
          buttonNo: 'border-border text-muted-foreground hover:border-destructive hover:bg-destructive/10 dark:text-muted-foreground',
          buttonNoActive: 'bg-destructive text-white border-destructive',
          footer: 'bg-card border-t p-3 md:p-4',
          progressLabel: 'text-sm text-muted-foreground',
          navButton: '',
          showIcons: false,
        };
      default:
        return {
          container: 'min-h-screen flex flex-col bg-background',
          header: 'bg-card border-b p-3 md:p-4',
          card: 'w-full max-w-2xl shadow-lg border-0 md:border',
          questionNumber: 'text-primary font-semibold',
          questionText: 'text-xl md:text-2xl lg:text-3xl text-foreground text-center leading-relaxed font-semibold',
          buttonBase: 'flex-1 min-w-0 py-2 md:py-2.5 px-2 md:px-3 rounded-xl font-medium text-xs transition-all duration-200',
          buttonYes: 'bg-success/10 text-success/80 hover:bg-success/20 border border-success/20 dark:text-success/80',
          buttonYesActive: 'bg-success text-white shadow-lg ring-2 ring-success/50',
          buttonMaybe: 'bg-warning/10 text-warning/80 hover:bg-warning/20 border border-warning/20 dark:text-warning/80',
          buttonMaybeActive: 'bg-warning text-white shadow-lg ring-2 ring-warning/50',
          buttonNo: 'bg-destructive/10 text-destructive/80 hover:bg-destructive/20 border border-destructive/20 dark:text-destructive/80',
          buttonNoActive: 'bg-destructive text-white shadow-lg ring-2 ring-destructive/50',
          footer: 'bg-card border-t p-3 md:p-4',
          progressLabel: 'text-sm text-muted-foreground',
          navButton: '',
          showIcons: false,
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
            <HelpTipsDialog className={settings.testStyle === 'apple' ? 'text-white/70 hover:text-white' : ''} />
            <ThemeToggle className={settings.testStyle === 'apple' ? 'text-white/70 hover:text-white' : ''} />
          </div>

          {settings.testStyle !== 'apple' && (
            <div className="flex items-center justify-between mb-2">
              <span className={styleClasses.progressLabel}>
                Вопрос {currentQuestionIndex + 1} из {totalQuestions}
              </span>
              <span className={styleClasses.progressLabel}>
                Отвечено: {answeredCount}
              </span>
            </div>
          )}
          {settings.testStyle !== 'apple' && <Progress value={progress} className="h-2" />}
         </div>
       </div>
 
       {/* Основной контент */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6">
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
          <CardContent className="p-4 md:p-8 space-y-6 md:space-y-8">
            {/* Номер и текст вопроса */}
            <div className="text-center">
              <p className={styleClasses.questionText}>
                <span className={styleClasses.questionNumber}>{currentQuestionIndex + 1}. </span>
                {currentQuestion.text}
              </p>
            </div>
 
             {/* Кнопки ответов */}
            <div className={cn(
              "flex justify-center",
              settings.testStyle === 'apple' ? "gap-3 md:gap-4" : "gap-2 md:gap-3 w-full"
            )}>
              {/* Да */}
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

              {/* Может быть */}
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

              {/* Нет */}
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
            disabled={currentQuestionIndex === totalQuestions - 1}
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
              <p className="text-center text-white/70 text-sm uppercase tracking-wider mb-2">
                Продвижение по тесту
              </p>
              <Progress value={progress} className="h-1 bg-white/20" />
            </div>
          )}

          {settings.testStyle === 'apple' ? (
            <div className="flex items-center justify-center gap-4 md:hidden">
              <Button
                variant="ghost"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              {isComplete && (
                <Button onClick={onComplete} className="bg-white text-[#1a365d] hover:bg-white/90" size="sm">
                  Завершить
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={nextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1}
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10"
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
                  disabled={currentQuestionIndex === totalQuestions - 1}
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
              <Button onClick={onComplete} className="bg-white text-[#1a365d] hover:bg-white/90">
                Завершить тест
              </Button>
            </div>
          )}
         </div>
       </div>
     </div>
   );
 }