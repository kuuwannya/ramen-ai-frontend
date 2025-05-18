import React, { useCallback, useRef } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  type ImageSourcePropType,
} from "react-native";
import { Swiper, type SwiperCardRefType } from "rn-swiper-list";
import { Link } from "expo-router";

type CardDataType = {
  id: number;
  image: ImageSourcePropType;
  title: string;
  description: string;
};

const cardData = [
  {
    id: 1,
    image: require("../../assets/Kocotto_demo.png"),
    title: "ラーメン1",
    description: "濃厚とんこつラーメン",
  },
  {
    id: 2,
    image: require("../../assets/Kocotto_demo.png"),
    title: "ラーメン2",
    description: "あっさり醤油ラーメン",
  },
  {
    id: 3,
    image: require("../../assets/Kocotto_demo.png"),
    title: "ラーメン3",
    description: "こってり味噌ラーメン",
  },
];

export default function Preferences() {
  const swiperRef = useRef<SwiperCardRefType>();

  const renderCard = useCallback((item: (typeof cardData)[0]) => {
    return (
      <View className="flex-1 rounded-xl overflow-hidden bg-white shadow-lg">
        <Image
          source={item.image}
          className="w-full h-[75%]"
          resizeMode="cover"
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

  return (
    <View className="flex-1 bg-gray-50">
      <View className="py-5 items-center">
        <Text className="text-2xl font-bold text-gray-800">
          ラーメンスワイパー
        </Text>
      </View>

      <View className="flex-1 items-center justify-center">
        <Swiper
          ref={swiperRef}
          data={cardData}
          renderCard={(cardData) => renderCard(cardData)}
          cardStyle={{
            width: "90%",
            height: "75%",
            borderRadius: 15,
          }}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
          onSwipeRight={(index) => {
            console.log(`いいね: ${cardData[index].title}`);
          }}
          onSwipeLeft={(index) => {
            console.log(`パス: ${cardData[index].title}`);
          }}
          onSwipedAll={() => {
            console.log("全てのカードを見ました");
          }}
        />
      </View>

      <View className="flex-row justify-between items-center px-5 py-5 pb-10">
        <TouchableOpacity
          className="w-16 h-16 rounded-full bg-red-500 justify-center items-center shadow"
          onPress={() => swiperRef.current?.swipeLeft()}
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
          onPress={() => swiperRef.current?.swipeRight()}
        >
          <Text className="text-3xl text-white">♥</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
