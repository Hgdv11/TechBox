import React from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import CarouselExample from "../../Components/Carrousel";

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Textos de bienvenida */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>¡Bienvenido a TechBox!</Text>
          <Text style={styles.tipsText}>Tips para iniciar rápido</Text>
        </View>
        {/* Aquí se renderiza el componente Carrousel */}
        <View style={styles.carouselContainer}>
          <CarouselExample />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: 'center',
    marginVertical: 20, // Ajusta el margen vertical entre los textos y el carrusel
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10
  },
  tipsText: {
    fontSize: 22,
    fontStyle: 'italic',
    paddingTop: 10
  },
  carouselContainer: {
    alignItems: 'center', // Centra el carrusel horizontalmente
    marginBottom: 100, // Ajusta el margen inferior para que no esté tan alejado del texto
  },
});
