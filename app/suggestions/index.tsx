import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Text } from "@components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";

export default function Suggestions() {
  const params = useLocalSearchParams();
  const { recommendedMenu, loading, error } = useMemo(() => {
    try {
      // エラーパラメータがある場合
      if (params.error) {
        return {
          recommendedMenu: null,
          loading: false,
          error: new Error(params.error as string),
        };
      }

      if (params.recommendedData) {
        const parsedData = JSON.parse(params.recommendedData as string);
        const recommendedMenu = parsedData.recommended_menu;
        if (recommendedMenu) {
          return {
            recommendedMenu: recommendedMenu,
            loading: false,
            error: null,
          };
        } else {
          return {
            recommendedMenu: null,
            loading: false,
            error: new Error("おすすめデータの構造が不正です"),
          };
        }
      } else {
        return {
          recommendedMenu: null,
          loading: false,
          error: new Error("おすすめデータがありません"),
        };
      }
    } catch (parseError) {
      console.error("Failed to parse recommended data:", parseError);
      return {
        recommendedMenu: null,
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

  if (!recommendedMenu) {
    return (
      <View className="flex flex-1 items-center justify-center">
        <Text>表示できるラーメン情報がありません。</Text>
      </View>
    );
  }

  const { recommended_ramen, reason } = recommendedMenu;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="w-full">
      <View className="flex items-center justify-center py-8 w-full min-h-full">
        <View className="w-full max-w-sm px-4">
          <Card className="w-full shadow-lg mb-8">
            <CardHeader>
              <CardTitle>{recommended_ramen || "おすすめラーメン"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="font-bold mb-2">おすすめの理由</Text>
              <Text>{reason || "あなたの好みに合わせて選ばれました。"}</Text>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
