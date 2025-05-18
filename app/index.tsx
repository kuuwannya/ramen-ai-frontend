import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button, Text, View } from "react-native";
import { Button as RnrButton } from "../components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-red-50">
      <Text>Welcome to Ramen AI!</Text>
      <Button title="ボタン" onPress={() => router.push("/preferences")} />
      <RnrButton onPress={() => router.push("/suggestions")}>ボタン</RnrButton>
      <StatusBar style="auto" />
    </View>
  );
}
