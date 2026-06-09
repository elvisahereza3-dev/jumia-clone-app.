import React, { useState } from 'react';
import { StyleSheet, Text, FlatList, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';

export default function HomeScreen({ products, loading, onSelectProduct, onViewCart, cartCount }) {
  const [search, setSearch] = useState('');
  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <SearchBar value={search} onChangeText={setSearch} />
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Top Super Deals</Text>
        <TouchableOpacity style={styles.cartButton} onPress={onViewCart}>
          <Text style={styles.cartButtonText}>🛒 Basket ({cartCount})</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f68b1e" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard item={item} onPress={() => onSelectProduct(item)} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  cartButton: { backgroundColor: '#f68b1e', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  cartButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  list: { paddingHorizontal: 6 }
});
