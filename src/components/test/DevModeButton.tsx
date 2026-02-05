 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Bug } from 'lucide-react';
 import { useTestState } from '@/hooks/useTestState';
 
 export default function DevModeButton() {
   const [clickCount, setClickCount] = useState(0);
   const [showButton, setShowButton] = useState(false);
   const navigate = useNavigate();
   const { autoFillForDev, getResult, resetTest } = useTestState();
 
   // Скрытая активация: 5 кликов по углу
   const handleHiddenClick = () => {
     const newCount = clickCount + 1;
     setClickCount(newCount);
     
     if (newCount >= 5) {
       setShowButton(true);
       setClickCount(0);
     }
     
     // Сброс счётчика через 2 секунды
     setTimeout(() => setClickCount(0), 2000);
   };
 
   const handleAutoFill = () => {
     autoFillForDev();
     
     // Сохраняем результат и переходим на страницу завершения
     setTimeout(() => {
       const result = getResult();
       if (result) {
         const results = JSON.parse(localStorage.getItem('oca_results') || '[]');
         results.push(result);
         localStorage.setItem('oca_results', JSON.stringify(results));
         resetTest();
         navigate('/complete');
       }
     }, 100);
   };
 
   return (
     <>
       {/* Скрытая область для активации */}
       <div 
         className="fixed bottom-0 right-0 w-16 h-16 cursor-default"
         onClick={handleHiddenClick}
       />
 
       {/* Кнопка режима разработчика */}
       {showButton && (
         <div className="fixed bottom-4 right-4 z-50">
           <Button
             variant="destructive"
             size="sm"
             onClick={handleAutoFill}
             className="gap-2"
           >
             <Bug className="w-4 h-4" />
             DEV: Автозаполнить
           </Button>
         </div>
       )}
     </>
   );
 }