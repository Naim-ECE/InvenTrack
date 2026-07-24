import admin from 'firebase-admin';
import env from './env.js';

const formatPrivateKey = (key) => (typeof key === 'string' ? key.replace(/\\n/g, '\n') : '');

export const getFirebaseAdmin = () => {
  if (!env.FIREBASE_PROJECT_ID) {
    throw Object.assign(new Error('Firebase project ID is not configured'), { statusCode: 503 });
  }

  if (admin.apps?.length) {
    return admin;
  }

  const appConfig = {
    projectId: env.FIREBASE_PROJECT_ID,
  };

  if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    appConfig.credential = admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: formatPrivateKey(env.FIREBASE_PRIVATE_KEY),
    });
  } else {
    console.warn('Firebase service account credentials are not configured. Falling back to projectId-only initialization.');
  }

  admin.initializeApp(appConfig);
  return admin;
};

export default getFirebaseAdmin;
