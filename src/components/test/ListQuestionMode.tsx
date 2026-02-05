 import { useRef } from 'react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
 import { CheckCircle, Circle, XCircle } from 'lucide-react';
 import { useTestState } from '@/hooks/useTestState';
 import { questions } from '@/data/questions';
 import { AnswerType } from '@/types/oca';
 import { cn } from '@/lib/utils';
 
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
                       <div className="flex flex-wrap gap-2">
                         <Button
                           variant={answer === 'yes' ? 'default' : 'outline'}
                           size="sm"
                           className={cn(
                             'flex-1 min-w-[100px]',
                             answer === 'yes' && 'bg-success hover:bg-success/90'
                           )}
                           onClick={() => handleAnswer(question.id, 'yes')}
                         >
                           <CheckCircle className="w-4 h-4 mr-1" />
                           Да
                         </Button>
 
                         <Button
                           variant={answer === 'maybe' ? 'default' : 'outline'}
                           size="sm"
                           className={cn(
                             'flex-1 min-w-[100px]',
                             answer === 'maybe' && 'bg-warning hover:bg-warning/90'
                           )}
                           onClick={() => handleAnswer(question.id, 'maybe')}
                         >
                           <Circle className="w-4 h-4 mr-1" />
                           Возможно
                         </Button>
 
                         <Button
                           variant={answer === 'no' ? 'default' : 'outline'}
                           size="sm"
                           className={cn(
                             'flex-1 min-w-[100px]',
                             answer === 'no' && 'bg-destructive hover:bg-destructive/90'
                           )}
                           onClick={() => handleAnswer(question.id, 'no')}
                         >
                           <XCircle className="w-4 h-4 mr-1" />
                           Нет
                         </Button>
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