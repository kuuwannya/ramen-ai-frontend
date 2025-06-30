import { Link, useRouter } from "expo-router";
import { useRandomMenus } from "hooks/useRandomMenus";
import { apiService } from "lib/api-client";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from "react-native";
import Swiper from "react-native-deck-swiper";

type CardDataType = {
  id: number;
  image: ImageSourcePropType;
  name: string;
  genre_name: string;
  noodle_name: string;
  soup_name: string;
};

export default function Preferences() {
  const { menus, loading, error } = useRandomMenus();
  const router = useRouter();
  const swiperRef = useRef(null);

  const [likedMenuIds, setLikedMenuIds] = useState<number[]>([]);
  const [passedMenuIds, setPassedMenuIds] = useState<number[]>([]);
  const [swipedCount, setSwipedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderCard = useCallback((item: CardDataType) => {
    if (!item) {
      return (
        <View className="flex-1 rounded-xl overflow-hidden bg-gray-200 justify-center items-center">
          <Text className="text-gray-500">カードがありません</Text>
        </View>
      );
    }

    return (
      <View className="flex-1 rounded-xl overflow-hidden bg-white shadow-lg">
        <Image
          source={item.image}
          className="w-full h-[65%]"
          resizeMode="cover"
          onLoad={() => console.log("Image loaded successfully")}
          onError={(error) => console.error("Image load error:", error)}
        />
        <View className="p-4 flex-1 justify-center">
          <Text className="text-xl font-bold text-gray-800 mb-2">
            {item.name}
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            ジャンル: {item.genre_name}
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            麺: {item.noodle_name}
          </Text>
          <Text className="text-sm text-gray-600">
            スープ: {item.soup_name}
          </Text>
        </View>
      </View>
    );
  }, []);

  const OverlayLabelRight = useCallback(() => {
    return (
      <View className="absolute w-full h-full rounded-xl justify-center items-center bg-green-500/50">
        <Text className="text-4xl font-bold text-white shadow">いいね！</Text>
      </View>
    );
  }, []);

  const OverlayLabelLeft = useCallback(() => {
    return (
      <View className="absolute w-full h-full rounded-xl justify-center items-center bg-red-500/50">
        <Text className="text-4xl font-bold text-white shadow">パス</Text>
      </View>
    );
  }, []);

  const transformedCardData = useMemo(() => {
    if (!menus || !Array.isArray(menus)) {
      return [];
    }
    return menus.map((menu) => ({
      id: menu.id,
      image: menu.image_url
        ? {
            uri: menu.image_url.startsWith("http")
              ? menu.image_url
              : `https://ramen-ai-backend-service-943228427206.asia-northeast1.run.app${menu.image_url}`,
          }
        : require("../../assets/Kocotto_demo.png"),
      name: menu.name,
      genre_name: menu.genre_name,
      noodle_name: menu.noodle_name,
      soup_name: menu.soup_name,
    }));
  }, [menus]);

  const handleSwipeRight = useCallback(
    (index: number) => {
      const menuId = transformedCardData[index].id;
      const newLikedMenuIds = [...likedMenuIds, menuId];
      setLikedMenuIds(newLikedMenuIds);
      setSwipedCount((prev) => prev + 1);
      console.log(`いいね: ${transformedCardData[index].name} (ID: ${menuId})`);

      if (swipedCount + 1 >= transformedCardData.length) {
        setTimeout(() => {
          handleAllCardsComplete(newLikedMenuIds, passedMenuIds);
        }, 100);
      }
    },
    [transformedCardData, likedMenuIds, swipedCount, passedMenuIds],
  );

  const handleSwipeLeft = useCallback(
    (index: number) => {
      const menuId = transformedCardData[index].id;
      const newPassedMenuIds = [...passedMenuIds, menuId];
      setPassedMenuIds(newPassedMenuIds);
      setSwipedCount((prev) => prev + 1);
      console.log(`パス: ${transformedCardData[index].name} (ID: ${menuId})`);

      if (swipedCount + 1 >= transformedCardData.length) {
        setTimeout(() => {
          handleAllCardsComplete(likedMenuIds, newPassedMenuIds);
        }, 100);
      }
    },
    [transformedCardData, passedMenuIds, swipedCount, likedMenuIds],
  );

  const handleSwiped = useCallback((cardIndex: number) => {
    console.log(`Card swiped: ${cardIndex}`);
  }, []);

  const handleAllCardsComplete = useCallback(
    async (
      finalLikedMenuIds: number[],
      finalPassedMenuIds: number[] = passedMenuIds,
    ) => {
      console.log("全てのカードを見ました");
      console.log("いいねしたメニューID:", finalLikedMenuIds);
      console.log("パスしたメニューID:", finalPassedMenuIds);

      if (finalLikedMenuIds.length > 0) {
        try {
          console.log("いいねしたメニューをAPIに送信中...");
          setIsSubmitting(true);

          // 最低限のローディング時間を確保
          const minLoadingTime = new Promise((resolve) =>
            setTimeout(resolve, 1500),
          );

          // API送信処理
          const apiCallPromise = apiService.sendRecommendedMenus(
            finalLikedMenuIds,
            finalPassedMenuIds,
          );

          // タイムアウト処理（15秒）
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error("TIMEOUT"));
            }, 15000);
          });

          // API呼び出しと最低ローディング時間を並行実行
          const [response] = await Promise.all([
            Promise.race([apiCallPromise, timeoutPromise]),
            minLoadingTime,
          ]);

          console.log("API送信成功:", response);

          // レスポンスデータの構造を確認
          if (response && response.recommended_menu) {
            router.push({
              pathname: "/suggestions",
              params: {
                recommendedData: JSON.stringify(response),
              },
            });
          } else {
            console.error("Unexpected response structure:", response);
            router.push({
              pathname: "/suggestions",
              params: {
                error: "APIレスポンスの形式が不正です。再度お試しください。",
              },
            });
          }
        } catch (error) {
          console.error("API送信に失敗しました:", error);

          let errorMessage = "APIエラーが発生しました。";

          if (error.message === "TIMEOUT") {
            errorMessage = "処理がタイムアウトしました。";
          } else if (error.response) {
            switch (error.response.status) {
              case 400:
                errorMessage = "リクエストに問題があります。";
                break;
              case 500:
                errorMessage = "サーバーエラーが発生しました。";
                break;
              case 503:
                errorMessage = "サービスが一時的に利用できません。";
                break;
              default:
                errorMessage = `エラーが発生しました (${error.response.status})。`;
            }
          } else if (
            error.code === "NETWORK_ERROR" ||
            error.message.includes("Network")
          ) {
            errorMessage = "ネットワークエラーが発生しました。";
          }

          router.push({
            pathname: "/suggestions",
            params: {
              error: `${errorMessage}しばらく待ってから再度お試しください。`,
            },
          });
        } finally {
          setIsSubmitting(false);
        }
      } else {
        console.log("いいねしたメニューはありません");
        router.push({
          pathname: "/suggestions",
          params: {
            error: "いいねしたメニューがありません。もう一度お試しください。",
          },
        });
      }
    },
    [router, passedMenuIds],
  );

  const handleSwipedAll = useCallback(async () => {
    handleAllCardsComplete(likedMenuIds, passedMenuIds);
  }, [likedMenuIds, passedMenuIds, handleAllCardsComplete]);

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

  return (
    <View className="flex-1 bg-gray-50">
      <View className="py-3 items-center">
        <Text className="text-2xl font-bold text-gray-800">
          ラーメンスワイパー
        </Text>
      </View>

      <View
        className="flex-1 items-center"
        style={{ paddingBottom: 100, paddingTop: 10 }}
      >
        <Swiper
          ref={swiperRef}
          cards={transformedCardData}
          renderCard={renderCard}
          onSwipedLeft={handleSwipeLeft}
          onSwipedRight={handleSwipeRight}
          onSwiped={handleSwiped}
          onSwipedAll={handleSwipedAll}
          cardIndex={0}
          backgroundColor="transparent"
          stackSize={3}
          stackSeparation={15}
          overlayLabels={{
            left: {
              title: "パス",
              style: {
                label: {
                  backgroundColor: "#EF4444",
                  color: "white",
                  fontSize: 32,
                  fontWeight: "bold",
                  borderRadius: 12,
                  padding: 16,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: "いいね！",
              style: {
                label: {
                  backgroundColor: "#22C55E",
                  color: "white",
                  fontSize: 32,
                  fontWeight: "bold",
                  borderRadius: 12,
                  padding: 16,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
          }}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard
          containerStyle={{
            width: "90%",
            height: "80%",
          }}
          cardStyle={{
            borderRadius: 15,
          }}
        />
      </View>

      <View
        className="absolute bottom-0 left-0 right-0 flex-row justify-between items-center px-5 py-5 pb-10 bg-gray-50"
        style={{ zIndex: 1000 }}
      >
        <TouchableOpacity
          className="w-16 h-16 rounded-full bg-red-500 justify-center items-center shadow"
          onPress={() => {
            if (!isSubmitting && swiperRef.current) {
              swiperRef.current.swipeLeft();
            }
          }}
          style={{ opacity: isSubmitting ? 0.5 : 1 }}
        >
          <Text className="text-3xl text-white">✕</Text>
        </TouchableOpacity>

        <Link href="/" asChild>
          <TouchableOpacity className="py-3 px-6 bg-blue-500 rounded-lg shadow">
            <Text className="text-base font-bold text-white">ホーム</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          className="w-16 h-16 rounded-full bg-green-500 justify-center items-center shadow"
          onPress={() => {
            if (!isSubmitting && swiperRef.current) {
              swiperRef.current.swipeRight();
            }
          }}
          style={{ opacity: isSubmitting ? 0.5 : 1 }}
        >
          <Text className="text-3xl text-white">♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
