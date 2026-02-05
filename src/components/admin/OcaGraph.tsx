import { useMemo } from 'react';
import { Percentiles, ScaleKey, AnswerType, CalibrationPoints } from '@/types/oca';
import ocaTemplate from '@/assets/oca-template.jpg';
 
 interface Props {
   percentiles: Percentiles;
   clientName: string;
   clientAge: number;
   testDate: string;
   q22Answer: AnswerType;
   q197Answer: AnswerType;
  calibration?: CalibrationPoints;
 }
 
// Дефолтные координаты под изображение трафарета (1156x842)
const DEFAULT_CALIBRATION: CalibrationPoints = {
  top: 127,
  bottom: 596,
  left: 116,
  right: 1040,
};

const TEMPLATE_SIZE = {
  width: 1156,
  height: 842,
  header: {
    titleY: 40,      // "Результаты теста OCA"
    infoY: 75,       // Имя | Возраст | Дата
  },
  footer: {
    valuesY: 780,    // A:-5 B:-25 ...
    questionsY: 810, // Q22: + Q197: +
  },
};

 export default function OcaGraph({ 
   percentiles, 
   clientName, 
   clientAge, 
   testDate,
   q22Answer,
   q197Answer,
  calibration = DEFAULT_CALIBRATION,
 }: Props) {
   const scales: ScaleKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  const { width, height, header, footer } = TEMPLATE_SIZE;
  const graphWidth = calibration.right - calibration.left;
  const graphHeight = calibration.bottom - calibration.top;
  const xStep = graphWidth / (scales.length - 1);

  // Преобразование значения -100..+100 в Y-координату
  const yScale = (value: number) => {
    const normalized = (100 - value) / 200; // 0 = +100, 1 = -100
    return calibration.top + normalized * graphHeight;
  };
 
   // Точки графика
   const points = useMemo(() => {
     return scales.map((scale, i) => ({
      x: calibration.left + i * xStep,
       y: yScale(percentiles[scale]),
       value: percentiles[scale],
       scale,
     }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentiles, calibration]);
 
   // Путь линии
   const linePath = points.map((p, i) => 
     `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
   ).join(' ');
 
  // Показывать Q22/Q197 только если ответ положительный
  const showQ22 = q22Answer === 'yes';
  const showQ197 = q197Answer === 'yes';

  // Строка значений A-J для нижней части
  const valuesLine = scales
    .map((s) => `${s}:${percentiles[s] > 0 ? '+' : ''}${percentiles[s]}`)
    .join('   ');
 
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

        {/* Заголовок "Результаты теста OCA" */}
        <text
          x={width / 2}
          y={header.titleY}
          textAnchor="middle"
          fontSize={24}
          fontWeight={700}
          fill="#000"
        >
          Результаты теста
        </text>

        {/* Информация о клиенте — упорядоченно в одну линию */}
        <text
          x={width / 2}
          y={header.infoY}
          textAnchor="middle"
          fontSize={18}
          fill="#000"
        >
          <tspan fontWeight={600}>{clientName}</tspan>
          <tspan dx={40} fill="#555">|</tspan>
          <tspan dx={40}>{clientAge} лет</tspan>
          <tspan dx={40} fill="#555">|</tspan>
          <tspan dx={40}>{testDate}</tspan>
        </text>
 
         {/* Линия графика */}
         <path
           d={linePath}
           fill="none"
          stroke="#000000"
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
              r={7}
              fill="#000000"
            />
           </g>
         ))}
 
        {/* Значения шкал A-J — нижняя часть */}
        <text x={width / 2} y={footer.valuesY} textAnchor="middle" fontSize={16} fontWeight={600} fill="#000">
          {valuesLine}
        </text>

        {/* Q22/Q197 — только если положительные */}
        {(showQ22 || showQ197) && (
          <text x={width / 2} y={footer.questionsY} textAnchor="middle" fontSize={14} fill="#333">
            {showQ22 && 'Q22: +'}
            {showQ22 && showQ197 && '   '}
            {showQ197 && 'Q197: +'}
          </text>
        )}
       </svg>
     </div>
   );
 }