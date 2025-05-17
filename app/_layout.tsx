import { Stack } from "expo-router";
import "../global.css"; // グローバルCSS読み込み

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    />
  );
}
