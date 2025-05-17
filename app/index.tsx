import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-red-50">
      <Text>Welcome to Ramen AI!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
