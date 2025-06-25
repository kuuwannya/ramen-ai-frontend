// 以下を/components/WebSwiper.tsxとして作成
import React, { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  PanResponder,
} from "react-native";

// rn-swiper-listと互換性のあるインターフェイス
const WebSwiper = React.forwardRef(
  (
    {
      data,
      renderCard,
      onSwipeRight,
      onSwipeLeft,
      onSwipedAll,
      cardStyle,
      OverlayLabelRight,
      OverlayLabelLeft,
    },
    ref,
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const position = useRef(new Animated.ValueXY()).current;
    const [showOverlayRight, setShowOverlayRight] = useState(false);
    const [showOverlayLeft, setShowOverlayLeft] = useState(false);

    // 外部からswipeLeft/swipeRightを呼び出せるようにする
    React.useImperativeHandle(ref, () => ({
      swipeLeft: () => swipeAction(-500),
      swipeRight: () => swipeAction(500),
    }));

    const swipeAction = (direction) => {
      Animated.timing(position, {
        toValue: { x: direction, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        if (direction > 0) {
          onSwipeRight?.(currentIndex);
        } else {
          onSwipeLeft?.(currentIndex);
        }

        const nextIndex = currentIndex + 1;
        if (nextIndex >= data.length) {
          onSwipedAll?.();
        } else {
          position.setValue({ x: 0, y: 0 });
          setCurrentIndex(nextIndex);
        }

        setShowOverlayRight(false);
        setShowOverlayLeft(false);
      });
    };

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, { dx }) => {
          position.setValue({ x: dx, y: 0 });
          setShowOverlayRight(dx > 50);
          setShowOverlayLeft(dx < -50);
        },
        onPanResponderRelease: (_, { dx }) => {
          if (dx > 120) {
            swipeAction(500);
          } else if (dx < -120) {
            swipeAction(-500);
          } else {
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 5,
              useNativeDriver: false,
            }).start();
            setShowOverlayRight(false);
            setShowOverlayLeft(false);
          }
        },
      }),
    ).current;

    if (data.length === 0 || currentIndex >= data.length) {
      return null;
    }

    const rotate = position.x.interpolate({
      inputRange: [-300, 0, 300],
      outputRange: ["-10deg", "0deg", "10deg"],
      extrapolate: "clamp",
    });

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Animated.View
          style={[
            cardStyle,
            {
              transform: [{ translateX: position.x }, { rotate }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {renderCard(data[currentIndex])}
          {showOverlayRight && OverlayLabelRight && <OverlayLabelRight />}
          {showOverlayLeft && OverlayLabelLeft && <OverlayLabelLeft />}
        </Animated.View>
      </View>
    );
  },
);

// displayNameを設定
WebSwiper.displayName = "WebSwiper";

export default WebSwiper;
