import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db, auth } from '../config/firebase';

export default function InventoryScreen({ navigation }) {
  const [medicamentos, setMedicamentos] = useState([]);
  const [nomeMedicamento, setNomeMedicamento] = useState('');
  const [quantidade, setQuantidade] = useState('');

  // Busca os dados em tempo real e organiza de A a Z
  useEffect(() => {
    const unsubscribe = db.collection('medicamentos').onSnapshot((querySnapshot) => {
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      
      // Ordenação alfabética automática
      lista.sort((a, b) => a.nome.localeCompare(b.nome));
      setMedicamentos(lista);
    });
    return () => unsubscribe();
  }, []);

  const handleSair = () => {
    auth.signOut()
      .then(() => navigation.replace('Login'))
      .catch(() => Alert.alert('Erro', 'Não foi possível deslogar.'));
  };

  const adicionarMedicamento = () => {
    if (nomeMedicamento === '' || quantidade === '') {
      Alert.alert('Atenção', 'Preencha o nome do medicamento e a quantidade.');
      return;
    }

    // Cria um ID exclusivo para o medicamento adicionado manualmente também não duplicar
    const idDoMedicamento = nomeMedicamento.toLowerCase().replace(/[^a-z0-9]/g, '');

    db.collection('medicamentos').doc(idDoMedicamento).set({
      nome: nomeMedicamento,
      quantidade: parseInt(quantidade)
    }, { merge: true })
    .then(() => {
      setNomeMedicamento('');
      setQuantidade('');
    })
    .catch(() => Alert.alert('Erro', 'Não foi possível salvar no banco.'));
  };

  // Carrega a lista padrão de saúde blindada contra duplicações
  const popularBanco = () => {
    const listaPadrao = [
      { nome: "Paracetamol 500mg", quantidade: 150 },
      { nome: "Dipirona Sódica 500mg", quantidade: 200 },
      { nome: "Amoxicilina 500mg", quantidade: 45 },
      { nome: "Losartana Potássica 50mg", quantidade: 300 },
      { nome: "Omeprazol 20mg", quantidade: 120 },
      { nome: "Metformina 850mg", quantidade: 250 },
      { nome: "Ibuprofeno 400mg", quantidade: 80 }
    ];

    Alert.alert(
      "Carregar Estoque",
      "Deseja carregar a lista padrão de medicamentos no estoque?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim", 
          onPress: () => {
            const promessas = listaPadrao.map(med => {
              // Gera um ID limpo e padronizado baseado no nome
              const idDoMedicamento = med.nome.toLowerCase().replace(/[^a-z0-9]/g, '');
              
              // Usar .doc().set() impede a duplicação se o item já existir
              return db.collection('medicamentos').doc(idDoMedicamento).set(med, { merge: true });
            });

            Promise.all(promessas)
              .then(() => {
                Alert.alert("Sucesso!", "A lista de medicamentos disponíveis foi carregada.");              })
              .catch(() => {
                Alert.alert("Erro", "Não foi possível sincronizar a lista.");
              });
          }
        }
      ]
    );
  };

  const atualizarQuantidade = (id, qtdAtual, mudanca) => {
    const novaQtd = qtdAtual + mudanca;
    if (novaQtd < 0) {
      Alert.alert('Aviso', 'O estoque não pode ficar negativo!');
      return;
    }
    db.collection('medicamentos').doc(id).update({ quantidade: novaQtd });
  };

  const deletarMedicamento = (id) => {
    Alert.alert("Excluir", "Deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", onPress: () => db.collection('medicamentos').doc(id).delete() }
    ]);
  };

  return (
    <View style={styles.container}>
      
      {/* Cabeçalho com Ícone e Botões de Perfil/Sair */}
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="pill" size={28} color="#2c3e50" />
          <Text style={styles.header}> Estoque</Text>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity style={[styles.btnTop, { backgroundColor: '#3498db' }]} onPress={() => navigation.navigate('Profile')}>
            <MaterialCommunityIcons name="account" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btnTop, { backgroundColor: '#e74c3c' }]} onPress={handleSair}>
            <MaterialCommunityIcons name="logout" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Formulário de Input */}
      <View style={styles.form}>
        <TextInput style={[styles.input, { flex: 2 }]} placeholder="Medicamento" placeholderTextColor="#666" value={nomeMedicamento} onChangeText={setNomeMedicamento} />
        <TextInput style={[styles.input, { flex: 1, marginLeft: 10 }]} placeholder="Qtd" placeholderTextColor="#666" keyboardType="numeric" value={quantidade} onChangeText={setQuantidade} />
      </View>
      
      {/* Botão para Adicionar Manualmente */}
      <TouchableOpacity style={styles.buttonAdicionar} onPress={adicionarMedicamento}>
        <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Adicionar Novo</Text>
      </TouchableOpacity>

      {/* Botão Inteligente para Carregar Dados Padrão de Saúde */}
      <TouchableOpacity style={styles.buttonPopular} onPress={popularBanco}>
        <MaterialCommunityIcons name="database-arrow-down" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.buttonText}>Carregar Lista Padrão</Text>
      </TouchableOpacity>

      {/* Lista com os Medicamentos cadastrados */}
      <FlatList
        data={medicamentos}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Estoque vazio. Adicione medicamentos!</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.nomeItem}>{item.nome}</Text>
              <Text style={styles.qtdItem}>Estoque atual: {item.quantidade}</Text>
            </View>
            
            {/* Ações do Estoque (Aumentar, Diminuir e Deletar) */}
            <View style={styles.acoes}>
              <TouchableOpacity style={[styles.btnAcao, { backgroundColor: '#e67e22' }]} onPress={() => atualizarQuantidade(item.id, item.quantidade, -1)}>
                <MaterialCommunityIcons name="minus" size={20} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.btnAcao, { backgroundColor: '#3498db' }]} onPress={() => atualizarQuantidade(item.id, item.quantidade, 1)}>
                <MaterialCommunityIcons name="plus" size={20} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.btnAcao, { backgroundColor: '#e74c3c' }]} onPress={() => deletarMedicamento(item.id)}>
                <MaterialCommunityIcons name="delete" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  headerButtons: { flexDirection: 'row' },
  btnTop: { padding: 8, borderRadius: 8, marginLeft: 10, elevation: 2 },
  form: { flexDirection: 'row', marginBottom: 10 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, fontSize: 16 },
  
  buttonAdicionar: { backgroundColor: '#27ae60', padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10, elevation: 2 },
  buttonPopular: { backgroundColor: '#8e44ad', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 2 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  emptyText: { textAlign: 'center', marginTop: 30, color: '#999', fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  cardInfo: { flex: 1, paddingRight: 10 },
  nomeItem: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  qtdItem: { fontSize: 14, color: '#666', marginTop: 4 },
  acoes: { flexDirection: 'row', alignItems: 'center' },
  btnAcao: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginLeft: 6, elevation: 1 }
});
