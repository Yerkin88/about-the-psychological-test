 import { useMemo } from 'react';
 import { Percentiles, ScaleKey, AnswerType } from '@/types/oca';
 import { scaleNames } from '@/data/keys';
 
 interface Props {
   percentiles: Percentiles;
   clientName: string;
   clientAge: number;
   testDate: string;
   q22Answer: AnswerType;
   q197Answer: AnswerType;
 }
 
 export default function OcaGraph({ 
   percentiles, 
   clientName, 
   clientAge, 
   testDate,
   q22Answer,
   q197Answer,
 }: Props) {
   const scales: ScaleKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
   
   // Размеры графика
   const width = 800;
   const height = 500;
   const padding = { top: 60, right: 40, bottom: 120, left: 60 };
   const graphWidth = width - padding.left - padding.right;
   const graphHeight = height - padding.top - padding.bottom;
 
   // Масштабирование
   const xStep = graphWidth / (scales.length - 1);
   const yScale = (value: number) => {
     // Преобразование от -100..+100 к координатам
     const normalized = (100 - value) / 200; // 0 = +100, 1 = -100
     return padding.top + normalized * graphHeight;
   };
 
   // Точки графика
   const points = useMemo(() => {
     return scales.map((scale, i) => ({
       x: padding.left + i * xStep,
       y: yScale(percentiles[scale]),
       value: percentiles[scale],
       scale,
     }));
   }, [percentiles]);
 
   // Путь линии
   const linePath = points.map((p, i) => 
     `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
   ).join(' ');
 
   const answerLabel = (answer: AnswerType) => {
     switch (answer) {
       case 'yes': return '+';
       case 'maybe': return '?';
       case 'no': return '-';
     }
   };
 
   // Зоны цветов
   const zones = [
     { min: 70, max: 100, color: 'hsl(142, 76%, 90%)' },   // Зелёный - отлично
     { min: 30, max: 70, color: 'hsl(142, 50%, 95%)' },    // Светло-зелёный
     { min: 0, max: 30, color: 'hsl(60, 80%, 95%)' },      // Жёлтый - нормально
     { min: -30, max: 0, color: 'hsl(38, 92%, 95%)' },     // Оранжевый
     { min: -70, max: -30, color: 'hsl(0, 60%, 95%)' },    // Светло-красный
     { min: -100, max: -70, color: 'hsl(0, 84%, 92%)' },   // Красный - внимание
   ];
 
   return (
     <div className="bg-card border rounded-lg p-4">
       <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
         {/* Фон с зонами */}
         {zones.map((zone, i) => (
           <rect
             key={i}
             x={padding.left}
             y={yScale(zone.max)}
             width={graphWidth}
             height={yScale(zone.min) - yScale(zone.max)}
             fill={zone.color}
           />
         ))}
 
         {/* Сетка горизонтальная */}
         {[-100, -70, -30, 0, 30, 70, 100].map((value) => (
           <g key={value}>
             <line
               x1={padding.left}
               y1={yScale(value)}
               x2={padding.left + graphWidth}
               y2={yScale(value)}
               stroke="hsl(var(--border))"
               strokeWidth={value === 0 ? 2 : 1}
               strokeDasharray={value === 0 ? '' : '4,4'}
             />
             <text
               x={padding.left - 10}
               y={yScale(value)}
               textAnchor="end"
               dominantBaseline="middle"
               className="text-xs fill-muted-foreground"
             >
               {value > 0 ? `+${value}` : value}
             </text>
           </g>
         ))}
 
         {/* Сетка вертикальная + подписи шкал */}
         {scales.map((scale, i) => (
           <g key={scale}>
             <line
               x1={padding.left + i * xStep}
               y1={padding.top}
               x2={padding.left + i * xStep}
               y2={padding.top + graphHeight}
               stroke="hsl(var(--border))"
               strokeDasharray="4,4"
             />
             <text
               x={padding.left + i * xStep}
               y={padding.top + graphHeight + 20}
               textAnchor="middle"
               className="text-sm font-bold fill-foreground"
             >
               {scale}
             </text>
             <text
               x={padding.left + i * xStep}
               y={padding.top + graphHeight + 38}
               textAnchor="middle"
               className="text-xs fill-muted-foreground"
             >
               {scaleNames[scale]}
             </text>
           </g>
         ))}
 
         {/* Линия графика */}
         <path
           d={linePath}
           fill="none"
           stroke="hsl(var(--primary))"
           strokeWidth={3}
           strokeLinecap="round"
           strokeLinejoin="round"
         />
 
         {/* Точки */}
         {points.map((point) => (
           <g key={point.scale}>
             <circle
               cx={point.x}
               cy={point.y}
               r={8}
               fill="hsl(var(--primary))"
               stroke="white"
               strokeWidth={2}
             />
             <text
               x={point.x}
               y={point.y - 15}
               textAnchor="middle"
               className="text-xs font-semibold fill-foreground"
             >
               {point.value > 0 ? `+${point.value}` : point.value}
             </text>
           </g>
         ))}
 
         {/* Заголовок */}
         <text
           x={width / 2}
           y={25}
           textAnchor="middle"
           className="text-lg font-bold fill-foreground"
         >
           Oxford Capacity Analysis
         </text>
 
         {/* Информация о клиенте внизу */}
         <g transform={`translate(${padding.left}, ${height - 55})`}>
           <text className="text-sm fill-foreground">
             <tspan fontWeight="bold">Имя: </tspan>
             <tspan>{clientName}</tspan>
           </text>
           <text y={18} className="text-sm fill-foreground">
             <tspan fontWeight="bold">Возраст: </tspan>
             <tspan>{clientAge} лет</tspan>
           </text>
           <text y={36} className="text-sm fill-foreground">
             <tspan fontWeight="bold">Дата: </tspan>
             <tspan>{testDate}</tspan>
           </text>
         </g>
 
         {/* Контрольные вопросы */}
         <g transform={`translate(${width - padding.right - 150}, ${height - 55})`}>
           <text className="text-sm fill-muted-foreground">
             Q22: {answerLabel(q22Answer)}
           </text>
           <text y={18} className="text-sm fill-muted-foreground">
             Q197: {answerLabel(q197Answer)}
           </text>
         </g>
 
         {/* Значения A-J внизу */}
         <g transform={`translate(${padding.left}, ${height - 15})`}>
           {scales.map((scale, i) => (
             <text
               key={scale}
               x={i * xStep}
               textAnchor="middle"
               className="text-xs font-medium fill-primary"
             >
               {percentiles[scale] > 0 ? '+' : ''}{percentiles[scale]}
             </text>
           ))}
         </g>
       </svg>
     </div>
   );
 }