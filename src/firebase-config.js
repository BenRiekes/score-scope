import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from 'firebase/firestore'

import 'firebase/storage'
import { connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyC6VVyphxnbZC3Hr0CgPKkCR68jVfZ-hv0',
  authDomain: 'score-scope.firebaseapp.com',
  projectId: 'score-scope',
  storageBucket: 'score-scope.appspot.com',
  messagingSenderId: '58856197765',
  appId: '1:58856197765:web:c60daa0652b4891b6e63ec',
  measurementId: 'G-3V252L84ZF',
}

//Initialize Firebase:
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)
export const storage = getFunctions(app)

//Initialize Emulators:
connectAuthEmulator(auth, 'http://127.0.0.1:9099')
connectFirestoreEmulator(db, 'localhost', 9090)
connectFunctionsEmulator(functions, 'localhost', 5001)
connectStorageEmulator(storage, 'localhost', 9199)
