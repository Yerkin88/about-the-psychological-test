 import { useRef } from 'react';
 import { Card, CardContent } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Check, Minus, X } from 'lucide-react';
 import { useTestState } from '@/hooks/useTestState';
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
   const containerRef = useRef<HTMLDivElement>(null);
 
   const progress = (answeredCount / totalQuestions) * 100;
 
   const handleAnswer = (questionId: number, answer: AnswerType) => {
     setAnswer(questionId, answer);
   };
 
   return (
     <div className="min-h-screen flex flex-col">
       {/* Sticky Header */}
       <div className="sticky top-0 z-10 bg-card border-b p-4 shadow-sm">
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
         <div className="container mx-auto max-w-4xl py-4 px-4 space-y-4">
           {questions.map((question, index) => {
             const answer = getAnswer(question.id);
             const isAnswered = answer !== undefined;
 
             return (
               <Card 
                 key={question.id}
                 className={cn(
                   'transition-all',
                   isAnswered ? 'border-success/50 bg-success/5' : 'border-border'
                 )}
               >
                 <CardContent className="p-4">
                   <div className="flex gap-4">
                     {/* Номер вопроса */}
                     <div className={cn(
                       'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0',
                       isAnswered ? 'bg-success text-success-foreground' : 'bg-secondary text-secondary-foreground'
                     )}>
                       {index + 1}
                     </div>
 
                     <div className="flex-1">
                       {/* Текст вопроса */}
                       <p className="text-foreground mb-3 leading-relaxed">
                         {question.text}
                       </p>
 
                       {/* Кнопки ответов */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAnswer(question.id, 'yes')}
                          className={cn(
                            'flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200',
                            'flex items-center justify-center gap-1.5',
                            'active:scale-95 touch-manipulation',
                            answer === 'yes'
                              ? 'bg-success text-success-foreground shadow-md'
                              : 'bg-success/10 text-success hover:bg-success/20 border border-success/30'
                          )}
                        >
                          <Check className="w-4 h-4" />
                          <span>Да</span>
                        </button>

                        <button
                          onClick={() => handleAnswer(question.id, 'maybe')}
                          className={cn(
                            'flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200',
                            'flex items-center justify-center gap-1.5',
                            'active:scale-95 touch-manipulation',
                            answer === 'maybe'
                              ? 'bg-warning text-warning-foreground shadow-md'
                              : 'bg-warning/10 text-warning hover:bg-warning/20 border border-warning/30'
                          )}
                        >
                          <Minus className="w-4 h-4" />
                          <span>Может</span>
                        </button>

                        <button
                          onClick={() => handleAnswer(question.id, 'no')}
                          className={cn(
                            'flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200',
                            'flex items-center justify-center gap-1.5',
                            'active:scale-95 touch-manipulation',
                            answer === 'no'
                              ? 'bg-destructive text-destructive-foreground shadow-md'
                              : 'bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30'
                          )}
                        >
                          <X className="w-4 h-4" />
                          <span>Нет</span>
                        </button>
                       </div>
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