import { useState, useEffect, useCallback } from 'react';
import { generateSessionKey, generateTransactionId, isValidReferrer } from '@/lib/utils';

export interface PaymentSession {
  sessionKey: string;
  transactionId: string;
  amount: string;
  merchantId: string;
  paymentTime: string;
  expiresAt: number;
  refDomain: string | null;
  selectedMethod: string | null;
  cardNumber: string | null;
  cardSubmitted: boolean;
}

const SESSION_DURATION = 10 * 60 * 1000; // 10 minutes
const STORAGE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function useSession() {
  const [session, setSession] = useState<PaymentSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const createSession = useCallback((amount: string, merchantId: string, refDomain?: string) => {
    const now = Date.now();
    const newSession: PaymentSession = {
      sessionKey: generateSessionKey(),
      transactionId: generateTransactionId(),
      amount,
      merchantId,
      paymentTime: new Date().toISOString(),
      expiresAt: now + SESSION_DURATION,
      refDomain: refDomain || null,
      selectedMethod: null,
      cardNumber: null,
      cardSubmitted: false,
    };
    
    localStorage.setItem('directpay_session', JSON.stringify(newSession));
    localStorage.setItem('directpay_session_created', now.toString());
    setSession(newSession);
    setIsValid(true);
    return newSession;
  }, []);

  const updateSession = useCallback((updates: Partial<PaymentSession>) => {
    setSession(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('directpay_session', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('directpay_session');
    localStorage.removeItem('directpay_session_created');
    setSession(null);
    setIsValid(false);
  }, []);

  const validateSession = useCallback(() => {
    const stored = localStorage.getItem('directpay_session');
    const createdAt = localStorage.getItem('directpay_session_created');
    
    if (!stored || !createdAt) {
      return false;
    }

    const sessionCreated = parseInt(createdAt, 10);
    const now = Date.now();

    // Check if storage has expired (24 hours)
    if (now - sessionCreated > STORAGE_DURATION) {
      clearSession();
      return false;
    }

    const parsedSession: PaymentSession = JSON.parse(stored);
    
    // Check if session has expired (10 minutes)
    if (now > parsedSession.expiresAt) {
      return false;
    }

    setSession(parsedSession);
    setIsValid(true);
    return true;
  }, [clearSession]);

  const isSessionExpired = useCallback(() => {
    if (!session) return true;
    return Date.now() > session.expiresAt;
  }, [session]);

  const getRemainingTime = useCallback(() => {
    if (!session) return 0;
    return Math.max(0, session.expiresAt - Date.now());
  }, [session]);

  useEffect(() => {
    const valid = validateSession();
    setIsLoading(false);
    
    if (!valid) {
      // Check URL params for new session
      const params = new URLSearchParams(window.location.search);
      const amount = params.get('amount');
      const merchant = params.get('merchant');
      const referrer = document.referrer;
      
      if (amount && merchant) {
        if (isValidReferrer(referrer) || window.location.hostname === 'localhost') {
          createSession(amount, merchant, referrer);
        }
      }
    }
  }, [validateSession, createSession]);

  return {
    session,
    isLoading,
    isValid,
    createSession,
    updateSession,
    clearSession,
    validateSession,
    isSessionExpired,
    getRemainingTime,
  };
}
