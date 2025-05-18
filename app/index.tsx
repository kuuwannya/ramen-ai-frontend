import { StatusBar } from "expo-status-bar";
import { Text, View, Button } from "react-native";
import { Button as RnrButton } from "../components/ui/button";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-red-50">
      <Text>Welcome to Ramen AI!</Text>
      <Button title="ボタン" onPress={() => router.push("/preferences")} />
      <RnrButton onPress={() => router.push("/preferences")}>ボタン</RnrButton>
      <StatusBar style="auto" />
    </View>
  );
}
