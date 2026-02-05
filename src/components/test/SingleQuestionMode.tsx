 import { useEffect, useCallback } from 'react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
 import { ChevronLeft, ChevronRight, CheckCircle, Circle, XCircle } from 'lucide-react';
 import { useTestState } from '@/hooks/useTestState';
 import { AnswerType } from '@/types/oca';
 
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
   }, [handleAnswer, nextQuestion, prevQuestion]);
 
   return (
     <div className="min-h-screen flex flex-col">
       {/* Header с прогрессом */}
       <div className="bg-card border-b p-4">
         <div className="container mx-auto max-w-2xl">
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
       <div className="flex-1 flex items-center justify-center p-4">
         <Card className="w-full max-w-2xl shadow-lg">
           <CardContent className="p-8">
             <p className="text-xl md:text-2xl text-foreground text-center leading-relaxed mb-8">
               {currentQuestion.text}
             </p>
 
             {/* Кнопки ответов */}
             <div className="grid grid-cols-3 gap-4 mb-8">
               <Button
                 variant={currentAnswer === 'yes' ? 'default' : 'outline'}
                 size="lg"
                 className={`h-20 flex-col gap-2 ${currentAnswer === 'yes' ? 'bg-success hover:bg-success/90' : ''}`}
                 onClick={() => handleAnswer('yes')}
               >
                 <CheckCircle className="w-6 h-6" />
                 <span>ДА</span>
               </Button>
 
               <Button
                 variant={currentAnswer === 'maybe' ? 'default' : 'outline'}
                 size="lg"
                 className={`h-20 flex-col gap-2 ${currentAnswer === 'maybe' ? 'bg-warning hover:bg-warning/90' : ''}`}
                 onClick={() => handleAnswer('maybe')}
               >
                 <Circle className="w-6 h-6" />
                 <span>ВОЗМОЖНО</span>
               </Button>
 
               <Button
                 variant={currentAnswer === 'no' ? 'default' : 'outline'}
                 size="lg"
                 className={`h-20 flex-col gap-2 ${currentAnswer === 'no' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
                 onClick={() => handleAnswer('no')}
               >
                 <XCircle className="w-6 h-6" />
                 <span>НЕТ</span>
               </Button>
             </div>
 
             {/* Подсказка по клавишам */}
             <p className="text-xs text-muted-foreground text-center">
               Горячие клавиши: 1/Y — Да, 2/M — Возможно, 3/N — Нет, ← → — навигация
             </p>
           </CardContent>
         </Card>
       </div>
 
       {/* Footer с навигацией */}
       <div className="bg-card border-t p-4">
         <div className="container mx-auto max-w-2xl flex items-center justify-between">
           <Button
             variant="outline"
             onClick={prevQuestion}
             disabled={currentQuestionIndex === 0}
           >
             <ChevronLeft className="w-4 h-4 mr-2" />
             Назад
           </Button>
 
           {isComplete ? (
             <Button onClick={onComplete} className="bg-success hover:bg-success/90">
               Завершить тест
             </Button>
           ) : (
             <Button
               variant="outline"
               onClick={nextQuestion}
               disabled={currentQuestionIndex === totalQuestions - 1}
             >
               Вперёд
               <ChevronRight className="w-4 h-4 ml-2" />
             </Button>
           )}
         </div>
       </div>
     </div>
   );
 }