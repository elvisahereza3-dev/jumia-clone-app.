import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Search for electronics, items, clothing..." 
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#fff' },
  input: { backgroundColor: '#f1f1f1', padding: 12, borderRadius: 8, fontSize: 14, color: '#333' }
});
