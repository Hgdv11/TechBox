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

  const handleBarCodeScanned = ({ type, data }) => {
    const userIsValid = data === "usuario1";

    if (userIsValid) {
      setResult(data);
      setScan(false);
      navigation.navigate("Home");
    } else {
      Alert.alert(
        "QR no válido",
        "Por favor, escanee un QR válido o contacte a soporte.",
        [{ text: "OK" }]
      );
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
    backgroundColor: "#4fd1c5", // bg-teal-400
    padding: 16,
  },
  logo: {
    width: 128, // w-32
    height: 128, // h-32
    borderRadius: 9999, // rounded-full
    marginBottom: 16, // mb-4
  },
  welcomeText: {
    fontSize: 18, // text-lg
    color: "#ffffff", // text-white
    marginBottom: 16, // mb-4
  },
  loginButton: {
    backgroundColor: "#319795", // bg-teal-600
    padding: 8, // p-2
    borderRadius: 4, // rounded
  },
  loginButtonText: {
    fontSize: 18, // text-lg
    color: "#ffffff", // text-white
  },
  camera: {
    width: "100%", // w-full
    height: "100%", // h-full
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
    fontSize: 18, // text-lg
    color: "#ffffff", // text-white
  },
});
