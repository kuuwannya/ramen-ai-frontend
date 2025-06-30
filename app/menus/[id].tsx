import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Text } from "@components/ui/text";
import Constants from "expo-constants";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { apiService } from "../../lib/api-client";

export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    // ビルド時にAPIからメニューIDリストを取得
    const menuData = await apiService.getRandomMenus();
    if (menuData && Array.isArray(menuData.menus)) {
      return menuData.menus.map((menu) => ({
        id: menu.id.toString(),
      }));
    }
  } catch (error) {
    console.warn("Failed to generate static params:", error);
    // エラー時のフォールバック
  }
}

interface MenuDetail {
  id: number;
  name: string;
  genre_name: string;
  noodle_name: string;
  soup_name: string;
  image_url: string | null;
  shop: {
    id: number;
    name: string;
    address: string;
    google_map_url: string;
  };
}

export default function MenuDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [menuData, setMenuData] = useState<MenuDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // コンポーネントマウント時のデバッグログ
  useEffect(() => {
    console.log("Route params:", { id });
    console.log("Environment:", Constants.executionEnvironment);
    console.log("Current pathname:", pathname);
  }, []);

  useEffect(() => {
    const fetchMenuDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        // IDの検証を強化
        if (!id || (Array.isArray(id) && id.length === 0)) {
          throw new Error("メニューIDが指定されていません");
        }

        console.log("Fetching menu with ID:", id);
        console.log("API URL:", Constants.expoConfig?.extra?.apiUrl);

        const data = await apiService.getMenuDetail(id);
        setMenuData(data);
      } catch (err) {
        console.error("Error fetching menu detail:", err);
        setError(
          err instanceof Error ? err : new Error("データの取得に失敗しました"),
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMenuDetail();
    } else {
      setLoading(false);
      setError(new Error("メニューIDが見つかりません"));
    }
  }, [id]);

  const handleMapPress = () => {
    if (menuData?.shop?.google_map_url) {
      Linking.openURL(menuData.shop.google_map_url);
    }
  };

  if (loading) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4">ラーメン情報を読み込み中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex flex-1 items-center justify-center px-4">
        <Text className="text-red-500 text-center mb-4">
          エラーが発生しました
        </Text>
        <Text className="text-gray-600 text-center mb-4">{error.message}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white text-center font-medium">戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!menuData) {
    return (
      <View className="flex flex-1 items-center justify-center px-4">
        <Text className="text-gray-600 text-center mb-4">
          ラーメン情報が見つかりません。
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-gray-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white text-center font-medium">戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="w-full">
      <View className="flex items-center justify-center py-8 w-full min-h-full">
        <View className="w-full max-w-sm px-4">
          <Card className="w-full shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {menuData.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {menuData.image_url ? (
                <View className="mb-4">
                  <Image
                    source={{ uri: menuData.image_url }}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View className="mb-4 w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Text className="text-gray-500 text-lg">🍜</Text>
                  <Text className="text-gray-500 text-sm mt-2">画像なし</Text>
                </View>
              )}

              <View className="mb-6">
                <Text className="text-gray-600 text-center text-lg">
                  {menuData.genre_name} - {menuData.soup_name}スープ -{" "}
                  {menuData.noodle_name}
                </Text>
              </View>

              <View className="mb-6 p-4 bg-gray-50 rounded-lg">
                <Text className="font-bold text-lg mb-2">🏪 お店情報</Text>
                <Text className="font-bold text-xl mb-1">
                  {menuData.shop.name}
                </Text>
                <Text className="text-gray-600 mb-3">
                  📍 {menuData.shop.address}
                </Text>

                <TouchableOpacity
                  onPress={handleMapPress}
                  className="bg-blue-500 px-4 py-3 rounded-lg"
                >
                  <Text className="text-white text-center font-medium text-base">
                    📍 地図で見る
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-gray-500 px-4 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-medium">
                  ← 戻る
                </Text>
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
