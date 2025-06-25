import { Link, useRouter } from "expo-router";
import { useRandomMenus } from "hooks/useRandomMenus";
import { apiService } from "lib/api-client";
import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform,
  type ImageSourcePropType,
} from "react-native";
import { RnSwiper, type SwiperCardRefType } from "rn-swiper-list";
import WebSwiper from "components/ui/webSwiper";

const Swiper = Platform.OS === "web" ? WebSwiper : RnSwiper;

type CardDataType = {
  id: number;
  image: ImageSourcePropType;
  title: string;
  description: string;
};

export default function Preferences() {
  const { menus, loading, error } = useRandomMenus();
  const router = useRouter();
  const swiperRef = useRef<SwiperCardRefType>();

  const [likedMenuIds, setLikedMenuIds] = useState<number[]>([]);
  const [passedMenuIds, setPassedMenuIds] = useState<number[]>([]);
  const [swipedCount, setSwipedCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderCard = useCallback((item: CardDataType) => {
    return (
      <View className="flex-1 rounded-xl overflow-hidden bg-white shadow-lg">
        <Image
          source={item.image}
          className="w-full h-[75%]"
          resizeMode="cover"
          onLoad={() => console.log("Image loaded successfully")}
          onError={(error) => console.error("Image load error:", error)}
        />
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800">{item.title}</Text>
          <Text className="text-base text-gray-600 mt-2">
            {item.description}
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
      title: menu.name,
      description: `${menu.soup_name}ベースの${menu.genre_name}（${menu.noodle_name}）`,
    }));
  }, [menus]);

  const handleSwipeRight = useCallback(
    (index: number) => {
      const menuId = transformedCardData[index].id;
      const newLikedMenuIds = [...likedMenuIds, menuId];
      setLikedMenuIds(newLikedMenuIds);
      setSwipedCount((prev) => prev + 1);
      console.log(
        `いいね: ${transformedCardData[index].title} (ID: ${menuId})`,
      );

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
      console.log(`パス: ${transformedCardData[index].title} (ID: ${menuId})`);

      if (swipedCount + 1 >= transformedCardData.length) {
        setTimeout(() => {
          handleAllCardsComplete(likedMenuIds, newPassedMenuIds);
        }, 100);
      }
    },
    [transformedCardData, passedMenuIds, swipedCount, likedMenuIds],
  );

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
          const response = await apiService.sendRecommendedMenus(
            finalLikedMenuIds,
            finalPassedMenuIds,
          );
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
            // エラーページに遷移
            router.push({
              pathname: "/suggestions",
              params: {
                error: "APIレスポンスの形式が不正です",
              },
            });
          }
        } catch (error) {
          console.error("API送信に失敗しました:", error);

          // エラー情報を含めて遷移
          router.push({
            pathname: "/suggestions",
            params: {
              error:
                "APIエラーが発生しました。しばらく待ってから再度お試しください。",
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
            error: "いいねしたメニューがありません",
          },
        });
      }
    },
    [router, passedMenuIds],
  );

  const handleSwipedAll = useCallback(async () => {
    handleAllCardsComplete(likedMenuIds, passedMenuIds);
  }, [likedMenuIds, passedMenuIds, handleAllCardsComplete]);

  // Web環境での追加設定
  useEffect(() => {
    if (Platform.OS === "web") {
      // Web環境でのタッチイベント最適化
      const style = document.createElement("style");
      style.textContent = `
        * {
          touch-action: pan-y;
        }
        .swiper-container {
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

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
      <View className="py-5 items-center">
        <Text className="text-2xl font-bold text-gray-800">
          ラーメンスワイパー
        </Text>
      </View>
      {isSubmitting && (
        <Text className="text-sm text-blue-500 mt-1">送信中...</Text>
      )}

      <View className="flex-1 items-center justify-center">
        <Swiper
          ref={swiperRef}
          data={transformedCardData}
          renderCard={(transformedCardData) => renderCard(transformedCardData)}
          cardStyle={{
            width: "90%",
            height: "75%",
            borderRadius: 15,
          }}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onSwipedAll={handleSwipedAll}
          {...(Platform.OS !== "web" && {
            disableBottomSwipe: true,
            disableTopSwipe: true,
            horizontalThreshold: 120,
            animationDuration: 300,
            useNativeDriver: true,
          })}
        />
      </View>

      <View className="flex-row justify-between items-center px-5 py-5 pb-10">
        <TouchableOpacity
          className="w-16 h-16 rounded-full bg-red-500 justify-center items-center shadow"
          onPress={() => !isSubmitting && swiperRef.current?.swipeLeft()}
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
          onPress={() => !isSubmitting && swiperRef.current?.swipeRight()}
          style={{ opacity: isSubmitting ? 0.5 : 1 }}
        >
          <Text className="text-3xl text-white">♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
