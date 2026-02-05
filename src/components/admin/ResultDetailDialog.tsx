 import { useRef } from 'react';
 import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Download, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
 import { TestResult, ScaleKey } from '@/types/oca';
 import { scaleNames } from '@/data/keys';
 import OcaGraph from './OcaGraph';
 
 interface Props {
   result: TestResult | null;
   onClose: () => void;
 }
 
 export default function ResultDetailDialog({ result, onClose }: Props) {
   const graphRef = useRef<HTMLDivElement>(null);
 
   if (!result) return null;
 
   const formatDate = (date: Date | string) => {
     return new Date(date).toLocaleDateString('ru-RU', {
       day: '2-digit',
       month: '2-digit',
       year: 'numeric',
     });
   };
 
   const answerLabel = (answer: string) => {
     switch (answer) {
       case 'yes': return '+';
       case 'maybe': return '?';
       case 'no': return '-';
       default: return '?';
     }
   };
 
   const scales: ScaleKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
 
   return (
     <Dialog open={!!result} onOpenChange={() => onClose()}>
       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle>Результат теста</DialogTitle>
         </DialogHeader>
 
         <div className="space-y-6">
           {/* Информация о клиенте */}
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg">
             <div className="flex items-center gap-2">
               <User className="w-4 h-4 text-muted-foreground" />
               <div>
                 <p className="text-xs text-muted-foreground">Имя</p>
                 <p className="font-medium">{result.clientInfo.name}</p>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <Phone className="w-4 h-4 text-muted-foreground" />
               <div>
                 <p className="text-xs text-muted-foreground">Телефон</p>
                 <p className="font-medium">{result.clientInfo.phone}</p>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <Mail className="w-4 h-4 text-muted-foreground" />
               <div>
                 <p className="text-xs text-muted-foreground">Email</p>
                 <p className="font-medium">{result.clientInfo.email}</p>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <MapPin className="w-4 h-4 text-muted-foreground" />
               <div>
                 <p className="text-xs text-muted-foreground">Город</p>
                 <p className="font-medium">{result.clientInfo.city || '-'}</p>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <Calendar className="w-4 h-4 text-muted-foreground" />
               <div>
                 <p className="text-xs text-muted-foreground">Дата</p>
                 <p className="font-medium">{formatDate(result.createdAt)}</p>
               </div>
             </div>
             <div>
               <p className="text-xs text-muted-foreground">Возраст/Пол</p>
               <p className="font-medium">
                 {result.clientInfo.age} лет, {result.clientInfo.gender === 'male' ? 'Мужской' : 'Женский'}
               </p>
             </div>
           </div>
 
           {/* Контрольные вопросы и статистика */}
           <div className="flex flex-wrap gap-4">
             <Badge variant="outline" className="text-sm">
               Q22: {answerLabel(result.question22Answer)}
             </Badge>
             <Badge variant="outline" className="text-sm">
               Q197: {answerLabel(result.question197Answer)}
             </Badge>
             <Badge variant="secondary" className="text-sm">
               "Возможно": {result.maybeCount}
             </Badge>
             <Badge variant="secondary" className="text-sm">
               Время: {result.durationMinutes} мин
             </Badge>
           </div>
 
           {/* Результаты по шкалам */}
           <div>
             <h3 className="font-semibold mb-3">Результаты по шкалам</h3>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
               {scales.map((scale) => (
                 <div 
                   key={scale} 
                   className="p-3 border rounded-lg text-center"
                 >
                   <p className="text-lg font-bold text-primary">{scale}</p>
                   <p className="text-xs text-muted-foreground mb-1">{scaleNames[scale]}</p>
                   <p className="text-xl font-semibold">
                     {result.percentiles[scale] > 0 ? '+' : ''}{result.percentiles[scale]}
                   </p>
                   <p className="text-xs text-muted-foreground">
                     (сырой: {result.rawScores[scale]})
                   </p>
                 </div>
               ))}
             </div>
           </div>
 
           {/* График */}
           <div ref={graphRef}>
             <h3 className="font-semibold mb-3">График OCA</h3>
             <OcaGraph 
               percentiles={result.percentiles}
               clientName={result.clientInfo.name}
               clientAge={result.clientInfo.age}
               testDate={formatDate(result.createdAt)}
               q22Answer={result.question22Answer}
               q197Answer={result.question197Answer}
             />
           </div>
 
           {/* Кнопка скачивания */}
           <div className="flex justify-end">
             <Button className="gap-2">
               <Download className="w-4 h-4" />
               Скачать JPG
             </Button>
           </div>
         </div>
       </DialogContent>
     </Dialog>
   );
 }