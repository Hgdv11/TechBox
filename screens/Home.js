import React from 'react';
import { View, Text, } from 'react-native';
import { NativeBaseProvider, Box, HStack, Pressable, Center, Icon, Image } from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';


export default function Home() {
  const [selected, setSelected] = React.useState(1);
  return <NativeBaseProvider>
      <Box flex={1} bg="white" safeAreaTop width="100%" maxW="100%" alignSelf="center">
        
        <HStack >
          <Text>Home</Text>
          

        </HStack>
      </Box>
    </NativeBaseProvider>
}