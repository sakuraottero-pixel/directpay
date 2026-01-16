import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export default function SessionExpired() {
  const { t } = useLanguage();
  const refDomain = localStorage.getItem('directpay_ref_domain') || 'https://seloku.com';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-[var(--form-shadow)] p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">{t('sessionExpired')}</h1>
        <p className="text-muted-foreground mb-6">{t('sessionExpiredMsg')}</p>
        <Button onClick={() => window.location.href = refDomain} className="w-full">
          {t('returnToMerchant')}
        </Button>
      </div>
    </div>
  );
}
