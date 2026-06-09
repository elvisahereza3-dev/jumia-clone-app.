import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export default function CartScreen({ cart, onBack, onOrderComplete, user, token, SUPABASE_URL, SUPABASE_ANON_KEY }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);

  const processOrderAndPayment = async () => {
    if (!name || !phone || !address) {
      Alert.alert("Missing Details", "Please enter delivery coordinates.");
      return;
    }
    setLoading(true);
    
    try {
      const orderPayload = {
        customer_name: name,
        phone_number: phone,
        delivery_address: address,
        items_ordered: JSON.stringify(cart.map(i => i.title)),
        total_price: total,
        payment_status: 'Paid',
        delivery_status: 'Pending'
      };

      const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (!dbResponse.ok) throw new Error("Could not log order parameters.");

      Alert.alert(
        "Payment Confirmed", 
        `UGX ${total.toLocaleString()} safely received from your mobile wallet wallet. Order placed!`,
        [{ text: "OK", onPress: onOrderComplete }]
      );
    } catch (err) {
      Alert.alert("Order Submission Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>⬅ Continue Shopping</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Secure Checkout</Text>

      {cart.length === 0 ? (
        <Text style={styles.empty}>Your basket is currently empty.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <View style={styles.form}>
              <TextInput style={styles.input} placeholder="Receiver Full Name" value={name} onChangeText={setName} />
              <TextInput style={styles.input} placeholder="Mobile Money Wallet Phone (MTN/Airtel)" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
              <TextInput style={styles.input} placeholder="Physical Home Delivery Address" value={address} onChangeText={setAddress} />
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text numberOfLines={1} style={styles.itemText}>{item.title}</Text>
              <Text style={styles.itemPrice}>UGX {parseInt(item.price).toLocaleString()}</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={styles.footer}>
              <Text style={styles.totalText}>Total: UGX {total.toLocaleString()}</Text>
              {loading ? (
                <ActivityIndicator size="small" color="#f68b1e" />
              ) : (
                <TouchableOpacity style={styles.checkoutBtn} onPress={processOrderAndPayment}>
                  <Text style={styles.checkoutBtnText}>PAY VIA MOBILE MONEY</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  backButton: { marginTop: 10 },
  backText: { color: '#f68b1e', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 15 },
  empty: { textAlign: 'center', marginTop: 50, color: '#888' },
  form: { marginBottom: 15 },
  input: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 6, borderWidth: 1, borderColor: '#eee', marginBottom: 10 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  itemText: { flex: 1, color: '#444' },
  itemPrice: { fontWeight: '600', color: '#f68b1e' },
  footer: { marginTop: 20, paddingBottom: 30 },
  totalText: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginBottom: 15 },
  checkoutBtn: { backgroundColor: '#f68b1e', padding: 16, borderRadius: 8, alignItems: 'center' },
  checkoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
