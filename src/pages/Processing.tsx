import { useLanguage } from '@/contexts/LanguageContext';

export default function Processing() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
        <h1 className="text-xl font-semibold mb-2">{t('processing')}</h1>
        <p className="text-muted-foreground">{t('pleaseWait')}</p>
      </div>
    </div>
  );
}
