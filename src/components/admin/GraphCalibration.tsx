 import { useState, useRef, useCallback } from 'react';
 import { Button } from '@/components/ui/button';
 import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { toast } from '@/components/ui/sonner';
 import { Crosshair, Settings2, RotateCcw } from 'lucide-react';
 import ocaTemplate from '@/assets/oca-template.jpg';
 
 interface CalibrationPoints {
   top: number;    // Y for +100
   bottom: number; // Y for -100
   left: number;   // X for scale A
   right: number;  // X for scale J
 }
 
 interface Props {
   open: boolean;
   onClose: () => void;
   onSave: (points: CalibrationPoints) => void;
   currentPoints: CalibrationPoints;
 }
 
 type CalibrationStep = 'idle' | '+100' | '-100' | 'A' | 'J' | 'done';
 
 const STEP_LABELS: Record<CalibrationStep, string> = {
   'idle': 'Нажмите "Начать калибровку"',
   '+100': 'Кликните на линию +100 (верхняя граница)',
   '-100': 'Кликните на линию -100 (нижняя граница)',
   'A': 'Кликните на шкалу A (левая граница)',
   'J': 'Кликните на шкалу J (правая граница)',
   'done': 'Калибровка завершена!',
 };
 
 const DEFAULT_POINTS: CalibrationPoints = {
   top: 127,
   bottom: 596,
   left: 116,
   right: 1040,
 };
 
 export default function GraphCalibration({ open, onClose, onSave, currentPoints }: Props) {
   const [mode, setMode] = useState<'auto' | 'manual'>('auto');
   const [step, setStep] = useState<CalibrationStep>('idle');
   const [points, setPoints] = useState<CalibrationPoints>(currentPoints);
   const [manualPoints, setManualPoints] = useState<CalibrationPoints>(currentPoints);
   const imageRef = useRef<HTMLImageElement>(null);
 
   const handleImageClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
     if (mode !== 'auto' || step === 'idle' || step === 'done') return;
 
     const img = imageRef.current;
     if (!img) return;
 
     const rect = img.getBoundingClientRect();
     const scaleX = 1156 / rect.width;
     const scaleY = 842 / rect.height;
     
     const x = Math.round((e.clientX - rect.left) * scaleX);
     const y = Math.round((e.clientY - rect.top) * scaleY);
 
     switch (step) {
       case '+100':
         setPoints(prev => ({ ...prev, top: y }));
         setStep('-100');
         break;
       case '-100':
         setPoints(prev => ({ ...prev, bottom: y }));
         setStep('A');
         break;
       case 'A':
         setPoints(prev => ({ ...prev, left: x }));
         setStep('J');
         break;
       case 'J':
         setPoints(prev => ({ ...prev, right: x }));
         setStep('done');
         break;
     }
   }, [mode, step]);
 
   const startCalibration = () => {
     setStep('+100');
     setPoints(currentPoints);
   };
 
   const resetCalibration = () => {
     setStep('idle');
     setPoints(DEFAULT_POINTS);
     setManualPoints(DEFAULT_POINTS);
   };
 
   const handleSave = () => {
     const finalPoints = mode === 'auto' ? points : manualPoints;
     onSave(finalPoints);
     toast.success('Калибровка сохранена');
     onClose();
   };
 
   const handleManualChange = (key: keyof CalibrationPoints, value: string) => {
     const num = parseInt(value, 10);
     if (!isNaN(num)) {
       setManualPoints(prev => ({ ...prev, [key]: num }));
     }
   };
 
   return (
     <Dialog open={open} onOpenChange={() => onClose()}>
       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle>Калибровка графика OCA</DialogTitle>
         </DialogHeader>
 
         <div className="space-y-4">
           {/* Режим переключения */}
           <div className="flex gap-2">
             <Button
               variant={mode === 'auto' ? 'default' : 'outline'}
               onClick={() => setMode('auto')}
               className="gap-2"
             >
               <Crosshair className="w-4 h-4" />
               Автоматическая (4 клика)
             </Button>
             <Button
               variant={mode === 'manual' ? 'default' : 'outline'}
               onClick={() => setMode('manual')}
               className="gap-2"
             >
               <Settings2 className="w-4 h-4" />
               Ручная настройка
             </Button>
             <Button variant="ghost" onClick={resetCalibration} className="gap-2 ml-auto">
               <RotateCcw className="w-4 h-4" />
               Сброс
             </Button>
           </div>
 
           {mode === 'auto' ? (
             <>
               {/* Инструкция */}
               <div className="p-3 bg-secondary/50 rounded-lg text-center">
                 <p className="font-medium">{STEP_LABELS[step]}</p>
                 {step !== 'idle' && step !== 'done' && (
                   <p className="text-sm text-muted-foreground mt-1">
                     Шаг {['idle', '+100', '-100', 'A', 'J', 'done'].indexOf(step)} из 4
                   </p>
                 )}
               </div>
 
               {step === 'idle' && (
                 <Button onClick={startCalibration} className="w-full">
                   Начать калибровку
                 </Button>
               )}
 
               {/* Изображение для калибровки */}
               <div className="relative border rounded-lg overflow-hidden">
                 <img
                   ref={imageRef}
                   src={ocaTemplate}
                   alt="OCA Template"
                   className={`w-full ${step !== 'idle' && step !== 'done' ? 'cursor-crosshair' : ''}`}
                   onClick={handleImageClick}
                 />
                 
                 {/* Показать отмеченные точки */}
                 {step !== 'idle' && (
                   <svg 
                     className="absolute inset-0 w-full h-full pointer-events-none"
                     viewBox="0 0 1156 842"
                     preserveAspectRatio="none"
                   >
                     {/* Горизонтальные линии */}
                     {points.top !== currentPoints.top && (
                       <line x1={0} y1={points.top} x2={1156} y2={points.top} stroke="red" strokeWidth={2} />
                     )}
                     {points.bottom !== currentPoints.bottom && (
                       <line x1={0} y1={points.bottom} x2={1156} y2={points.bottom} stroke="blue" strokeWidth={2} />
                     )}
                     {/* Вертикальные линии */}
                     {points.left !== currentPoints.left && (
                       <line x1={points.left} y1={0} x2={points.left} y2={842} stroke="green" strokeWidth={2} />
                     )}
                     {points.right !== currentPoints.right && (
                       <line x1={points.right} y1={0} x2={points.right} y2={842} stroke="orange" strokeWidth={2} />
                     )}
                   </svg>
                 )}
               </div>
 
               {/* Текущие значения */}
               <div className="grid grid-cols-4 gap-2 text-sm">
                 <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded text-center">
                   <span className="font-medium">+100:</span> Y={points.top}
                 </div>
                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-center">
                   <span className="font-medium">-100:</span> Y={points.bottom}
                 </div>
                 <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded text-center">
                   <span className="font-medium">A:</span> X={points.left}
                 </div>
                 <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded text-center">
                   <span className="font-medium">J:</span> X={points.right}
                 </div>
               </div>
             </>
           ) : (
             /* Ручная настройка */
             <div className="space-y-4">
               <p className="text-sm text-muted-foreground">
                 Введите точные координаты в пикселях (размер изображения: 1156×842)
               </p>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Y для +100 (верхняя граница)</Label>
                   <Input 
                     type="number" 
                     value={manualPoints.top}
                     onChange={(e) => handleManualChange('top', e.target.value)}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>Y для -100 (нижняя граница)</Label>
                   <Input 
                     type="number" 
                     value={manualPoints.bottom}
                     onChange={(e) => handleManualChange('bottom', e.target.value)}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>X для шкалы A (левая граница)</Label>
                   <Input 
                     type="number" 
                     value={manualPoints.left}
                     onChange={(e) => handleManualChange('left', e.target.value)}
                   />
                 </div>
                 <div className="space-y-2">
                   <Label>X для шкалы J (правая граница)</Label>
                   <Input 
                     type="number" 
                     value={manualPoints.right}
                     onChange={(e) => handleManualChange('right', e.target.value)}
                   />
                 </div>
               </div>
 
               {/* Предпросмотр */}
               <div className="relative border rounded-lg overflow-hidden">
                 <img src={ocaTemplate} alt="OCA Template" className="w-full" />
                 <svg 
                   className="absolute inset-0 w-full h-full pointer-events-none"
                   viewBox="0 0 1156 842"
                   preserveAspectRatio="none"
                 >
                   <line x1={0} y1={manualPoints.top} x2={1156} y2={manualPoints.top} stroke="red" strokeWidth={2} strokeDasharray="5,5" />
                   <line x1={0} y1={manualPoints.bottom} x2={1156} y2={manualPoints.bottom} stroke="blue" strokeWidth={2} strokeDasharray="5,5" />
                   <line x1={manualPoints.left} y1={0} x2={manualPoints.left} y2={842} stroke="green" strokeWidth={2} strokeDasharray="5,5" />
                   <line x1={manualPoints.right} y1={0} x2={manualPoints.right} y2={842} stroke="orange" strokeWidth={2} strokeDasharray="5,5" />
                 </svg>
               </div>
             </div>
           )}
 
           {/* Кнопка сохранения */}
           <div className="flex justify-end gap-2">
             <Button variant="outline" onClick={onClose}>Отмена</Button>
             <Button onClick={handleSave} disabled={mode === 'auto' && step !== 'done'}>
               Сохранить калибровку
             </Button>
           </div>
         </div>
       </DialogContent>
     </Dialog>
   );
 }
 
 export type { CalibrationPoints };