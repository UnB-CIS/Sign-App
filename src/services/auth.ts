import { auth } from "./firebase";
import { signOut } from "firebase/auth";


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

export {
  isUserAuthenticated,
  signOutUser,
  getCurrentUserId
};