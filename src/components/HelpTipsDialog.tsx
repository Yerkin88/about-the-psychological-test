 import { useState } from 'react';
 import { HelpCircle } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
 import { useAdminSettings } from '@/hooks/useAdminSettings';
 
 export default function HelpTipsDialog() {
   const [open, setOpen] = useState(false);
   const { settings } = useAdminSettings();
 
   // Простой парсинг markdown для отображения
   const renderContent = (text: string) => {
     const lines = text.split('\n');
     return lines.map((line, i) => {
       if (line.startsWith('## ')) {
         return (
           <h2 key={i} className="text-lg font-semibold mt-4 mb-2">
             {line.replace('## ', '')}
           </h2>
         );
       }
       if (line.startsWith('# ')) {
         return (
           <h1 key={i} className="text-xl font-bold mt-4 mb-2">
             {line.replace('# ', '')}
           </h1>
         );
       }
       if (line.match(/^\d+\.\s/)) {
         return (
           <p key={i} className="ml-4 my-1 text-foreground">
             {line}
           </p>
         );
       }
       if (line.startsWith('- ')) {
         return (
           <p key={i} className="ml-6 my-1 text-muted-foreground">
             • {line.replace('- ', '')}
           </p>
         );
       }
       if (line.trim() === '') {
         return <div key={i} className="h-2" />;
       }
       return (
         <p key={i} className="text-foreground my-1">
           {line}
         </p>
       );
     });
   };
 
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>
         <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
           <HelpCircle className="w-5 h-5" />
         </Button>
       </DialogTrigger>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle>Помощь</DialogTitle>
         </DialogHeader>
         <div className="text-sm max-h-[60vh] overflow-y-auto pr-2">
           {renderContent(settings.helpTips)}
         </div>
       </DialogContent>
     </Dialog>
   );
 }