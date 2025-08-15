const admin = require('firebase-admin');

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Running on Netlify or with .env file
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // Running locally with the file present
  serviceAccount = require('./serviceAccountKey.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { db };
