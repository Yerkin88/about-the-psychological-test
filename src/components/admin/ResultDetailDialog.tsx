import { useCallback, useMemo, useRef } from 'react';
 import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/sonner';
import { Copy, Download, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { questions } from '@/data/questions';
import { AnswerType, TestResult, ScaleKey } from '@/types/oca';
 import { scaleNames } from '@/data/keys';
 import OcaGraph from './OcaGraph';
 
 interface Props {
   result: TestResult | null;
   onClose: () => void;
 }
 
 export default function ResultDetailDialog({ result, onClose }: Props) {
   const graphRef = useRef<HTMLDivElement>(null);

  const safeAnswers = result?.answers ?? [];
 
   const formatDate = (date: Date | string) => {
     return new Date(date).toLocaleDateString('ru-RU', {
       day: '2-digit',
       month: '2-digit',
       year: 'numeric',
     });
   };
 
  const answerLabel = (answer?: AnswerType) => {
    switch (answer) {
      case 'yes':
        return '+';
      case 'maybe':
        return '?';
      case 'no':
        return '-';
      default:
        return '';
    }
  };

  const answersByQuestionId = useMemo(() => {
    const map = new Map<number, AnswerType>();
    safeAnswers.forEach((a) => map.set(a.questionId, a.answer));
    return map;
  }, [safeAnswers]);

  const buildCopyText = useCallback(() => {
    return questions
      .map((q) => {
        const symbol = answerLabel(answersByQuestionId.get(q.id)) || '?';
        return `Q${q.id}: ${symbol}`;
      })
      .join('\n');
  }, [answersByQuestionId]);

  const handleCopyAll = useCallback(async () => {
    const text = buildCopyText();
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Скопировано в буфер обмена');
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      ok ? toast.success('Скопировано в буфер обмена') : toast.error('Не удалось скопировать');
    }
  }, [buildCopyText]);

  const handleDownloadJpg = useCallback(async () => {
    try {
      if (!result) return;
      const container = graphRef.current;
      const svg = container?.querySelector('svg') as SVGSVGElement | null;
      if (!svg) {
        toast.error('График не найден');
        return;
      }

      const cloned = svg.cloneNode(true) as SVGSVGElement;

      // Прокидываем CSS-переменные темы внутрь SVG, чтобы `hsl(var(--...))` корректно отрисовалось при экспорте
      const rootStyles = getComputedStyle(document.documentElement);
      const cssVars = ['--primary', '--foreground', '--muted-foreground', '--border', '--background'];
      cssVars.forEach((v) => cloned.style.setProperty(v, rootStyles.getPropertyValue(v).trim()));
      cloned.style.fontFamily = getComputedStyle(svg).fontFamily;

      // Встраиваем минимальные стили Tailwind-классов, которые используются внутри SVG
      const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      styleEl.textContent = `
        text { font-family: ${getComputedStyle(svg).fontFamily}; }
        .text-xs { font-size: 12px; }
        .text-sm { font-size: 14px; }
        .text-lg { font-size: 18px; }
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .fill-foreground { fill: hsl(var(--foreground)); }
        .fill-muted-foreground { fill: hsl(var(--muted-foreground)); }
        .fill-primary { fill: hsl(var(--primary)); }
      `;
      cloned.insertBefore(styleEl, cloned.firstChild);

      if (!cloned.getAttribute('xmlns')) {
        cloned.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(cloned);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('image_load_failed'));
        img.src = url;
      });

      const vb = svg.viewBox?.baseVal;
      const baseW = vb?.width || 800;
      const baseH = vb?.height || 500;
      const scale = 2;

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(baseW * scale);
      canvas.height = Math.round(baseH * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('no_canvas');

      const bgVar = rootStyles.getPropertyValue('--background').trim();
      ctx.fillStyle = bgVar ? `hsl(${bgVar})` : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);

      const filename = `OCA_${result.clientInfo.name}_${formatDate(result.createdAt)}`
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_');

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            toast.error('Не удалось сформировать JPG');
            return;
          }
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `${filename}.jpg`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(a.href), 5000);
          toast.success('Скачивание началось');
        },
        'image/jpeg',
        0.95,
      );
    } catch {
      toast.error('Ошибка при скачивании');
    }
  }, [result]);

  if (!result) return null;
 
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

            {/* Все ответы */}
            <div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="answers">
                  <AccordionTrigger>Все ответы (200)</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex justify-end pb-3">
                      <Button variant="outline" size="sm" className="gap-2" onClick={handleCopyAll}>
                        <Copy className="w-4 h-4" />
                        Копировать всё
                      </Button>
                    </div>

                    <ScrollArea className="h-[420px] rounded-md border">
                      <div className="p-3 space-y-2">
                        {questions.map((q) => {
                          const symbol = answerLabel(answersByQuestionId.get(q.id)) || '?';
                          return (
                            <div key={q.id} className="grid grid-cols-[64px_1fr_32px] gap-3 items-start py-2 border-b last:border-b-0">
                              <div className="text-xs text-muted-foreground">Q{q.id}</div>
                              <div className="text-sm leading-snug">{q.text}</div>
                              <div className="text-sm font-semibold text-right">{symbol}</div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
 
           {/* График */}
            <div>
              <h3 className="font-semibold mb-3">График OCA</h3>
              <div ref={graphRef}>
                <OcaGraph 
                  percentiles={result.percentiles}
                  clientName={result.clientInfo.name}
                  clientAge={result.clientInfo.age}
                  testDate={formatDate(result.createdAt)}
                  q22Answer={result.question22Answer}
                  q197Answer={result.question197Answer}
                />
              </div>
            </div>
 
           {/* Кнопка скачивания */}
           <div className="flex justify-end">
              <Button className="gap-2" onClick={handleDownloadJpg}>
               <Download className="w-4 h-4" />
               Скачать JPG
             </Button>
           </div>
         </div>
       </DialogContent>
     </Dialog>
   );
 }