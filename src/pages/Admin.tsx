 import { useState } from 'react';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { LayoutDashboard, Settings, Users } from 'lucide-react';
 import AdminResultsList from '@/components/admin/AdminResultsList';
 import AdminSettings from '@/components/admin/AdminSettings';
 
 export default function Admin() {
   return (
     <div className="min-h-screen bg-background">
       <div className="container mx-auto p-4 md:p-8">
         <div className="mb-8">
           <h1 className="text-3xl font-bold text-foreground">Админ-панель OCA</h1>
           <p className="text-muted-foreground mt-2">Управление тестами и результатами</p>
         </div>
 
         <Tabs defaultValue="results" className="space-y-6">
           <TabsList className="grid w-full max-w-md grid-cols-2">
             <TabsTrigger value="results" className="gap-2">
               <Users className="w-4 h-4" />
               Результаты
             </TabsTrigger>
             <TabsTrigger value="settings" className="gap-2">
               <Settings className="w-4 h-4" />
               Настройки
             </TabsTrigger>
           </TabsList>
 
           <TabsContent value="results">
             <AdminResultsList />
           </TabsContent>
 
           <TabsContent value="settings">
             <AdminSettings />
           </TabsContent>
         </Tabs>
       </div>
     </div>
   );
 }