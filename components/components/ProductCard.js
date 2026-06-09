import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity, View } from 'react-native';

export default function ProductCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>UGX {parseInt(item.price).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#fff', margin: 6, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', elevation: 1 },
  image: { width: '100%', height: 140, resizeMode: 'cover' },
  info: { padding: 8 },
  title: { fontSize: 13, fontWeight: '500', marginBottom: 4, color: '#333' },
  price: { fontSize: 15, fontWeight: 'bold', color: '#f68b1e' }
});
