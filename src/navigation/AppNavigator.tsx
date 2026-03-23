import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../theme';
import { AppStackParamList, AppTabParamList } from '../@types/navigation';

import NotificationScreen from '../screens/app/NotificationScreen';
import HomeScreen from '../screens/app/HomeScreen';
import EventosScreen from '../screens/app/Ranking';
import PerfilScreen from '../screens/app/PerfilScreen';
import ProgressoScreen from '../screens/app/ProgressoScreen';
import PesquisarScreen from '../screens/app/PesquisarScreen';
import QuizScreen from '../screens/app/QuizScreen';

import ModuleDetailScreen from '../screens/app/ModuleDetailScreen';
import SignTeachingScreen from '../screens/app/SignTeachingScreen';
import SignRecordingScreen from '../screens/app/SignRecordingScreen';
import LessonCompleteScreen from '../screens/app/LessonCompleteScreen';
import EditProfileScreen from '../screens/app/EditProfileScreen';
import ChangePasswordScreen from '../screens/app/ChangePasswordScreen';
import BugReportScreen from '../screens/app/BugReportScreen';

function NewPostScreen() {
  return (
    <View style={styles.dummyScreen}>
      <Text>Novo Post (Em desenvolvimento)</Text>
    </View>
  );
}

function HeaderLogo() {
  return (
    <Image
      style={styles.headerLogo}
      source={require('../assets/CIS-Logo.png')}
      resizeMode="contain"
    />
  );
}

function NotificationsButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
      <Ionicons name="notifications-outline" size={26} color="#000" />
    </TouchableOpacity>
  );
}

const Stack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Pesquisar') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'NewPost') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            return <Ionicons name={iconName} size={32} color={color} />;
          } else if (route.name === 'Eventos') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName as string} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'Feed',
          headerTitleAlign: 'center',
          headerLeft: () => <HeaderLogo />,
          headerRight: () => <NotificationsButton />,
        }}
      />


      <Tab.Screen name="Pesquisar" component={PesquisarScreen} options={{ title: 'Pesquisar' }} />
      <Tab.Screen name="NewPost" component={NewPostScreen} options={{ title: 'Novo Post' }} />
      <Tab.Screen name="Eventos" component={EventosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{ title: 'Notificações' }}
      />
      <Stack.Screen
        name="Progresso"
        component={ProgressoScreen}
        options={{ title: 'Meu Progresso' }}
        name="Quiz"
        component={QuizScreen}
        options={{ title: 'Quiz' }}
        name="ModuleDetail"
        component={ModuleDetailScreen}
        options={{ title: 'Módulo' }}
      />
      <Stack.Screen
        name="SignTeaching"
        component={SignTeachingScreen}
        options={{ title: 'Aprender Sinal' }}
      />
      <Stack.Screen
        name="SignRecording"
        component={SignRecordingScreen}
        options={{ title: 'Gravar Sinal' }}
      />
      <Stack.Screen
        name="LessonComplete"
        component={LessonCompleteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Alterar Senha' }}
      />
      <Stack.Screen
        name="BugReport"
        component={BugReportScreen}
        options={{ title: 'Reportar Bug' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  dummyScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
});
