import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export default function AuthScreen({ SUPABASE_URL, SUPABASE_ANON_KEY, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all layout blocks.");
      return;
    }
    setLoading(true);
    const endpoint = isSignUp ? 'signup' : 'token?grant_type=password';
    
    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error_description || data.message || "Auth Error");

      if (!isSignUp && data.access_token) {
        onAuthSuccess(data.user, data.access_token);
      } else {
        Alert.alert("Success", "Account Created! You can log in now.");
        setIsSignUp(false);
      }
    } catch (error) {
      Alert.alert("Authentication Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>JUMIA CLONE</Text>
      <Text style={styles.subtitle}>{isSignUp ? "Create Your Account" : "Sign In to Open Store"}</Text>

      <TextInput style={styles.input} placeholder="Email Address" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Secret Password" secureTextEntry autoCapitalize="none" value={password} onChangeText={setPassword} />

      {loading ? (
        <ActivityIndicator size="large" color="#f68b1e" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>{isSignUp ? "REGISTER NOW" : "SIGN IN"}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.toggle} onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.toggleText}>
          {isSignUp ? "Already have an account? Login" : "New User? Create an account"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#fff' },
  logo: { fontSize: 32, fontWeight: 'bold', color: '#f68b1e', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 30 },
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: '#f68b1e', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  toggle: { marginTop: 25, alignItems: 'center' },
  toggleText: { color: '#f68b1e', fontWeight: '500' }
});
