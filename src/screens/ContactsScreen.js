import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([
    { id: '1', name: 'Maria Silva (Mãe)', phone: '(19) 99999-8888' },
  ]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const addContact = () => {
    if (name && phone) {
      setContacts([...contacts, { id: Date.now().toString(), name, phone }]);
      setName('');
      setPhone('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contatos de Emergência SOS</Text>

      <View style={styles.form}>
        <TextInput 
          placeholder="Nome do Contato" 
          placeholderTextColor="#64748B" 
          style={styles.input} 
          value={name} 
          onChangeText={setName} 
        />
        <TextInput 
          placeholder="Telefone / WhatsApp" 
          placeholderTextColor="#64748B" 
          keyboardType="phone-pad" 
          style={styles.input} 
          value={phone} 
          onChangeText={setPhone} 
        />
        <TouchableOpacity style={styles.addButton} onPress={addContact}>
          <Text style={styles.addText}>Adicionar Contato</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={contacts} 
        keyExtractor={item => item.id} 
        renderItem={({ item }) => (
          <View style={styles.contactCard}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phone}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A', padding: 20, paddingTop: 50 },
  title: { color: '#F8FAFC', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  form: { marginBottom: 20 },
  input: { backgroundColor: '#1E293B', color: '#FFF', padding: 14, borderRadius: 8, marginBottom: 10 },
  addButton: { backgroundColor: '#38BDF8', padding: 14, borderRadius: 8, alignItems: 'center' },
  addText: { color: '#0F172A', fontWeight: 'bold' },
  contactCard: { backgroundColor: '#1E293B', padding: 16, borderRadius: 10, marginBottom: 10 },
  contactName: { color: '#F8FAFC', fontWeight: 'bold', fontSize: 16 },
  contactPhone: { color: '#94A3B8', marginTop: 4 },
});