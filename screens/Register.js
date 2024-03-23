import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";

export default function Register() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scan, setScan] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();

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

      signInWithEmailAndPassword(auth, userData.email, userData.password)
        .then((userCredential) => {
          var user = userCredential.user;
          // Usa userData.username en lugar de user.displayName
          Alert.alert(
            "Bienvenido",
            `Bienvenido ${userData.username || "Usuario"}`
          );
          navigation.navigate("MainHome");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          Alert.alert("Error", errorMessage);
          setScan(true);
        });
    } catch (error) {
      Alert.alert(
        "Error",
        "Hubo un error al procesar el código QR. Asegúrate de que el formato sea correcto."
      );
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
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: "#20315f",
            marginTop: 20,
          }}
        >
          ¡Bienvenido a TechBox!
        </Text>
        {!scan && (
          <>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("../assets/logo-nobg.png")}
                style={{ width: 300, height: 300 }}
              />
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#4FD1C5",
                padding: 20,
                width: "90%",
                borderRadius: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 50,
              }}
              onPress={() => setScan(true)}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 18, color: "#fff" }}
              >
                ¡Comienza Ahora!
              </Text>

              <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" />
            </TouchableOpacity>
          </>
        )}
        {scan && (
          <Camera
            style={{
              width: "100%",
              height: "100%",
            }}
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
      </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
