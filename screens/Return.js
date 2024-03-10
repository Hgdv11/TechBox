import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { auth } from "../utils/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import QRCode from "react-native-qrcode-svg";
import Icon from 'react-native-vector-icons/FontAwesome';
import { getDatabase, ref, onValue, set, remove, update } from "firebase/database";

export default function Return() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [showQR, setShowQR] = useState(false); 
  const [currentQR, setCurrentQR] = useState(""); 

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const database = getDatabase();
      const userRef = ref(database, `loans/${user.uid}/orders`);
      const unsubscribeSnapshot = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const fetchedOrders = Object.keys(data).map((key) => ({
            id: key,
            ...data[key]
          }));
          setOrders(fetchedOrders);
        } else {
          console.log(`No se encontró el documento con el ID: ${user.uid}`);
        }
      });

      return () => unsubscribeSnapshot();
    }
  }, [user]);

  const handleReturn = async (order) => {
    setCurrentQR(JSON.stringify(order.qrCode) || ""); 
    setShowQR(true); 
  
    try {
      const database = getDatabase();
      const orderRef = ref(database, `loans/${user.uid}/orders/${order.id}`);
  
      await update(orderRef, { status: "Devolución" });
  
      Alert.alert(
        "Pedido devuelto",
        "El pedido ha sido marcado para devolución."
      );
    } catch (e) {
      console.error("Error al marcar el pedido para devolución: ", e);
      Alert.alert("Error", "No se pudo marcar el pedido para devolución.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>Pedido {index + 1}</Text>
            <Text>Detalles: {order.details}</Text>
            <Text>
              Fecha: {new Date(order.createdAt.seconds * 1000).toLocaleString()}
            </Text>
            <Text>Estatus: {order.status}</Text>
            <TouchableOpacity
              style={styles.returnButton}
              onPress={() => handleReturn(order)}
            >
              <Text style={styles.returnButtonText}>Regresar</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.noOrdersContainer}>
  <Icon name="optin-monster" size={100} color="#333" style={styles.icon} />
  <Text style={styles.noOrdersText}>No tienes solicitudes pendientes</Text>
</View>
    )}
      <Modal visible={showQR} transparent={true}>
        <View style={styles.modalView}>
          <QRCode value={currentQR} size={200} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowQR(false)}
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
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    width: "90%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  returnButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  returnButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, 
  },
  noOrdersText: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  icon: {
    marginBottom: 20, 
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});