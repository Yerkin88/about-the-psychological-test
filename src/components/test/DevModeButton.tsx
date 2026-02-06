import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bug } from 'lucide-react';
import { useTestState } from '@/hooks/useTestState';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { generateGraphImage } from '@/utils/generateGraphImage';

export default function DevModeButton() {
  const [clickCount, setClickCount] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { calibration } = useAdminSettings();
  const { autoFillForDev, getResult, resetTest, isComplete, clientInfo } = useTestState();
  const shouldNavigateRef = useRef(false);

  // Эффект для навигации после обновления состояния
  useEffect(() => {
    if (!shouldNavigateRef.current || !isComplete || !clientInfo) return;

    // предотвращаем повторный запуск эффекта
    shouldNavigateRef.current = false;

    void (async () => {
      const result = getResult();
      if (!result) {
        setIsProcessing(false);
        return;
      }

      try {
        const graphImage = await generateGraphImage(result, calibration);

        const { error } = await supabase.functions.invoke('submit-test', {
          body: {
            ...result,
            graphImage,
          },
        });

        if (error) {
          console.error('DEV submit-test error:', error);
          throw error;
        }
      } catch (e) {
        console.error('DEV submit failed, fallback to localStorage:', e);
        toast.error('DEV: не удалось отправить результат — сохранили локально');

        try {
          const results = JSON.parse(localStorage.getItem('oca_results') || '[]');
          results.push(result);
          localStorage.setItem('oca_results', JSON.stringify(results));
        } catch {
          // ignore
        }
      } finally {
        resetTest();
        setIsProcessing(false);
        navigate('/complete');
      }
    })();
  }, [isComplete, clientInfo, getResult, resetTest, navigate, calibration]);
 
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
     setIsProcessing(true);
     shouldNavigateRef.current = true;
     autoFillForDev();
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
             disabled={isProcessing}
           >
             <Bug className="w-4 h-4" />
             {isProcessing ? 'Обработка...' : 'DEV: Автозаполнить'}
           </Button>
         </div>
       )}
     </>
   );
 }