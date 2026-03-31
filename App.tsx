import React, { useEffect, useState } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { useAuth } from './src/hooks/useAuth';
import SplashScreen from './src/screens/SplashScreen';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/services/firebase';
import { AuthStackParamList, AppStackParamList } from './src/@types/navigation';

type RootStackParamList = AuthStackParamList & AppStackParamList;

const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: ['sign://'],
  config: {
    screens: {
      Register: 'register',
      Login: 'login',
      ForgotPassword: 'forgot-password',
      MainTabs: {
        screens: {
          Home: 'home',
          Eventos: 'eventos',
          Perfil: 'perfil',
        },
      },
      Notifications: 'notifications',
    },
  },
};

function RootNavigator() {
  const { signIn, signOut } = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(!!user);
      if (user) {
        signIn(user.uid);
      } else {
        signOut();
      }
    });
    return unsubscribe;
  }, [signIn, signOut]);

  useEffect(() => {
    setTimeout(() => setIsAppLoading(false), 1500);
  }, []);

  if (isAppLoading || firebaseUser === null) {
    return <SplashScreen />;
  }

  return firebaseUser ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer<RootStackParamList>
        linking={linkingConfig}
        fallback={
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
          </View>
        }
      >
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
