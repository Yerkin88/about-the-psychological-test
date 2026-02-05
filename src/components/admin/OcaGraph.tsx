import { useMemo } from 'react';
import { Percentiles, ScaleKey, AnswerType } from '@/types/oca';
import ocaTemplate from '@/assets/oca-template.jpg';
 
 interface Props {
   percentiles: Percentiles;
   clientName: string;
   clientAge: number;
   testDate: string;
   q22Answer: AnswerType;
   q197Answer: AnswerType;
 }
 
// Координаты откалиброваны под изображение трафарета (1156x842)
const TEMPLATE = {
  width: 1156,
  height: 842,
  // Область графика (шкала -100..+100)
  graph: {
    left: 116,    // X левой оси (A)
    right: 1040,  // X правой оси (J)
    top: 131,     // Y = +100
    bottom: 593,  // Y = -100
  },
};

 export default function OcaGraph({ 
   percentiles, 
   clientName, 
   clientAge, 
   testDate,
   q22Answer,
   q197Answer,
 }: Props) {
   const scales: ScaleKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const { width, height, graph } = TEMPLATE;
  const graphWidth = graph.right - graph.left;
  const graphHeight = graph.bottom - graph.top;
  const xStep = graphWidth / (scales.length - 1);

  // Преобразование значения -100..+100 в Y-координату
  const yScale = (value: number) => {
    const normalized = (100 - value) / 200; // 0 = +100, 1 = -100
    return graph.top + normalized * graphHeight;
  };
 
   // Точки графика
   const points = useMemo(() => {
     return scales.map((scale, i) => ({
      x: graph.left + i * xStep,
       y: yScale(percentiles[scale]),
       value: percentiles[scale],
       scale,
     }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [percentiles]);
 
   // Путь линии
   const linePath = points.map((p, i) => 
     `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
   ).join(' ');
 
  // Показывать Q22/Q197 только если ответ положительный
  const showQ22 = q22Answer === 'yes';
  const showQ197 = q197Answer === 'yes';

  // Строка значений A-J для нижней части
  const valuesLine = scales
    .map((s) => `${s}:${percentiles[s] > 0 ? '' : ''}${percentiles[s]}`)
    .join('  ');
 
   return (
    <div className="bg-white rounded-lg overflow-hidden">
       <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Фон — изображение трафарета */}
        <image
          href={ocaTemplate}
          x={0}
          y={0}
          width={width}
          height={height}
          preserveAspectRatio="none"
        />
 
         {/* Линия графика */}
         <path
           d={linePath}
           fill="none"
          stroke="#000000"
          strokeWidth={2.5}
           strokeLinecap="round"
           strokeLinejoin="round"
         />
 
         {/* Точки */}
         {points.map((point) => (
           <g key={point.scale}>
             <circle
               cx={point.x}
               cy={point.y}
              r={6}
              fill="#000000"
            />
           </g>
         ))}
 
        {/* Данные клиента — верхняя часть */}
        <text x={220} y={52} fontSize={18} fontWeight={700} fill="#000">
          {clientName}
        </text>
        <text x={920} y={52} fontSize={16} fill="#000">
          {clientAge}
        </text>
        <text x={1020} y={52} fontSize={16} fill="#000">
          {testDate}
        </text>

        {/* Значения шкал A-J внизу */}
        <text x={116} y={795} fontSize={15} fontWeight={600} fill="#000">
          {valuesLine}
        </text>

        {/* Q22/Q197 — только если положительные */}
        {(showQ22 || showQ197) && (
          <text x={850} y={795} fontSize={14} fill="#000">
            {showQ22 && 'Q22: +'}
            {showQ22 && showQ197 && '   '}
            {showQ197 && 'Q197: +'}
          </text>
        )}
       </svg>
     </div>
   );
 }