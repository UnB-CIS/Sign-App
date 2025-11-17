import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Try to load android google-services.json (you already added it at android/app/google-services.json)
// If you prefer, paste the web config from Firebase Console directly into `firebaseConfig`.
let firebaseConfig: Record<string, any> = {};

try {
    // require the native json (works with Metro bundler). Adjust path if you move the file.
    // @ts-ignore
    const g = require('../../android/app/google-services.json');
    const client = g.client && g.client[0];

    firebaseConfig = {
        apiKey: client?.api_key?.[0]?.current_key || undefined,
        authDomain: g.project_info?.project_id ? `${g.project_info.project_id}.firebaseapp.com` : undefined,
        projectId: g.project_info?.project_id,
        storageBucket: g.project_info?.storage_bucket,
        messagingSenderId: g.project_info?.project_number,
        appId: client?.client_info?.mobilesdk_app_id,
        measurementId: (client?.services?.analytics_service && client.services.analytics_service?.tracking_id) || undefined,
    };
} catch (err) {
    // if require fails, either the file path is wrong or you're on iOS only; paste web config below:
    // firebaseConfig = { apiKey: 'xxx', authDomain: 'xxx', projectId: 'xxx', ... }
    firebaseConfig = {};
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
