import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CATEGORIAS = ['Todos', 'Módulos', 'Lições', 'Vocabulário'];

const DADOS_BUSCA = [
  { id: '1', titulo: 'Saudações', tipo: 'Módulos', descricao: 'Sinais básicos de saudações' },
  { id: '2', titulo: 'Alimentos', tipo: 'Módulos', descricao: 'Sinais de alimentos e bebidas' },
  { id: '3', titulo: 'Números', tipo: 'Módulos', descricao: 'Sinais dos números em Libras' },
  { id: '4', titulo: 'Família', tipo: 'Módulos', descricao: 'Membros da família' },
  { id: '5', titulo: 'Cores', tipo: 'Módulos', descricao: 'Sinais das cores' },
  { id: '6', titulo: 'Dias e Tempo', tipo: 'Módulos', descricao: 'Dias da semana e tempo' },
  { id: '7', titulo: 'Verbos Cotidianos', tipo: 'Módulos', descricao: 'Verbos do dia a dia' },
  { id: '8', titulo: 'Olá e Tchau', tipo: 'Lições', descricao: 'Cumprimentar e se despedir' },
  { id: '9', titulo: 'Apresentações Pessoais', tipo: 'Lições', descricao: 'Se apresentar em Libras' },
  { id: '10', titulo: 'Frutas e Verduras', tipo: 'Lições', descricao: 'Sinais de frutas e verduras' },
  { id: '11', titulo: 'Olá', tipo: 'Vocabulário', descricao: 'Sinal de saudação com a mão aberta' },
  { id: '12', titulo: 'Tchau', tipo: 'Vocabulário', descricao: 'Sinal de despedida' },
  { id: '13', titulo: 'Bom dia', tipo: 'Vocabulário', descricao: 'Sinal combinado de bom + dia' },
  { id: '14', titulo: 'Água', tipo: 'Vocabulário', descricao: 'Mão em W tocando o queixo' },
  { id: '15', titulo: 'Café', tipo: 'Vocabulário', descricao: 'Moer com as mãos' },
  { id: '16', titulo: 'Pai', tipo: 'Vocabulário', descricao: 'Polegar na testa' },
  { id: '17', titulo: 'Mãe', tipo: 'Vocabulário', descricao: 'Polegar no queixo' },
  { id: '18', titulo: 'Vermelho', tipo: 'Vocabulário', descricao: 'Dedo nos lábios deslizando' },
];

export default function PesquisarScreen() {
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

  const resultados = useMemo(() => {
    let filtrados = DADOS_BUSCA;

    if (categoriaAtiva !== 'Todos') {
      filtrados = filtrados.filter((item) => item.tipo === categoriaAtiva);
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase();
      filtrados = filtrados.filter(
        (item) =>
          item.titulo.toLowerCase().includes(termo) ||
          item.descricao.toLowerCase().includes(termo)
      );
    }

    return filtrados;
  }, [busca, categoriaAtiva]);

  const getIcone = (tipo: string) => {
    switch (tipo) {
      case 'Módulos': return 'book';
      case 'Lições': return 'document-text';
      case 'Vocabulário': return 'hand-left';
      default: return 'search';
    }
  };

  const getCor = (tipo: string) => {
    switch (tipo) {
      case 'Módulos': return '#6200EE';
      case 'Lições': return '#2D4CC8';
      case 'Vocabulário': return '#00C853';
      default: return '#7A869A';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#7A869A" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar módulos, lições, sinais..."
          placeholderTextColor="#9CA3AF"
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={20} color="#7A869A" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        data={CATEGORIAS}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categorias}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoriaChip,
              categoriaAtiva === item && styles.categoriaChipAtiva,
            ]}
            onPress={() => setCategoriaAtiva(item)}
          >
            <Text
              style={[
                styles.categoriaTexto,
                categoriaAtiva === item && styles.categoriaTextoAtivo,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="search-outline" size={48} color="#E0E0E0" />
            <Text style={styles.vazioTexto}>Nenhum resultado encontrado</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultadoItem} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: getCor(item.tipo) + '15' }]}>
              <Ionicons name={getIcone(item.tipo)} size={22} color={getCor(item.tipo)} />
            </View>
            <View style={styles.resultadoInfo}>
              <Text style={styles.resultadoTitulo}>{item.titulo}</Text>
              <Text style={styles.resultadoDescricao} numberOfLines={1}>
                {item.descricao}
              </Text>
            </View>
            <View style={[styles.tipoBadge, { backgroundColor: getCor(item.tipo) + '15' }]}>
              <Text style={[styles.tipoTexto, { color: getCor(item.tipo) }]}>{item.tipo}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    marginLeft: 8,
  },
  categorias: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoriaChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  categoriaChipAtiva: {
    backgroundColor: '#6200EE',
  },
  categoriaTexto: {
    fontSize: 14,
    color: '#7A869A',
    fontWeight: '500',
  },
  categoriaTextoAtivo: {
    color: '#FFFFFF',
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultadoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultadoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultadoTitulo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  resultadoDescricao: {
    fontSize: 13,
    color: '#7A869A',
    marginTop: 2,
  },
  tipoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tipoTexto: {
    fontSize: 11,
    fontWeight: '600',
  },
  vazio: {
    alignItems: 'center',
    paddingTop: 60,
  },
  vazioTexto: {
    fontSize: 16,
    color: '#7A869A',
    marginTop: 12,
  },
});
