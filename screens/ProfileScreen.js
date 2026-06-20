import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db, auth } from '../config/firebase';

export default function ProfileScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const usuarioAtual = auth.currentUser;
    if (usuarioAtual) {
      setEmail(usuarioAtual.email);
      db.collection('usuarios').doc(usuarioAtual.uid).get()
        .then((doc) => {
          if (doc.exists) {
            setNome(doc.data().nome || '');
            setTelefone(doc.data().telefone || '');
          }
        })
        .catch((error) => console.log("Erro ao buscar perfil:", error));
    }
  }, []);

  const handleTelefoneChange = (texto) => {
    let formatado = texto.replace(/\D/g, '');
    if (formatado.length > 10) {
      formatado = formatado.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (formatado.length > 6) {
      formatado = formatado.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (formatado.length > 2) {
      formatado = formatado.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    }
    setTelefone(formatado);
  };

  const handleSalvar = () => {
    const usuarioAtual = auth.currentUser;
    if (usuarioAtual) {
      setLoading(true);
      db.collection('usuarios').doc(usuarioAtual.uid).set({ nome, telefone }, { merge: true })
      .then(() => {
        setLoading(false);
        Alert.alert('Sucesso', 'Seu perfil foi atualizado!');
      })
      .catch(() => {
        setLoading(false);
        Alert.alert('Erro', 'Não foi possível salvar.');
      });
    }
  };

  const handleExcluir = () => {
    Alert.alert("Atenção!", "Isso vai apagar sua conta para sempre. Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sim, Excluir", 
        onPress: () => {
          const usuarioAtual = auth.currentUser;
          if (usuarioAtual) {
            db.collection('usuarios').doc(usuarioAtual.uid).delete()
            .then(() => usuarioAtual.delete())
            .then(() => {
              Alert.alert('Conta Excluída', 'Sua conta foi apagada com sucesso.');
              navigation.replace('Login');
            })
            .catch(() => Alert.alert('Erro', 'Faça logout e login novamente antes de excluir.'));
          }
        } 
      }
    ]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.logoContainer}>
        <MaterialCommunityIcons name="card-account-details" size={70} color="#3498db" />
        <Text style={styles.header}>Meu Perfil</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>E-mail de Acesso:</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} value={email} editable={false} />

        <Text style={styles.label}>Nome Completo:</Text>
        <TextInput style={styles.input} placeholder="Digite seu nome" placeholderTextColor="#666" value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Telefone:</Text>
        <TextInput style={styles.input} placeholder="(00) 00000-0000" placeholderTextColor="#666" keyboardType="phone-pad" value={telefone} onChangeText={handleTelefoneChange} maxLength={15} />

        <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <MaterialCommunityIcons name="content-save" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.btnText}>Salvar Dados</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnExcluir} onPress={handleExcluir}>
          <MaterialCommunityIcons name="delete-forever" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Excluir Minha Conta</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginTop: 10 },
  formContainer: { paddingHorizontal: 20 },
  label: { fontSize: 14, color: '#333', marginBottom: 5, fontWeight: 'bold' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 15 },
  inputDisabled: { backgroundColor: '#e9ecef', color: '#888' },
  btnSalvar: { backgroundColor: '#27ae60', padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15, elevation: 2 },
  btnExcluir: { backgroundColor: '#e74c3c', padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
