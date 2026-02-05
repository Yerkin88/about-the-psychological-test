 import { useState, useEffect } from 'react';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
 import { Badge } from '@/components/ui/badge';
 import { Search, Eye, Download, Trash2 } from 'lucide-react';
 import { TestResult } from '@/types/oca';
 import ResultDetailDialog from './ResultDetailDialog';
 
 export default function AdminResultsList() {
   const [results, setResults] = useState<TestResult[]>([]);
   const [search, setSearch] = useState('');
   const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
 
   useEffect(() => {
     loadResults();
   }, []);
 
   const loadResults = () => {
     const saved = localStorage.getItem('oca_results');
     if (saved) {
       try {
         const parsed = JSON.parse(saved);
         // Сортировка по дате (новые первые)
         const sorted = parsed.sort((a: TestResult, b: TestResult) => 
           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
         );
         setResults(sorted);
       } catch {
         setResults([]);
       }
     }
   };
 
   const handleDelete = (id: string) => {
     if (confirm('Удалить этот результат?')) {
       const updated = results.filter(r => r.id !== id);
       localStorage.setItem('oca_results', JSON.stringify(updated));
       setResults(updated);
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
             <div>
               <CardTitle>Результаты тестов</CardTitle>
               <p className="text-sm text-muted-foreground mt-1">
                 Всего: {results.length} результатов
               </p>
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
                         {result.clientInfo.name}
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
                             variant="ghost"
                             size="icon"
                             onClick={() => setSelectedResult(result)}
                           >
                             <Eye className="w-4 h-4" />
                           </Button>
                           <Button
                             variant="ghost"
                             size="icon"
                             onClick={() => handleDelete(result.id)}
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