import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyC-oRTijXPXQCCnbK4MIMCl3saCLNUtGmA",
  authDomain: "tradinggearsub.firebaseapp.com",
  projectId: "tradinggearsub",
  storageBucket: "tradinggearsub.firebasestorage.app",
  messagingSenderId: "801432625850",
  appId: "1:801432625850:web:732d870f6fb6c015c61883",
  measurementId: "G-56L7LG4HM3"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const getFcmToken = async () => {
  try {
    const token = await getToken(messaging, {
      //vapidKey: 'YOUR_PUBLIC_VAPID_KEY',
      vapidKey: 'BCztRMfcZp5hh6qTyUIv51SJ1MvSCxJh9s8AORVdJqdWAYxjmAq-OH3uGwGMjNvDSNSnD1kxp_UnaQCgBCpmy5M',
    });
    console.log('✅ FCM Token:', token);
    return token;
  } catch (error) {
    console.error('❌ FCM token error', error);
    return null;
  }
};

export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('📥 FCM message received: ', payload);
    // 사용자에게 UI로 표시 가능
  });
};
