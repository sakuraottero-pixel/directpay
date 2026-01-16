import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'bn' | 'hi' | 'ar';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  unauthorized: {
    en: 'Unauthorized Payment',
    bn: 'অননুমোদিত পেমেন্ট',
    hi: 'अनधिकृत भुगतान',
    ar: 'دفع غير مصرح به',
  },
  sorryPayment: {
    en: 'Sorry, but we are unable to complete your payment',
    bn: 'দুঃখিত, আমরা আপনার পেমেন্ট সম্পূর্ণ করতে পারছি না',
    hi: 'क्षमा करें, हम आपका भुगतान पूरा करने में असमर्थ हैं',
    ar: 'عذراً، لا يمكننا إكمال الدفع الخاص بك',
  },
  tryRefresh: {
    en: 'Please try again by refreshing the page.',
    bn: 'পৃষ্ঠা রিফ্রেশ করে আবার চেষ্টা করুন।',
    hi: 'कृपया पेज रिफ्रेश करके पुनः प्रयास करें।',
    ar: 'يرجى المحاولة مرة أخرى بتحديث الصفحة.',
  },
  contactProvider: {
    en: 'If the problem persists please contact your service provider.',
    bn: 'সমস্যা থাকলে আপনার সেবা প্রদানকারীর সাথে যোগাযোগ করুন।',
    hi: 'यदि समस्या बनी रहती है तो कृपया अपने सेवा प्रदाता से संपर्क करें।',
    ar: 'إذا استمرت المشكلة يرجى الاتصال بمزود الخدمة الخاص بك.',
  },
  developerLogin: {
    en: 'Developer Login',
    bn: 'ডেভেলপার লগইন',
    hi: 'डेवलपर लॉगिन',
    ar: 'تسجيل دخول المطور',
  },
  selectPaymentMethod: {
    en: 'Select Payment Method',
    bn: 'পেমেন্ট পদ্ধতি নির্বাচন করুন',
    hi: 'भुगतान विधि चुनें',
    ar: 'اختر طريقة الدفع',
  },
  amount: {
    en: 'Amount',
    bn: 'পরিমাণ',
    hi: 'राशि',
    ar: 'المبلغ',
  },
  transactionId: {
    en: 'Transaction ID',
    bn: 'লেনদেন আইডি',
    hi: 'लेनदेन आईडी',
    ar: 'معرف المعاملة',
  },
  merchantId: {
    en: 'Merchant ID',
    bn: 'মার্চেন্ট আইডি',
    hi: 'व्यापारी आईडी',
    ar: 'معرف التاجر',
  },
  cardHolderName: {
    en: 'Card Holder Name',
    bn: 'কার্ডধারীর নাম',
    hi: 'कार्ड धारक का नाम',
    ar: 'اسم حامل البطاقة',
  },
  cardNumber: {
    en: 'Card Number',
    bn: 'কার্ড নম্বর',
    hi: 'कार्ड नंबर',
    ar: 'رقم البطاقة',
  },
  expiryDate: {
    en: 'Expiry Date',
    bn: 'মেয়াদ শেষের তারিখ',
    hi: 'समाप्ति तिथि',
    ar: 'تاريخ الانتهاء',
  },
  securityCode: {
    en: 'Security Code',
    bn: 'সিকিউরিটি কোড',
    hi: 'सुरक्षा कोड',
    ar: 'رمز الأمان',
  },
  pay: {
    en: 'Pay',
    bn: 'পে করুন',
    hi: 'भुगतान करें',
    ar: 'ادفع',
  },
  cancel: {
    en: 'Cancel',
    bn: 'বাতিল',
    hi: 'रद्द करें',
    ar: 'إلغاء',
  },
  processing: {
    en: 'Processing',
    bn: 'প্রক্রিয়াকরণ হচ্ছে',
    hi: 'प्रसंस्करण',
    ar: 'جاري المعالجة',
  },
  pleaseWait: {
    en: 'Please wait while we process your payment...',
    bn: 'আপনার পেমেন্ট প্রক্রিয়া করার সময় অপেক্ষা করুন...',
    hi: 'कृपया प्रतीक्षा करें जब तक हम आपका भुगतान संसाधित करते हैं...',
    ar: 'يرجى الانتظار بينما نقوم بمعالجة الدفع الخاص بك...',
  },
  enterOtp: {
    en: 'Enter OTP',
    bn: 'ওটিপি লিখুন',
    hi: 'ओटीपी दर्ज करें',
    ar: 'أدخل رمز التحقق',
  },
  otpSent: {
    en: 'OTP has been sent to your registered mobile number',
    bn: 'আপনার নিবন্ধিত মোবাইল নম্বরে ওটিপি পাঠানো হয়েছে',
    hi: 'आपके पंजीकृत मोबाइल नंबर पर ओटीपी भेजा गया है',
    ar: 'تم إرسال رمز التحقق إلى رقم هاتفك المسجل',
  },
  resendOtp: {
    en: 'Resend OTP',
    bn: 'ওটিপি পুনরায় পাঠান',
    hi: 'ओटीपी पुनः भेजें',
    ar: 'إعادة إرسال رمز التحقق',
  },
  verify: {
    en: 'Verify',
    bn: 'যাচাই করুন',
    hi: 'सत्यापित करें',
    ar: 'تحقق',
  },
  sessionExpired: {
    en: 'Session Expired',
    bn: 'সেশন মেয়াদ শেষ',
    hi: 'सत्र समाप्त हो गया',
    ar: 'انتهت الجلسة',
  },
  sessionExpiredMsg: {
    en: 'Your payment session has expired. Please return to the merchant and try again.',
    bn: 'আপনার পেমেন্ট সেশনের মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে মার্চেন্টে ফিরে যান এবং আবার চেষ্টা করুন।',
    hi: 'आपका भुगतान सत्र समाप्त हो गया है। कृपया व्यापारी के पास लौटें और पुनः प्रयास करें।',
    ar: 'انتهت صلاحية جلسة الدفع الخاصة بك. يرجى العودة إلى التاجر والمحاولة مرة أخرى.',
  },
  returnToMerchant: {
    en: 'Return to Merchant',
    bn: 'মার্চেন্টে ফিরে যান',
    hi: 'व्यापारी के पास लौटें',
    ar: 'العودة إلى التاجر',
  },
  pciCompliance: {
    en: 'Protected by PCI DSS Security Standards',
    bn: 'পিসিআই ডিএসএস নিরাপত্তা মান দ্বারা সুরক্ষিত',
    hi: 'पीसीआई डीएसएस सुरक्षा मानकों द्वारा संरक्षित',
    ar: 'محمي بمعايير أمان PCI DSS',
  },
  supportId: {
    en: 'Support ID',
    bn: 'সাপোর্ট আইডি',
    hi: 'सपोर्ट आईडी',
    ar: 'معرف الدعم',
  },
  copied: {
    en: 'Copied!',
    bn: 'কপি হয়েছে!',
    hi: 'कॉपी किया गया!',
    ar: 'تم النسخ!',
  },
  confirmCancel: {
    en: 'Are you sure you want to cancel this payment?',
    bn: 'আপনি কি নিশ্চিত যে এই পেমেন্ট বাতিল করতে চান?',
    hi: 'क्या आप वाकई इस भुगतान को रद्द करना चाहते हैं?',
    ar: 'هل أنت متأكد أنك تريد إلغاء هذا الدفع؟',
  },
  yes: {
    en: 'Yes',
    bn: 'হ্যাঁ',
    hi: 'हाँ',
    ar: 'نعم',
  },
  no: {
    en: 'No',
    bn: 'না',
    hi: 'नहीं',
    ar: 'لا',
  },
  differentCard: {
    en: 'A different card cannot be used in this session',
    bn: 'এই সেশনে অন্য কার্ড ব্যবহার করা যাবে না',
    hi: 'इस सत्र में किसी अन्य कार्ड का उपयोग नहीं किया जा सकता',
    ar: 'لا يمكن استخدام بطاقة مختلفة في هذه الجلسة',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('directpay_language') as Language;
    if (saved && ['en', 'bn', 'hi', 'ar'].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('directpay_language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
