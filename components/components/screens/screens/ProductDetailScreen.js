import React from 'react';
import { StyleSheet, Text, Image, ScrollView, View, TouchableOpacity } from 'react-native';

export default function ProductDetailScreen({ product, onBack, onAddToCart }) {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>⬅ Return to Shop</Text>
      </TouchableOpacity>
      <Image source={{ uri: product.image_url }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>UGX {parseInt(product.price).toLocaleString()}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <TouchableOpacity style={styles.button} onPress={() => onAddToCart(product)}>
          <Text style={styles.buttonText}>ADD TO SHOPPING BASKET</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 15, marginTop: 10 },
  backText: { color: '#f68b1e', fontWeight: 'bold' },
  image: { width: '100%', height: 260, resizeMode: 'contain' },
  details: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  price: { fontSize: 22, color: '#f68b1e', fontWeight: 'bold', marginBottom: 15 },
  description: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 25 },
  button: { backgroundColor: '#f68b1e', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
