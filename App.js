import "react-native-gesture-handler";
import { I18nextProvider } from "react-i18next";
import i18n from './services/118next';

import Navigation from "./Navigation";

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Navigation />
    </I18nextProvider>
  );
}
