 import { Moon, Sun } from 'lucide-react';
 import { useTheme } from 'next-themes';
 import { Button } from '@/components/ui/button';
 import { useEffect, useState } from 'react';
 
interface Props {
  className?: string;
}

export default function ThemeToggle({ className }: Props) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
 
   useEffect(() => {
     setMounted(true);
   }, []);
 
  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className={className || "gap-2 text-muted-foreground"}>
        <div className="w-5 h-5" />
        <span className="hidden sm:inline">Тёмный режим</span>
      </Button>
    );
  }
 
   const isDark = theme === 'dark';
 
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={className || "gap-2 text-muted-foreground hover:text-foreground"}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      <span className="hidden sm:inline">{isDark ? 'Светлый режим' : 'Тёмный режим'}</span>
    </Button>
  );
 }