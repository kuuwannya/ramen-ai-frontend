import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Profile() {
  return (
    <View className="flex-1 items-center justify-center bg-red-50">
      <Text className="text-xl mb-4">プロフィールページ</Text>
      <Link href="/" className="bg-red-500 p-2 rounded">
        <Text className="text-white">トップへ戻る</Text>
      </Link>
      <StatusBar style="auto" />
    </View>
  );
}
