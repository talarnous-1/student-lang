import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { AppLanguage } from '../types';

interface OfflineIndicatorProps {
  appLang: AppLanguage;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ appLang }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  const isEn = appLang === 'en';

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600/95 backdrop-blur-xs px-3.5 py-2 text-xs font-bold text-white shadow-lg border border-amber-400 animate-bounce">
      <WifiOff className="w-4 h-4 text-white" />
      <span>
        {isEn
          ? 'Offline Mode (PWA) — App and sounds work smoothly offline!'
          : 'وضع العمل بدون إنترنت (PWA) — التطبيق يعمل بكامل مزاياه!'}
      </span>
    </div>
  );
};
