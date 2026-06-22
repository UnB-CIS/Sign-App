import { auth } from "./firebase";
import { sendEmailVerification, signOut, User } from "firebase/auth";


const isUserAuthenticated = () => {
  const currentUser = auth.currentUser;
  return currentUser !== null; // Check for a logged-in user
};

const signOutUser = () => signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});

const getCurrentUserId = () => {
  if (!isUserAuthenticated()) {
    throw new Error('No user currently signed in');
  } else {
    return auth.currentUser?.uid as string;
  };
}

export type PasswordStrength = 'fraca' | 'media' | 'forte';

export interface PasswordValidationResult {
  valido: boolean;
  forca: PasswordStrength;
  erros: string[];
}

const REGRAS_SENHA = {
  comprimentoMinimo: 8,
  maiuscula: /[A-Z]/,
  minuscula: /[a-z]/,
  numero: /\d/,
  simbolo: /[^A-Za-z0-9]/,
};

// Valida a política de senha forte e retorna erros em pt-BR e o nível de força.
const validatePasswordStrength = (password: string): PasswordValidationResult => {
  const erros: string[] = [];

  if (password.length < REGRAS_SENHA.comprimentoMinimo) {
    erros.push(`A senha deve ter no mínimo ${REGRAS_SENHA.comprimentoMinimo} caracteres.`);
  }
  if (!REGRAS_SENHA.maiuscula.test(password)) {
    erros.push('A senha deve conter ao menos uma letra maiúscula.');
  }
  if (!REGRAS_SENHA.minuscula.test(password)) {
    erros.push('A senha deve conter ao menos uma letra minúscula.');
  }
  if (!REGRAS_SENHA.numero.test(password)) {
    erros.push('A senha deve conter ao menos um número.');
  }
  if (!REGRAS_SENHA.simbolo.test(password)) {
    erros.push('A senha deve conter ao menos um símbolo.');
  }

  const requisitosAtendidos = [
    password.length >= REGRAS_SENHA.comprimentoMinimo,
    REGRAS_SENHA.maiuscula.test(password),
    REGRAS_SENHA.minuscula.test(password),
    REGRAS_SENHA.numero.test(password),
    REGRAS_SENHA.simbolo.test(password),
  ].filter(Boolean).length;

  let forca: PasswordStrength = 'fraca';
  if (requisitosAtendidos >= 5 && password.length >= 12) {
    forca = 'forte';
  } else if (requisitosAtendidos >= 5) {
    forca = 'media';
  } else if (requisitosAtendidos >= 3) {
    forca = 'media';
  }

  return {
    valido: erros.length === 0,
    forca,
    erros,
  };
};

// Envia o e-mail de verificação para o usuário recém-criado.
const sendVerificationEmail = async (user: User) => {
  await sendEmailVerification(user);
};

export {
  isUserAuthenticated,
  signOutUser,
  getCurrentUserId,
  validatePasswordStrength,
  sendVerificationEmail
};
