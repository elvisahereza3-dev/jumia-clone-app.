import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import AuthScreen from './screens/AuthScreen';

// ⚠️ SWAP THESE WITH YOUR ACTUAL API STRINGS SECURED FROM PHASE 1
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_LONG_ANON_PUBLIC_KEY";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('auth'); // auth, home, detail, cart
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {user && (
        <View style={styles.topToolbar}>
          <Text style={styles.welcomeText}>Logged In: {user.email}</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => { setUser(null); setCurrentScreen('auth'); }}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentScreen === 'auth' && (
        <AuthScreen 
          SUPABASE_URL={SUPABASE_URL} 
          SUPABASE_ANON_KEY={SUPABASE_ANON_KEY} 
          onAuthSuccess={(userData, userToken) => { setUser(userData); setToken(userToken); setCurrentScreen('home'); }}
        />
      )}
      
      {currentScreen === 'home' && (
        <HomeScreen 
          products={products} 
          loading={loading}
          cartCount={cart.length}
          onSelectProduct={(prod) => { setSelectedProduct(prod); setCurrentScreen('detail'); }}
          onViewCart={() => setCurrentScreen('cart')}
        />
      )}

      {currentScreen === 'detail' && (
        <ProductDetailScreen 
          product={selectedProduct}
          onBack={() => setCurrentScreen('home')}
          onAddToCart={(prod) => { setCart([...cart, prod]); setCurrentScreen('home'); }}
        />
      )}

      {currentScreen === 'cart' && (
        <CartScreen 
          cart={cart}
          user={user}
          token={token}
          SUPABASE_URL={SUPABASE_URL}
          SUPABASE_ANON_KEY={SUPABASE_ANON_KEY}
          onBack={() => setCurrentScreen('home')}
          onOrderComplete={() => { setCart([]); setCurrentScreen('home'); }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', paddingTop: StatusBar.currentHeight || 0 },
  topToolbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#222', padding: 10 },
  welcomeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#d32f2f', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 },
  logoutText: { color: '#fff', fontSize: 11, fontWeight: 'bold' }
});
