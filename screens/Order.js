import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { auth } from "../utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import QRCode from "react-native-qrcode-svg";
import { getDatabase, ref, onValue, set, push, update } from "firebase/database";

export default function Order() {
  const [material, setMaterial] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const database = getDatabase();
    const materialRef = ref(database, 'material');
    onValue(materialRef, (snapshot) => {
      const data = snapshot.val();
      const fetchedMaterial = Object.keys(data).map((key) => ({
        id: key,
        name: data[key].name,
        parts: data[key].parts,
        available: data[key].available,
        quantity: 0,
      }));
      setMaterial(fetchedMaterial);
      setQrData(qrData);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const obtenerFechaActualFormateada = () => {
    const fechaActual = new Date();
    
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaActual.getFullYear().toString().slice(2);
    const fechaFormateada = `${dia}-${mes}-${anio}`;
    return fechaFormateada;
  };
  
  //Botones para sumar y restar cantidad
  const updateQuantity = (name, newQuantity) => {
    setMaterial(
      material.map((item) => {
        if (item.name === name) {
          if (item.available > 0) {
            const updatedQuantity = Math.max(
              0,
              Math.min(newQuantity, item.available)
            );
            return { ...item, quantity: updatedQuantity };
          } else {
            Alert.alert("Error", "No se puede usar este material porque no hay disponible.");
            return item;
          }
        }
        return item;
      })
    );
  };

  const checkAvailability = (name) => {
    material.forEach((item) => {
      if (item.name === name) {
        if (item.available === 0) {
          Alert.alert("Error", "No se puede usar este material porque no hay disponible.");
        } else {
          Alert.alert("Disponible", `Hay ${item.available} disponibles de este material.`);
        }
      }
    });
  };

  const finalizeOrder = async () => {
    if (!user) {
      Alert.alert("Error", "No hay un usuario autenticado");
      return;
    }

    const outOfStock = material.some(
      (item) => item.quantity > 0 && item.quantity > item.available
    );

    if (outOfStock) {
      Alert.alert(
        "Error",
        "No hay suficiente inventario para uno o más artículos seleccionados."
      );
      return;
    }

      //Abreviaturas
    const nameToAbbreviation = {
      'Adaptador': 'Ad',
      'Ethernet': 'Et',
      'Extension': 'Ex',
      'HDMI': 'HD',
      // Agrega aquí cualquier otro mapeo que necesites
    };

    const details = material
      .filter((item) => item.quantity > 0)
      .map((item) => `${nameToAbbreviation[item.name] || item.name}:${item.quantity}`)
      .join(",");

      
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
                  const database = getDatabase();
                  const orderRef = ref(database, `loans/${user.uid}/orders`);
                  const newOrderRef = push(orderRef);
    
                  await set(newOrderRef, {
                    details: details,
                    createdAt: obtenerFechaActualFormateada(),
                    status: "QR de préstamo generado"
                  });
    
                  const orderId = newOrderRef.key; // Obtén el ID de la orden creada
                  const newQrData = `Pre,Us:${user.uid},So:${orderId},${details}`;
                  setQrData(newQrData); // Aquí se establece el valor del QR
                  setShowQR(true); // Aquí se muestra el QR
    
                  // Actualiza la orden con los datos del QR
                  await update(newOrderRef, { qrCode: newQrData });
    
                  Alert.alert("Pedido realizado", "Tu pedido ha sido agregado exitosamente.");
                } catch (e) {
                  console.error("Error al agregar o actualizar el pedido en el usuario: " + e.toString());
                  Alert.alert("Error", "No se pudo realizar el pedido.");
                }
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", "No has seleccionado ningún producto.");
      }
    };  

  const closeQR = () => {
    setShowQR(false);
    setMaterial(material.map(item => ({ ...item, quantity: 0 })));
  };

  const images = {
    hdmi: require("../assets/hdmi.png"),
    ethernet: require("../assets/ethernet.png"),
    extension: require("../assets/extension.png"),
    adaptador: require("../assets/adaptador.png"),
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Elige tus artículos</Text>
      {material.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image
            source={images[item.name.toLowerCase().replace(/ /g, "")]}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>{item.name}</Text>
          {item.available > 0 ? (
            <View style={styles.quantityControls}>
              <TouchableOpacity
                onPress={() => updateQuantity(item.name, item.quantity - 1)}
                style={styles.quantityButton}
              >
                <Text>-</Text>
              </TouchableOpacity>
              <Text>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => updateQuantity(item.name, item.quantity + 1)}
                style={styles.quantityButton}
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text>No hay stock disponible</Text>
          )}
        </View>
      ))}
      <TouchableOpacity
        style={styles.finalizeOrderButton}
        onPress={finalizeOrder}
      >
        <Text style={styles.finalizeOrderButtonText}>Finalizar pedido</Text>
      </TouchableOpacity>
      <Modal visible={showQR} transparent={true}>
        <View style={styles.modalView}>
          <QRCode value={qrData} size={200} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeQR}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
    marginTop: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
    width: "90%",
  },
  cardImage: {
    width: 200,
    height: 100,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#ddd",
    padding: 10,
    margin: 5,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    width: 50,
    height: 40,
    fontSize: 18,
    marginHorizontal: 5,
  },
  finalizeOrderButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  finalizeOrderButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  qrContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  qrText: {
    marginTop: 12,
    textAlign: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
