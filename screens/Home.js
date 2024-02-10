import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { db } from '../utils/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import QRCode from 'react-native-qrcode-svg';

export default function Home() {
  const [material, setMaterial] = useState([]);
  const [showQR, setShowQR] = useState(false);
const [qrValue, setQrValue] = useState('');

  


  useEffect(() => {
    const fetchMaterial = async () => {
      const querySnapshot = await getDocs(collection(db, "material"));
      const fetchedMaterial = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        parts: doc.data().parts,
        quantity: 0, // Inicializa la cantidad seleccionada
      }));
      setMaterial(fetchedMaterial);
    };

    fetchMaterial();
  }, []);

  const updateQuantity = (name, newQuantity) => {
    setMaterial(material.map(item => {
      if (item.name === name) {
        const updatedQuantity = Math.max(0, Math.min(newQuantity, item.parts));
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    }));
  };

  const finalizeOrder = () => {
    const outOfStock = material.some(item => item.quantity > 0 && item.quantity > item.parts);
  
    if (outOfStock) {
      Alert.alert("Error", "No hay suficiente inventario para uno o más artículos seleccionados.");
      return;
    }
  
    const details = material
      .filter(item => item.quantity > 0)
      .map(item => `${item.name}: ${item.quantity}`)
      .join(', ');
  
    if (details) {
      Alert.alert(
        "Confirmar Pedido",
        "¿Estás seguro de que quieres finalizar el pedido?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          { 
            text: "Confirmar", 
            onPress: async () => {
              try {
                await Promise.all(material.filter(item => item.quantity > 0).map(item => {
                  const itemRef = doc(db, "material", item.id);
                  return updateDoc(itemRef, {
                    parts: item.parts - item.quantity
                  });
                }));
                
                console.log("Inventario actualizado y pedido confirmado");
                setQrValue(details); // Prepara el valor para el QR
                setShowQR(true); // Muestra el QR
              } catch (error) {
                console.error("Error al actualizar el inventario:", error);
                Alert.alert("Error", "No se pudo actualizar el inventario.");
              }
            }
          }
        ]
      );
    } else {
      Alert.alert("Error", "No has seleccionado ningún producto.");
    }
  };
  
  

  const images = {
    hdmi: require('../assets/hdmi.png'),
    ethernet: require('../assets/ethernet.png'),
    extension: require('../assets/extension.png'),
    adaptador: require('../assets/adaptador.png'),
  };

  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Elige tus artículos</Text>
      {material.map((item) => (
        <View key={item.id} style={styles.card}>
          {/* Agrega la imagen directamente aquí usando una condicional o un objeto de mapeo si es necesario */}
          <Image source={images[item.name.toLowerCase().replace(/ /g, '')]} style={styles.cardImage} />
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity onPress={() => updateQuantity(item.name, item.quantity - 1)} style={styles.quantityButton}>
              <Text>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              keyboardType='numeric'
              onChangeText={(text) => updateQuantity(item.name, parseInt(text) || 0)}
              value={String(item.quantity)}
            />
            <TouchableOpacity onPress={() => updateQuantity(item.name, item.quantity + 1)} style={styles.quantityButton}>
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
       <TouchableOpacity style={styles.finalizeOrderButton} onPress={finalizeOrder}>
      <Text style={styles.finalizeOrderButtonText}>Finalizar pedido</Text>
    </TouchableOpacity>
    {showQR && (
      <View style={styles.qrContainer}>
        <QRCode value={qrValue} size={200} />
        <Text style={styles.qrText}>Tu pedido</Text>
      </View>
    )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    width: '90%',
  },
  cardImage: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    width: 50,
    height: 40,
    fontSize: 18,
    marginHorizontal: 5,
  },
  finalizeOrderButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  finalizeOrderButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  qrContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
  },
  qrText: {
    marginTop: 12,
    textAlign: 'center',
  },
});