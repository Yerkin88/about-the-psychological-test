 import { useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { useTestState } from '@/hooks/useTestState';
 import { useAdminSettings } from '@/hooks/useAdminSettings';
 import SingleQuestionMode from '@/components/test/SingleQuestionMode';
 import ListQuestionMode from '@/components/test/ListQuestionMode';
 import DevModeButton from '@/components/test/DevModeButton';
 
 export default function Test() {
   const navigate = useNavigate();
   const { clientInfo, isComplete, getResult, resetTest } = useTestState();
   const { settings } = useAdminSettings();
 
   // Редирект если нет данных клиента
   useEffect(() => {
     if (!clientInfo) {
       navigate('/register');
     }
   }, [clientInfo, navigate]);
 
   // Обработка завершения теста
   const handleComplete = () => {
     const result = getResult();
     if (result) {
       // Сохраняем результат
       const results = JSON.parse(localStorage.getItem('oca_results') || '[]');
       results.push(result);
       localStorage.setItem('oca_results', JSON.stringify(results));
       
       // Сбрасываем состояние теста
       resetTest();
       
       // Переходим на страницу завершения
       navigate('/complete');
     }
   };
 
   if (!clientInfo) return null;
 
   return (
     <div className="min-h-screen bg-background">
       {settings.displayMode === 'single' ? (
         <SingleQuestionMode onComplete={handleComplete} />
       ) : (
         <ListQuestionMode onComplete={handleComplete} />
       )}
       
       {/* Кнопка режима разработчика */}
       <DevModeButton />
     </div>
   );
 }