// Importa o Firebase inteiro de uma vez (ideal para o Expo Snack)
import firebase from 'firebase';

// Cole as SUAS chaves do Firebase aqui dentro
const firebaseConfig = {
  apiKey: "AIzaSyDc1oKhILAtba376LS7ylqbsBvQ9jtlJZI",
  authDomain: "medestoquemobile.firebaseapp.com",
  projectId: "medestoquemobile",
  storageBucket: "medestoquemobile.firebasestorage.app",
  messagingSenderId: "219061760002",
  appId: "1:219061760002:web:57b0d8ef15a9ce6654b71b"
};

// Verifica se já existe um app iniciado para não duplicar
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exporta a autenticação e o banco de dados para usarmos nas telas
export const auth = firebase.auth();
export const db = firebase.firestore();
