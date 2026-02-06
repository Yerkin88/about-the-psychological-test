import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestState } from '@/hooks/useTestState';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import SingleQuestionMode from '@/components/test/SingleQuestionMode';
import ListQuestionMode from '@/components/test/ListQuestionMode';
import DevModeButton from '@/components/test/DevModeButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export default function Test() {
  const navigate = useNavigate();
  const { clientInfo, isComplete, getResult, resetTest } = useTestState();
  const { settings } = useAdminSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Редирект если нет данных клиента
  useEffect(() => {
    if (!clientInfo) {
      navigate('/register');
    }
  }, [clientInfo, navigate]);

  // Обработка завершения теста
  const handleComplete = async () => {
    if (isSubmitting) return;
    
    const result = getResult();
    if (!result) return;

    setIsSubmitting(true);

    try {
      // Отправляем результат в облако
      const { error } = await supabase.functions.invoke('submit-test', {
        body: result,
      });

      if (error) {
        console.error('Error submitting test:', error);
        toast.error('Ошибка при отправке результата');
        // Fallback: сохраняем локально
        const results = JSON.parse(localStorage.getItem('oca_results') || '[]');
        results.push(result);
        localStorage.setItem('oca_results', JSON.stringify(results));
      } else {
        console.log('Test result submitted successfully');
      }

      // Сбрасываем состояние теста
      resetTest();

      // Переходим на страницу завершения
      navigate('/complete');
    } catch (err) {
      console.error('Error submitting test:', err);
      toast.error('Ошибка при отправке результата');
      // Fallback: сохраняем локально
      const results = JSON.parse(localStorage.getItem('oca_results') || '[]');
      results.push(result);
      localStorage.setItem('oca_results', JSON.stringify(results));
      resetTest();
      navigate('/complete');
    } finally {
      setIsSubmitting(false);
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