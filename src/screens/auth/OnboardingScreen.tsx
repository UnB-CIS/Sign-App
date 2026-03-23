import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PAGINAS = [
  {
    id: '1',
    icone: 'hand-left',
    titulo: 'Aprenda Libras',
    descricao: 'Domine a Língua Brasileira de Sinais com lições interativas, vocabulário e prática guiada.',
  },
  {
    id: '2',
    icone: 'videocam',
    titulo: 'Pratique com a Câmera',
    descricao: 'Grave seus sinais e receba feedback em tempo real usando reconhecimento por inteligência artificial.',
  },
  {
    id: '3',
    icone: 'trophy',
    titulo: 'Acompanhe seu Progresso',
    descricao: 'Ganhe XP, mantenha sua ofensiva e suba no ranking enquanto evolui no aprendizado.',
  },
  {
    id: '4',
    icone: 'rocket',
    titulo: 'Vamos Começar!',
    descricao: 'Crie sua conta e escolha seu nível para iniciar sua jornada no mundo dos sinais.',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [paginaAtual, setPaginaAtual] = useState(0);

  const isUltima = paginaAtual === PAGINAS.length - 1;

  const handleNext = () => {
    if (isUltima) {
      navigation.navigate('Register' as never);
      return;
    }
    flatListRef.current?.scrollToIndex({ index: paginaAtual + 1 });
  };

  const handlePular = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {!isUltima && (
          <TouchableOpacity onPress={handlePular}>
            <Text style={styles.pularTexto}>Pular</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={PAGINAS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setPaginaAtual(index);
        }}
        renderItem={({ item }) => (
          <View style={[styles.pagina, { width }]}>
            <View style={styles.iconeContainer}>
              <Ionicons name={item.icone} size={80} color="#6200EE" />
            </View>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.descricao}>{item.descricao}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.indicadores}>
          {PAGINAS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicador,
                paginaAtual === i && styles.indicadorAtivo,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.botao} onPress={handleNext}>
          <Text style={styles.botaoTexto}>
            {isUltima ? 'Criar Conta' : 'Próximo'}
          </Text>
          <Ionicons
            name={isUltima ? 'checkmark' : 'arrow-forward'}
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {isUltima && (
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login' as never)}
          >
            <Text style={styles.loginTexto}>
              Já tem conta? <Text style={styles.loginDestaque}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    minHeight: 44,
  },
  pularTexto: {
    fontSize: 16,
    color: '#7A869A',
  },
  pagina: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconeContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F3EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  descricao: {
    fontSize: 16,
    color: '#7A869A',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  indicadores: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  indicador: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  indicadorAtivo: {
    width: 24,
    backgroundColor: '#6200EE',
  },
  botao: {
    flexDirection: 'row',
    backgroundColor: '#6200EE',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  botaoTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loginLink: {
    marginTop: 16,
  },
  loginTexto: {
    fontSize: 14,
    color: '#7A869A',
  },
  loginDestaque: {
    color: '#6200EE',
    fontWeight: '600',
  },
});
