import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Text } from "@components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

export default function Suggestions() {
  const params = useLocalSearchParams();
  const { recommendedData, loading, error } = useMemo(() => {
    try {
      // エラーパラメータがある場合
      if (params.error) {
        return {
          recommendedData: null,
          loading: false,
          error: new Error(params.error as string),
        };
      }

      if (params.recommendedData) {
        const parsedData = JSON.parse(params.recommendedData as string);
        return {
          recommendedData: parsedData,
          loading: false,
          error: null,
        };
      } else {
        return {
          recommendedData: null,
          loading: false,
          error: new Error("おすすめデータがありません"),
        };
      }
    } catch (parseError) {
      console.error("Failed to parse recommended data:", parseError);
      return {
        recommendedData: null,
        loading: false,
        error: new Error("データの解析に失敗しました"),
      };
    }
  }, [params.recommendedData, params.error]);

  if (loading) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4">おすすめを生成中...</Text>
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

  if (!recommendedData || !recommendedData.recommended_menu) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <Text>表示できるラーメン情報がありません。</Text>
      </View>
    );
  }

  const { recommended_menu, reason } = recommendedData;
  const { name, genre_name, noodle_name, soup_name, image_url, shop } =
    recommended_menu;

  const handleMapPress = () => {
    if (shop?.google_map_url) {
      Linking.openURL(shop.google_map_url);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="w-full">
      <View className="flex items-center justify-center py-8 w-full min-h-full">
        <View className="w-full max-w-sm px-4">
          <Card className="w-full shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                あなたにおすすめのラーメン
              </CardTitle>
            </CardHeader>
            <CardContent>
              {image_url && (
                <View className="mb-4">
                  <Image
                    source={{ uri: image_url }}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                </View>
              )}
              <Text className="text-xl font-bold mb-2 text-center">
                {name || "おすすめラーメン"}
              </Text>

              <View className="mb-4">
                <Text className="text-gray-600 text-center">
                  {genre_name} - {soup_name}スープ - {noodle_name}
                </Text>
              </View>

              {shop && (
                <View className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <Text className="font-bold text-lg mb-1">{shop.name}</Text>
                  <Text className="text-gray-600 mb-2">{shop.address}</Text>
                  {shop.google_map_url && (
                    <TouchableOpacity
                      onPress={handleMapPress}
                      className="bg-blue-500 px-3 py-2 rounded"
                    >
                      <Text className="text-white text-center font-medium">
                        地図で見る
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              <Text className="font-bold mb-2">AIによるおすすめ理由:</Text>
              <Text className="text-gray-700 leading-6">
                {reason || "あなたの好みに合わせて選ばれました。"}
              </Text>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
