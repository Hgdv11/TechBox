import React from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const CarouselExample = () => {
  const slides = [
    {
      image: require('../assets/homeImages/homeRed.png'),
      text: 'Debajo tienes una barra de navegación, haz clic ahí',
    },
    {
      image: require('../assets/homeImages/choice.png'),
      text: 'Selecciona los artículos que necesites',
    },
    {
      image: require('../assets/homeImages/finalizar.png'),
      text: 'Hacer clic en el botón de “Finalizar pedido”',
    },
    {
      image: require('../assets/ready.png'),
      text: '¡Listo!, solo recuerda devolver tus artículos a tiempo.',
    },
  ];

  return (
    <View style={styles.container}>
      <Swiper style={styles.wrapper} loop={false}>
        {slides.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Image
              style={styles.image}
              source={slide.image}
            />
            <Text style={styles.text}>{slide.text}</Text>
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {},
  slide: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: width * 0.8, // Ajusta el ancho al 80% de la pantalla
    height: height * 0.6, // Ajusta la altura al 60% de la pantalla, puedes ajustar este valor según tus necesidades
    resizeMode: 'contain', // Ajusta el modo de redimensionamiento según tus necesidades
  },
  text: {
    position: 'absolute',
    top: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontSize: 18,
  },
});

export default CarouselExample;
