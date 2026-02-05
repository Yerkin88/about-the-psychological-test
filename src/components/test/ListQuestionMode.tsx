import { useRef, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
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

// Компонент радио-кнопки
function RadioButton({ 
  checked, 
  onClick,
  className 
}: { 
  checked: boolean; 
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
        "hover:border-primary",
        checked ? "border-primary bg-primary" : "border-muted-foreground/50",
        className
      )}
    >
      {checked && <div className="w-2 h-2 rounded-full bg-white" />}
    </button>
  );
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
          container: 'min-h-screen flex flex-col bg-gradient-to-b from-[#1a365d] via-[#234e7a] to-[#1a365d]',
          header: 'backdrop-blur-md bg-white/10 border-b border-white/20 p-4',
          headerText: 'text-white',
          progressLabel: 'text-white/80',
          questionRow: 'border-b border-white/10 py-3',
          questionNumber: 'text-white/60 font-normal',
          questionText: 'text-white leading-relaxed',
          radioColor: 'border-white/50 hover:border-white',
          radioChecked: 'border-white bg-white',
          radioInner: 'bg-[#1a365d]',
        };
      case 'minimal':
        return {
          container: 'min-h-screen flex flex-col bg-background',
          header: 'bg-card border-b p-4',
          headerText: 'text-foreground',
          progressLabel: 'text-muted-foreground',
          questionRow: 'border-b border-border py-3',
          questionNumber: 'text-muted-foreground font-normal',
          questionText: 'text-foreground leading-relaxed',
          radioColor: 'border-muted-foreground/50 hover:border-primary',
          radioChecked: 'border-primary bg-primary',
          radioInner: 'bg-white',
        };
      default:
        return {
          container: 'min-h-screen flex flex-col bg-background',
          header: 'bg-card border-b p-4 shadow-sm',
          headerText: 'text-foreground',
          progressLabel: 'text-muted-foreground',
          questionRow: 'border-b border-border py-3',
          questionNumber: 'text-primary font-medium',
          questionText: 'text-foreground leading-relaxed',
          radioColor: 'border-muted-foreground/50 hover:border-primary',
          radioChecked: 'border-primary bg-primary',
          radioInner: 'bg-white',
        };
    }
  }, [settings.testStyle]);

  const handleAnswer = (questionId: number, answer: AnswerType) => {
    setAnswer(questionId, answer);
  };

  const isApple = settings.testStyle === 'apple';

  return (
    <div className={styleClasses.container}>
      {/* Sticky Header */}
      <div className={cn("sticky top-0 z-10", styleClasses.header)}>
        <div className="container mx-auto max-w-4xl">
          {/* Верхняя панель с темой и помощью */}
          <div className="flex items-center justify-end gap-1 mb-3">
            <HelpTipsDialog className={isApple ? 'text-white/70 hover:text-white' : ''} />
            <ThemeToggle className={isApple ? 'text-white/70 hover:text-white' : ''} />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className={cn("text-sm font-medium", styleClasses.headerText)}>
              Прогресс: {answeredCount} из {totalQuestions}
            </span>
            <span className={cn("text-sm", styleClasses.progressLabel)}>
              {Math.round(progress)}%
            </span>
          </div>
          <Progress 
            value={progress} 
            className={cn("h-2", isApple && "bg-white/20")} 
          />
          
          {isComplete && (
            <Button 
              onClick={onComplete} 
              className={cn(
                "w-full mt-4",
                isApple ? "bg-white text-[#1a365d] hover:bg-white/90" : "bg-success hover:bg-success/90"
              )}
              size="lg"
            >
              Завершить тест
            </Button>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className={cn("border-b py-3 px-4", isApple ? "border-white/10 bg-white/5" : "border-border bg-muted/30")}>
        <div className="container mx-auto max-w-4xl">
          <table className="w-full text-sm">
            <tbody>
              <tr className={styleClasses.questionRow}>
                <td className="w-12 text-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 mx-auto",
                    isApple ? "border-white bg-white" : "border-primary bg-primary"
                  )}>
                    <div className={cn("w-full h-full rounded-full flex items-center justify-center")}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", isApple ? "bg-[#1a365d]" : "bg-white")} />
                    </div>
                  </div>
                </td>
                <td className="w-12 text-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 mx-auto",
                    isApple ? "border-white/50" : "border-muted-foreground/50"
                  )} />
                </td>
                <td className="w-12 text-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 mx-auto",
                    isApple ? "border-white/50" : "border-muted-foreground/50"
                  )} />
                </td>
                <td className={cn("pl-4", styleClasses.questionText)}>
                  означает <strong>да</strong> или <span className={isApple ? "text-white/80" : "text-muted-foreground"}>скорее всего да</span>
                </td>
              </tr>
              <tr className={styleClasses.questionRow}>
                <td className="w-12 text-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 mx-auto",
                    isApple ? "border-white/50" : "border-muted-foreground/50"
                  )} />
                </td>
                <td className="w-12 text-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 mx-auto",
                    isApple ? "border-white bg-white" : "border-primary bg-primary"
                  )}>
                    <div className={cn("w-full h-full rounded-full flex items-center justify-center")}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", isApple ? "bg-[#1a365d]" : "bg-white")} />
                    </div>
                  </div>
                </td>
                <td className="w-12 text-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 mx-auto",
                    isApple ? "border-white/50" : "border-muted-foreground/50"
                  )} />
                </td>
                <td className={cn("pl-4", styleClasses.questionText)}>
                  означает <strong>может быть</strong> или <span className={isApple ? "text-white/80" : "text-muted-foreground"}>неуверен</span>
                </td>
              </tr>
              <tr className={cn(styleClasses.questionRow, "border-b-0")}>
                <td className="w-12 text-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 mx-auto",
                    isApple ? "border-white/50" : "border-muted-foreground/50"
                  )} />
                </td>
                <td className="w-12 text-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 mx-auto",
                    isApple ? "border-white/50" : "border-muted-foreground/50"
                  )} />
                </td>
                <td className="w-12 text-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 mx-auto",
                    isApple ? "border-white bg-white" : "border-primary bg-primary"
                  )}>
                    <div className={cn("w-full h-full rounded-full flex items-center justify-center")}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", isApple ? "bg-[#1a365d]" : "bg-white")} />
                    </div>
                  </div>
                </td>
                <td className={cn("pl-4", styleClasses.questionText)}>
                  означает <strong>нет</strong> или <span className={isApple ? "text-white/80" : "text-muted-foreground"}>скорее всего нет</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section Title */}
      <div className={cn("py-3 px-4", isApple ? "bg-white/5" : "bg-muted/20")}>
        <div className="container mx-auto max-w-4xl">
          <h2 className={cn("text-lg font-semibold", isApple ? "text-orange-400" : "text-primary")}>
            Начало теста
          </h2>
        </div>
      </div>

      {/* Questions List */}
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-4xl px-4">
          <table className="w-full">
            <tbody>
              {questions.map((question, index) => {
                const answer = getAnswer(question.id);

                return (
                  <tr 
                    key={question.id}
                    className={cn(styleClasses.questionRow, "hover:bg-white/5")}
                  >
                    <td className={cn("w-8 text-right pr-2 align-top pt-1", styleClasses.questionNumber)}>
                      {index + 1}
                    </td>
                    <td className="w-10 text-center align-top pt-1">
                      <button
                        onClick={() => handleAnswer(question.id, 'yes')}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mx-auto",
                          answer === 'yes' 
                            ? styleClasses.radioChecked
                            : styleClasses.radioColor
                        )}
                      >
                        {answer === 'yes' && (
                          <div className={cn("w-2 h-2 rounded-full", styleClasses.radioInner)} />
                        )}
                      </button>
                    </td>
                    <td className="w-10 text-center align-top pt-1">
                      <button
                        onClick={() => handleAnswer(question.id, 'maybe')}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mx-auto",
                          answer === 'maybe' 
                            ? styleClasses.radioChecked
                            : styleClasses.radioColor
                        )}
                      >
                        {answer === 'maybe' && (
                          <div className={cn("w-2 h-2 rounded-full", styleClasses.radioInner)} />
                        )}
                      </button>
                    </td>
                    <td className="w-10 text-center align-top pt-1">
                      <button
                        onClick={() => handleAnswer(question.id, 'no')}
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mx-auto",
                          answer === 'no' 
                            ? styleClasses.radioChecked
                            : styleClasses.radioColor
                        )}
                      >
                        {answer === 'no' && (
                          <div className={cn("w-2 h-2 rounded-full", styleClasses.radioInner)} />
                        )}
                      </button>
                    </td>
                    <td className={cn("pl-3 align-top", styleClasses.questionText)}>
                      {question.text}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Complete Button (Fixed) */}
      {isComplete && (
        <div className={cn(
          "sticky bottom-0 border-t p-4",
          isApple ? "bg-[#1a365d]/90 backdrop-blur-md border-white/20" : "bg-card border-border"
        )}>
          <div className="container mx-auto max-w-4xl">
            <Button 
              onClick={onComplete} 
              className={cn(
                "w-full",
                isApple ? "bg-white text-[#1a365d] hover:bg-white/90" : "bg-success hover:bg-success/90"
              )}
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