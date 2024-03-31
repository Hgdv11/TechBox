import React from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import { useTranslation } from 'react-i18next';


const { width, height } = Dimensions.get('window');

const CarouselExample = () => {
  const { t } = useTranslation();

  const slides = [
    {
      image: require('../assets/homeImages/homeRed.png'),
      text: t('carousel.slides.0.text'),
    },
    {
      image: require('../assets/homeImages/choice.png'),
      text: t('carousel.slides.1.text'),
    },
    {
      image: require('../assets/homeImages/finalizar.png'),
      text: t('carousel.slides.2.text'),
    },
    {
      image: require('../assets/ready.png'),
      text: t('carousel.slides.3.text'),
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
