 // Таблицы норм для перевода сырых баллов в процентили
 import { Gender, ScaleKey } from '@/types/oca';
 
 // Упрощённые таблицы норм
 // В реальности нужно импортировать 8 файлов CSV
 
 interface NormEntry {
   raw: number;
   percentile: number;
 }
 
 interface ScaleNorms {
   plus: NormEntry[];
   minus: NormEntry[];
 }
 
 // Генерация упрощённых норм (линейная интерполяция)
 function generateSimpleNorms(): ScaleNorms {
   const plus: NormEntry[] = [];
   const minus: NormEntry[] = [];
   
   // Положительные значения (0 до 20 сырых → 0 до 100 процентилей)
   for (let i = 0; i <= 20; i++) {
     plus.push({ raw: i, percentile: i * 5 });
   }
   
   // Отрицательные значения (-20 до 0 сырых → -100 до 0 процентилей)
   for (let i = 0; i >= -20; i--) {
     minus.push({ raw: i, percentile: i * 5 });
   }
   
   return { plus, minus };
 }
 
 // Таблицы норм по полу и возрасту
 const normTables: Record<string, Record<ScaleKey, ScaleNorms>> = {};
 
 // Генерируем нормы для всех комбинаций
 const genders: Gender[] = ['male', 'female'];
 const ageGroups = ['young', 'middle', 'mature', 'senior']; // <25, 25-35, 35-50, >50
 
 genders.forEach(gender => {
   ageGroups.forEach(ageGroup => {
     const key = `${gender}_${ageGroup}`;
     normTables[key] = {
       A: generateSimpleNorms(),
       B: generateSimpleNorms(),
       C: generateSimpleNorms(),
       D: generateSimpleNorms(),
       E: generateSimpleNorms(),
       F: generateSimpleNorms(),
       G: generateSimpleNorms(),
       H: generateSimpleNorms(),
       I: generateSimpleNorms(),
       J: generateSimpleNorms(),
     };
   });
 });
 
 // Определение возрастной группы
 export function getAgeGroup(age: number): string {
   if (age < 25) return 'young';
   if (age < 35) return 'middle';
   if (age < 50) return 'mature';
   return 'senior';
 }
 
 // Получение таблицы норм
 export function getNormTable(gender: Gender, age: number): Record<ScaleKey, ScaleNorms> {
   const ageGroup = getAgeGroup(age);
   const key = `${gender}_${ageGroup}`;
   return normTables[key];
 }
 
 // Перевод сырого балла в процентиль
 export function rawToPercentile(
   rawScore: number,
   scale: ScaleKey,
   gender: Gender,
   age: number
 ): number {
   const norms = getNormTable(gender, age);
   const scaleNorms = norms[scale];
   
   if (rawScore >= 0) {
     // Ищем в таблице plus
     const entry = scaleNorms.plus.find(e => e.raw === rawScore);
     if (entry) return entry.percentile;
     // Если точного значения нет, возвращаем максимум/минимум
     if (rawScore > 20) return 100;
     return rawScore * 5;
   } else {
     // Ищем в таблице minus
     const entry = scaleNorms.minus.find(e => e.raw === rawScore);
     if (entry) return entry.percentile;
     // Если точного значения нет
     if (rawScore < -20) return -100;
     return rawScore * 5;
   }
 }