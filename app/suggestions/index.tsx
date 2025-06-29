import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Text } from "@components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const [recommendedData, setRecommendedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processData = async () => {
      try {
        // 常にローディング状態から開始
        setLoading(true);
        setError(null);

        // 最低限のローディング時間を確保（UX向上のため）
        const minLoadingTime = new Promise((resolve) =>
          setTimeout(resolve, 1000),
        );

        // データ処理のPromise
        const dataProcessingPromise = new Promise(async (resolve, reject) => {
          try {
            // エラーパラメータがある場合でも、ローディング時間を確保してから処理
            if (params.error) {
              await new Promise((resolve) => setTimeout(resolve, 4000)); // 2秒後にエラー表示
              throw new Error(params.error as string);
            }

            if (params.recommendedData) {
              const parsedData = JSON.parse(params.recommendedData as string);

              if (!parsedData.recommended_menu) {
                throw new Error("おすすめデータの構造が不正です");
              }

              resolve(parsedData);
            } else {
              // データがない場合も少し待ってからエラー表示
              await new Promise((resolve) => setTimeout(resolve, 3000));
              throw new Error("おすすめデータがありません");
            }
          } catch (error) {
            reject(error);
          }
        });

        // タイムアウト処理（10秒後）
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(
              new Error(
                "処理がタイムアウトしました。ネットワークを確認して再度お試しください。",
              ),
            );
          }, 10000);
        });

        // 最低ローディング時間と実際の処理を並行実行
        const [parsedData] = await Promise.all([
          Promise.race([dataProcessingPromise, timeoutPromise]),
          minLoadingTime,
        ]);

        setRecommendedData(parsedData);
      } catch (parseError) {
        console.error("Failed to process recommended data:", parseError);
        setError(
          parseError instanceof Error
            ? parseError
            : new Error("データの処理に失敗しました"),
        );
      } finally {
        setLoading(false);
      }
    };

    processData();
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
      <View className="flex flex-1 items-center justify-center px-4">
        <Text className="text-red-500 text-center mb-4">
          エラーが発生しました
        </Text>
        <Text className="text-gray-600 text-center">{error.message}</Text>
        <Text className="text-gray-500 text-center mt-2">
          再度お試しください。
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

  const handleTwitterShare = () => {
    if (!recommendedData?.recommended_menu) return;

    const { recommended_menu } = recommendedData;
    const menuUrl = `https://ramen-ai-frontend.vercel.app/menus/${recommended_menu.id}`; // 実際のドメインに変更してください

    const shareText = `🍜 ラーメンに愛(AI)を！診断結果 🍜\n\nあなたにおすすめのラーメンは「${recommended_menu.name}」でした！\n\n📍 ${recommended_menu.shop?.name || "お店"}\n🥢 ${recommended_menu.genre_name} - ${recommended_menu.soup_name}スープ - ${recommended_menu.noodle_name}\n\n#ラーメンに愛を #ラーメン診断 #ラーメン\n\n`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText,
    )}&url=${encodeURIComponent(menuUrl)}`;

    Linking.openURL(twitterUrl).catch((err) => {
      console.error("Twitter share failed:", err);
    });
  };

  const handleGoHome = () => {
    router.push("/");
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
                      className="bg-blue-500 px-3 py-2 rounded mb-2"
                    >
                      <Text className="text-white text-center font-medium">
                        地図で見る
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              <Text className="font-bold mb-2">AIによるおすすめ理由:</Text>
              <Text className="text-gray-700 leading-6 mb-6">
                {reason || "あなたの好みに合わせて選ばれました。"}
              </Text>

              {/* Twitter投稿ボタン */}
              <TouchableOpacity
                onPress={handleTwitterShare}
                className="bg-sky-500 flex-row items-center justify-center px-4 py-3 rounded-lg mb-4"
              >
                <Text className="text-white font-bold text-lg mr-2"></Text>
                <Text className="text-white font-bold text-base">
                  診断結果をXでシェア
                </Text>
              </TouchableOpacity>

              {/* ホームに戻るボタン */}
              <TouchableOpacity
                onPress={handleGoHome}
                className="bg-gray-500 px-4 py-3 rounded-lg"
              >
                <Text className="text-white text-center font-medium">
                  もう一度診断する
                </Text>
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
