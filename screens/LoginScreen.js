import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Trazendo o ícone profissional
import { auth } from '../config/firebase'; // Conexão com o Firebase

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (email === '' || senha === '') {
      Alert.alert('Atenção', 'Preencha o email e a senha.');
      return;
    }

    setLoading(true); // Liga a rodinha de carregamento
    
    auth.signInWithEmailAndPassword(email, senha)
      .then(() => {
        setLoading(false);
        navigation.replace('Inventory'); // Vai para a tela de Estoque
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert('Erro', 'Email ou senha incorretos.');
      });
  };

  return (
    // KeyboardAvoidingView impede que o teclado cubra o botão na hora de digitar
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        {/* Ícone de Pílula */}
        <MaterialCommunityIcons name="pill" size={80} color="#3498db" />
        
        {/* Novo Título Profissional */}
        <Text style={styles.title}>Controle de Estoque</Text>
        <Text style={styles.subtitle}>de Medicamentos</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Digite seu email" 
          placeholderTextColor="#666666"
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Digite sua senha" 
          placeholderTextColor="#666666"
          secureTextEntry 
          value={senha} 
          onChangeText={setSenha}
        />

        {/* Botão com estado de carregamento */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3498db', // Azul combinando com o ícone
    marginTop: 2,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3498db', // Azul padrão
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#3498db',
    textAlign: 'center',
    fontSize: 16,
  }
});
