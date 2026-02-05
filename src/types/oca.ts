 // Типы для OCA теста
 
 export type Gender = 'male' | 'female';
 
 export type AnswerType = 'yes' | 'maybe' | 'no';
 
 export type ScaleKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
 
 export type DisplayMode = 'single' | 'list';
 
 export interface ClientInfo {
   name: string;
   phone: string;
   email: string;
   city: string;
   age: number;
   gender: Gender;
 }
 
 export interface Question {
   id: number;
   text: string;
 }
 
 export interface QuestionKey {
   questionId: number;
   scale: ScaleKey;
   weightNo: number;      // вес для ответа "Нет"
   weightMaybe: number;   // вес для ответа "Может быть"
   weightYes: number;     // вес для ответа "Да"
 }
 
 export interface Answer {
   questionId: number;
   answer: AnswerType;
 }
 
 export interface RawScores {
   A: number;
   B: number;
   C: number;
   D: number;
   E: number;
   F: number;
   G: number;
   H: number;
   I: number;
   J: number;
 }
 
 export interface Percentiles {
   A: number;
   B: number;
   C: number;
   D: number;
   E: number;
   F: number;
   G: number;
   H: number;
   I: number;
   J: number;
 }
 
 export interface TestResult {
   id: string;
   clientInfo: ClientInfo;
   answers: Answer[];
   rawScores: RawScores;
   percentiles: Percentiles;
   question22Answer: AnswerType;
   question197Answer: AnswerType;
   maybeCount: number;
   startTime: Date;
   endTime: Date;
   durationMinutes: number;
   createdAt: Date;
 }
 
 export interface AdminSettings {
   displayMode: DisplayMode;
   telegramBotToken: string;
   telegramChatId: string;
   redirectUrl: string;
   requiredFields: {
     name: boolean;
     phone: boolean;
     email: boolean;
     city: boolean;
     age: boolean;
     gender: boolean;
   };
  hiddenFields: {
    name: boolean;
    phone: boolean;
    email: boolean;
    city: boolean;
    age: boolean;
    gender: boolean;
  };
  helpTips: string; // Подсказки для клиента (редактируемые в админке)
 }
 
 export interface NormTable {
   scale: ScaleKey;
   plus: { raw: number; percentile: number }[];
   minus: { raw: number; percentile: number }[];
 }