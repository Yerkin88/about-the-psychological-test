import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Trash2, MessageCircle, Phone, RefreshCw } from 'lucide-react';
import { TestResult, AnswerType, Gender } from '@/types/oca';
import ResultDetailDialog from './ResultDetailDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export default function AdminResultsList() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [search, setSearch] = useState('');
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      // Загружаем из облака
      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading results:', error);
        toast.error('Ошибка загрузки результатов');
        setResults([]);
      } else if (data) {
        // Преобразуем данные из БД в формат TestResult
        const mapped: TestResult[] = data.map((row) => ({
          id: row.id,
          clientInfo: {
            name: row.client_name,
            phone: row.client_phone,
            email: row.client_email,
            city: row.client_city,
            age: row.client_age,
            gender: row.client_gender as Gender,
          },
          answers: (row.answers as unknown as Array<{ questionId: number; answer: AnswerType }>) || [],
          rawScores: row.raw_scores as unknown as TestResult['rawScores'],
          percentiles: row.percentiles as unknown as TestResult['percentiles'],
          question22Answer: row.question_22_answer as AnswerType,
          question197Answer: row.question_197_answer as AnswerType,
          maybeCount: row.maybe_count,
          durationMinutes: row.duration_minutes,
          startTime: new Date(row.start_time),
          endTime: new Date(row.end_time),
          createdAt: new Date(row.created_at),
        }));
        setResults(mapped);
      }
    } catch (err) {
      console.error('Error loading results:', err);
      toast.error('Ошибка загрузки');
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот результат?')) return;
    
    try {
      const { error } = await supabase
        .from('test_results')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting result:', error);
        toast.error('Ошибка удаления');
      } else {
        setResults(results.filter(r => r.id !== id));
        toast.success('Результат удалён');
      }
    } catch (err) {
      console.error('Error deleting result:', err);
      toast.error('Ошибка удаления');
    }
  };
 
   const filteredResults = results.filter(r => 
     r.clientInfo.name.toLowerCase().includes(search.toLowerCase()) ||
     r.clientInfo.email.toLowerCase().includes(search.toLowerCase()) ||
     r.clientInfo.phone.includes(search)
   );
 
   const formatDate = (date: Date | string) => {
     return new Date(date).toLocaleDateString('ru-RU', {
       day: '2-digit',
       month: '2-digit',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
     });
   };
 
   return (
     <>
       <Card>
         <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <CardTitle>Результаты тестов</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Всего: {results.length} результатов
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={loadResults}
                  disabled={isLoading}
                  title="Обновить"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
         </CardHeader>
         
         <CardContent>
           {filteredResults.length === 0 ? (
             <div className="text-center py-8 text-muted-foreground">
               {results.length === 0 ? 'Пока нет результатов' : 'Ничего не найдено'}
             </div>
           ) : (
             <div className="overflow-x-auto">
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Имя</TableHead>
                     <TableHead>Контакт</TableHead>
                     <TableHead>Возраст/Пол</TableHead>
                     <TableHead>Дата</TableHead>
                     <TableHead>Время</TableHead>
                     <TableHead className="text-right">Действия</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredResults.map((result) => (
                     <TableRow key={result.id}>
                       <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>{result.clientInfo.name}</span>
                            {/* WhatsApp / Telegram кнопки */}
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  const phone = result.clientInfo.phone.replace(/\D/g, '');
                                  window.open(`https://wa.me/${phone}`, '_blank');
                                }}
                                title="Открыть WhatsApp"
                              >
                               <Phone className="w-3.5 h-3.5 text-primary" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => {
                                  const phone = result.clientInfo.phone.replace(/\D/g, '');
                                  window.open(`https://t.me/+${phone}`, '_blank');
                                }}
                                title="Открыть Telegram"
                              >
                               <MessageCircle className="w-3.5 h-3.5 text-primary" />
                              </Button>
                            </div>
                          </div>
                       </TableCell>
                       <TableCell>
                         <div className="text-sm">
                           <div>{result.clientInfo.phone}</div>
                           <div className="text-muted-foreground">{result.clientInfo.email}</div>
                         </div>
                       </TableCell>
                       <TableCell>
                         {result.clientInfo.age} лет, {result.clientInfo.gender === 'male' ? 'М' : 'Ж'}
                       </TableCell>
                       <TableCell>
                         {formatDate(result.createdAt)}
                       </TableCell>
                       <TableCell>
                         <Badge variant="secondary">
                           {result.durationMinutes} мин
                         </Badge>
                       </TableCell>
                       <TableCell className="text-right">
                         <div className="flex justify-end gap-2">
                           <Button
                            variant="default"
                             size="icon"
                             onClick={() => setSelectedResult(result)}
                            title="Просмотреть результат"
                           >
                             <Eye className="w-4 h-4" />
                           </Button>
                           <Button
                             variant="ghost"
                             size="icon"
                             onClick={() => handleDelete(result.id)}
                            title="Удалить результат"
                           >
                             <Trash2 className="w-4 h-4 text-destructive" />
                           </Button>
                         </div>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
           )}
         </CardContent>
       </Card>
 
       {/* Диалог с деталями */}
       <ResultDetailDialog 
         result={selectedResult} 
         onClose={() => setSelectedResult(null)} 
       />
     </>
   );
 }