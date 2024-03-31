import { View, Text, ImageBackground } from "react-native";
import React, { useState } from "react";

import Ionicons from "react-native-vector-icons/Ionicons";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import i18next from "i18next";

const CustomDrawer = (props) => {
  // Estado para mantener el idioma actual
  const [currentLanguage, setCurrentLanguage] = useState("es");
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "es" ? "en" : "es";
    setCurrentLanguage(newLanguage);
    i18next.changeLanguage(newLanguage);
    props.navigation.closeDrawer();
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#4FD1C5" }}
      >
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderColor: "#ccc" }}>
        <TouchableOpacity
          onPress={toggleLanguage}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="language" size={22} />
            <Text style={{ marginLeft: 10 }}>{t("drawer.switch")}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.navigation.navigate("Register")}
          style={{ paddingVertical: 15, marginTop: 10 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit" size={22} />
            <Text style={{ marginLeft: 10 }}>
            {t("drawer.logout")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
