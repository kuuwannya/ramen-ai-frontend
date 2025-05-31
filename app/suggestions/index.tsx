import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Text } from "@components/ui/text";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import { useRandomMenus } from "../../hooks/useRandomMenus";

export default function Suggestions() {
  const { menus, loading, error } = useRandomMenus();
  if (loading) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4">ラーメン情報を取得中...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <Text className="text-red-500">
          エラーが発生しました。再度お試しください。
        </Text>
      </View>
    );
  }

  if (!Array.isArray(menus) || menus.length === 0) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <Text>表示できるラーメン情報がありません。</Text>
      </View>
    );
  }

  const menu = menus[0];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="w-full">
      <View className="flex items-center justify-center py-8 w-full min-h-full">
        <View className="w-full max-w-sm px-4">
          <Image
            source={
              menu.image_url
                ? { uri: menu.image_url }
                : require("../../assets/Kocotto_demo.png")
            }
            className="w-full h-auto mb-6 rounded-lg shadow-md"
            resizeMode="contain"
            style={{ height: 200 }}
          />
          <Card className="w-full shadow-lg mb-8">
            <CardHeader>
              <CardTitle>{menu.name || "ラーメン店"}</CardTitle>
              <CardDescription>{menu.name_kana || ""}</CardDescription>
            </CardHeader>
            <CardContent>
              <Text>営業時間: {menu.business_hours || "情報がありません"}</Text>
              {menu.description && (
                <Text className="mt-2">{menu.description}</Text>
              )}
            </CardContent>
            <CardFooter>
              <Text>定休日: {menu.regular_holiday || "情報がありません"}</Text>
            </CardFooter>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
