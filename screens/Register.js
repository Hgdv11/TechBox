import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig'; 

export default function Register() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scan, setScan] = useState(false);
  const [result, setResult] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScan(false);

    try {
      const userData = JSON.parse(data);
      console.log(userData);
      const usersRef = collection(db, "usuarios");
      const q = query(usersRef, where("id", "==", (userData.id)), where("name", "==", userData.name), where("password", "==", userData.password));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        Alert.alert("Usuario no encontrado", "Las credenciales proporcionadas no coinciden con nuestros registros.");
        setScan(true);
        return;
      }

      querySnapshot.forEach((doc) => {
        setResult(doc.data().name);
        Alert.alert("Bienvenido", `Bienvenido ${doc.data().name}`);
        navigation.navigate("Home");
      });
    } catch (error) {
      Alert.alert("Error", "Hubo un error al procesar el código QR. Asegúrate de que el formato sea correcto.");
      setScan(true);
    }
};


  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara</Text>;
  }

  if (hasPermission === false) {
    return <Text>No se tiene acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      {!scan && (
        <>
          <Image
            source={require("../assets/LogoTechBox.jpg")}
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>
            Welcome to TechBox. Login to get ready.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => setScan(true)}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
      {scan && (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          onBarCodeScanned={scan ? handleBarCodeScanned : undefined}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
        >
          <View style={styles.centeredView}>
            <TouchableOpacity
              style={styles.stopScanButton}
              onPress={() => setScan(false)}
            >
              <Text style={styles.stopScanButtonText}>Stop Scan</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4fd1c5",
    padding: 16,
  },
  logo: {
    width: 128, 
    height: 128, 
    borderRadius: 9999, 
    marginBottom: 16, 
  },
  welcomeText: {
    fontSize: 18, 
    color: "#ffffff", 
    marginBottom: 16, 
  },
  loginButton: {
    backgroundColor: "#319795", 
    padding: 8, 
    borderRadius: 4, 
  },
  loginButtonText: {
    fontSize: 18, 
    color: "#ffffff", 
  },
  camera: {
    width: "100%", 
    height: "100%", 
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 50,
  },
  stopScanButton: {
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  stopScanButtonText: {
    fontSize: 18, 
    color: "#ffffff", 
  },
});
