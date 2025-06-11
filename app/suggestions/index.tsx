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
              <CardTitle>{menu.name || "ラーメン"}</CardTitle>
              <CardDescription className="flex flex-row flex-wrap gap-2">
                {menu.genre_name && (
                  <View className="bg-slate-100 px-2 py-1 rounded-md">
                    <Text className="text-xs">{menu.genre_name}</Text>
                  </View>
                )}
                {menu.noodle_name && (
                  <View className="bg-slate-100 px-2 py-1 rounded-md">
                    <Text className="text-xs">{menu.noodle_name}</Text>
                  </View>
                )}
                {menu.soup_name && (
                  <View className="bg-slate-100 px-2 py-1 rounded-md">
                    <Text className="text-xs">{menu.soup_name}</Text>
                  </View>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text className="font-bold mb-2">今日のおすすめ</Text>
              <Text>
                {menu.soup_name}ベースの{menu.genre_name}です。
                {menu.noodle_name}との相性が抜群です。
              </Text>
            </CardContent>
            <CardFooter>
              <View className="flex flex-row items-center">
                <Text className="text-sm text-slate-500">ID: {menu.id}</Text>
              </View>
            </CardFooter>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
