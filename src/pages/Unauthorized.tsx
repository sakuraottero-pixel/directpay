import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from '@/hooks/useSession';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DEV_BYPASS_KEY = 'dev999s';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { createSession } = useSession();
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [devKey, setDevKey] = useState('');

  const handleDevLogin = () => {
    if (devKey === DEV_BYPASS_KEY) {
      const session = createSession('100.00', 'DEV_MERCHANT', 'https://seloku.com');
      if (session) {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-[var(--form-shadow)] p-8 text-center">
        <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <TriangleAlert className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">{t('unauthorized')}</h1>
        <p className="text-muted-foreground mb-4">{t('sorryPayment')}</p>
        <div className="bg-muted/50 rounded-lg p-4 mb-6 text-sm text-muted-foreground">
          <p className="mb-2">{t('tryRefresh')}</p>
          <p>{t('contactProvider')}</p>
        </div>
        
        {!showDevLogin ? (
          <button
            onClick={() => setShowDevLogin(true)}
            className="text-xs text-muted-foreground hover:text-primary underline"
          >
            {t('developerLogin')}
          </button>
        ) : (
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Developer Key"
              value={devKey}
              onChange={(e) => setDevKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDevLogin()}
            />
            <Button onClick={handleDevLogin} className="w-full">
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
