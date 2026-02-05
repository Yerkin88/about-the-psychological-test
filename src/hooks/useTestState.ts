 import { useState, useCallback, useEffect } from 'react';
 import { Answer, AnswerType, ClientInfo, DisplayMode, RawScores, Percentiles, ScaleKey, TestResult } from '@/types/oca';
 import { questions } from '@/data/questions';
 import { getQuestionKey } from '@/data/keys';
 import { rawToPercentile } from '@/data/norms';
 
 const STORAGE_KEY = 'oca_test_state';
 
 interface TestState {
   clientInfo: ClientInfo | null;
   answers: Answer[];
   startTime: Date | null;
   currentQuestionIndex: number;
 }
 
 const initialState: TestState = {
   clientInfo: null,
   answers: [],
   startTime: null,
   currentQuestionIndex: 0,
 };
 
 export function useTestState() {
   const [state, setState] = useState<TestState>(() => {
     // Восстановление из localStorage
     const saved = localStorage.getItem(STORAGE_KEY);
     if (saved) {
       try {
         const parsed = JSON.parse(saved);
         return {
           ...parsed,
           startTime: parsed.startTime ? new Date(parsed.startTime) : null,
         };
       } catch {
         return initialState;
       }
     }
     return initialState;
   });
 
   // Сохранение в localStorage при изменении состояния
   useEffect(() => {
     localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
   }, [state]);
 
   // Установка данных клиента
   const setClientInfo = useCallback((info: ClientInfo) => {
     setState(prev => ({
       ...prev,
       clientInfo: info,
       startTime: new Date(),
     }));
   }, []);
 
   // Ответ на вопрос
   const setAnswer = useCallback((questionId: number, answer: AnswerType) => {
     setState(prev => {
       const existingIndex = prev.answers.findIndex(a => a.questionId === questionId);
       const newAnswers = [...prev.answers];
       
       if (existingIndex >= 0) {
         newAnswers[existingIndex] = { questionId, answer };
       } else {
         newAnswers.push({ questionId, answer });
       }
       
       return { ...prev, answers: newAnswers };
     });
   }, []);
 
   // Навигация по вопросам
   const goToQuestion = useCallback((index: number) => {
     if (index >= 0 && index < questions.length) {
       setState(prev => ({ ...prev, currentQuestionIndex: index }));
     }
   }, []);
 
   const nextQuestion = useCallback(() => {
     setState(prev => ({
       ...prev,
       currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, questions.length - 1),
     }));
   }, []);
 
   const prevQuestion = useCallback(() => {
     setState(prev => ({
       ...prev,
       currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
     }));
   }, []);
 
   // Получение ответа на вопрос
   const getAnswer = useCallback((questionId: number): AnswerType | undefined => {
     return state.answers.find(a => a.questionId === questionId)?.answer;
   }, [state.answers]);
 
   // Проверка завершённости теста
   const isComplete = state.answers.length === questions.length;
 
   // Подсчёт сырых баллов
   const calculateRawScores = useCallback((): RawScores => {
     const scores: RawScores = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0 };
     
     state.answers.forEach(({ questionId, answer }) => {
       const key = getQuestionKey(questionId);
       if (!key) return;
       
       let weight = 0;
       switch (answer) {
         case 'yes': weight = key.weightYes; break;
         case 'maybe': weight = key.weightMaybe; break;
         case 'no': weight = key.weightNo; break;
       }
       
       scores[key.scale] += weight;
     });
     
     return scores;
   }, [state.answers]);
 
   // Подсчёт процентилей
   const calculatePercentiles = useCallback((): Percentiles => {
     if (!state.clientInfo) {
       return { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0 };
     }
     
     const rawScores = calculateRawScores();
     const percentiles: Percentiles = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0, J: 0 };
     
     const scales: ScaleKey[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
     scales.forEach(scale => {
       percentiles[scale] = rawToPercentile(
         rawScores[scale],
         scale,
         state.clientInfo!.gender,
         state.clientInfo!.age
       );
     });
     
     return percentiles;
   }, [state.clientInfo, calculateRawScores]);
 
   // Формирование результата
   const getResult = useCallback((): TestResult | null => {
     if (!state.clientInfo || !isComplete || !state.startTime) return null;
     
     const endTime = new Date();
     const durationMs = endTime.getTime() - state.startTime.getTime();
     const durationMinutes = Math.round(durationMs / 60000);
     
     const rawScores = calculateRawScores();
     const percentiles = calculatePercentiles();
     
     const q22 = getAnswer(22);
     const q197 = getAnswer(197);
     const maybeCount = state.answers.filter(a => a.answer === 'maybe').length;
     
     return {
       id: crypto.randomUUID(),
       clientInfo: state.clientInfo,
       answers: state.answers,
       rawScores,
       percentiles,
       question22Answer: q22 || 'maybe',
       question197Answer: q197 || 'maybe',
       maybeCount,
       startTime: state.startTime,
       endTime,
       durationMinutes,
       createdAt: new Date(),
     };
   }, [state, isComplete, calculateRawScores, calculatePercentiles, getAnswer]);
 
   // Сброс теста
   const resetTest = useCallback(() => {
     setState(initialState);
     localStorage.removeItem(STORAGE_KEY);
   }, []);
 
   // Режим разработчика - автозаполнение
   const autoFillForDev = useCallback(() => {
     // Случайные данные клиента
     const randomClientInfo: ClientInfo = {
       name: 'Тестовый Пользователь',
       phone: '+7 999 123 45 67',
       email: 'test@example.com',
       city: 'Москва',
       age: Math.floor(Math.random() * 40) + 18,
       gender: Math.random() > 0.5 ? 'male' : 'female',
     };
 
     // Случайные ответы
     const answerTypes: AnswerType[] = ['yes', 'maybe', 'no'];
     const randomAnswers: Answer[] = questions.map(q => ({
       questionId: q.id,
       answer: answerTypes[Math.floor(Math.random() * 3)],
     }));
 
     setState({
       clientInfo: randomClientInfo,
       answers: randomAnswers,
       startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 минут назад
       currentQuestionIndex: questions.length - 1,
     });
   }, []);
 
   return {
     clientInfo: state.clientInfo,
     answers: state.answers,
     currentQuestionIndex: state.currentQuestionIndex,
     currentQuestion: questions[state.currentQuestionIndex],
     totalQuestions: questions.length,
     answeredCount: state.answers.length,
     isComplete,
     setClientInfo,
     setAnswer,
     getAnswer,
     goToQuestion,
     nextQuestion,
     prevQuestion,
     calculateRawScores,
     calculatePercentiles,
     getResult,
     resetTest,
     autoFillForDev,
   };
 }