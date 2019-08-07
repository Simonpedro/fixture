import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID
};

const USER_COLLECTION = 'user';
const TEAM_COLLECTION = 'team';

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
    this.provider = new app.auth.GoogleAuthProvider();
  }

  async login() {
    const { user } = await this.auth.signInWithPopup(this.provider);

    if (!user) {
      return { error: 'There was an error in the login proccess.' };
    }

    await this.db
      .collection(USER_COLLECTION)
      .doc(user.uid)
      .set(
        {
          userId: user.uid,
          displayName: user.displayName,
        },
        { merge: true }
      );

    return { user };
  }

  onInitialize(callback) {
    this.auth.onAuthStateChanged(callback);
  }
  
  logout() {
    return this.auth.signOut();
  }

  async fetchAllTeams() {
    const snapshot = await this.db.collection(TEAM_COLLECTION).get()
    return snapshot.docs.map(doc => doc.data());
  }
}

export default Firebase;