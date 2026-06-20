import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../config/firebase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (email === '' || senha === '') {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setLoading(true);

    auth.createUserWithEmailAndPassword(email, senha)
      .then(() => {
        setLoading(false);
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        navigation.goBack();
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert('Erro', 'Não foi possível criar a conta. Verifique o email e tente uma senha de no mínimo 6 caracteres.');
      });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.logoContainer}>
        <MaterialCommunityIcons name="account-plus" size={80} color="#27ae60" />
        <Text style={styles.title}>Nova Conta</Text>
        <Text style={styles.subtitle}>Junte-se ao sistema</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Digite seu email" 
          placeholderTextColor="#666"
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Crie uma senha (mín. 6 caracteres)" 
          placeholderTextColor="#666"
          secureTextEntry 
          value={senha} 
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8', justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginTop: 10 },
  subtitle: { fontSize: 18, color: '#27ae60', marginTop: 2, fontWeight: '600' },
  formContainer: { paddingHorizontal: 20 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, fontSize: 16, marginBottom: 15 },
  button: { backgroundColor: '#27ae60', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
