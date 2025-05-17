# 環境構築

1.依存関係のインストール

```
npm install
```

2. 開発サーバーの立ち上げ

```
npm run start
```

# Expo Goでの開発環境の立ち上げ

1. [Expo Go アプリ](https://apps.apple.com/jp/app/expo-go/id982107779)をインストール
2. アプリ内でアカウントを作成
3. 作成したアカウントでログインする

```
npx expo login
```

4. 開発サーバーの立ち上げ

- Webサーバーを立ち上げたい場合は、`w`を押すとブラウザが開く
- アプリの起動はExpo Goで開く

```
npm run start
```

# 技術選定

- TypeScript
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Expo Router](https://docs.expo.dev/versions/latest/sdk/router/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Nativewind](https://www.nativewind.dev/docs/getting-started/other-bundlers)
- [rn-swiper-list](https://github.com/Skipperlla/rn-swiper-list): Swiperのライブラリ

# 静的ツール

- ESLint
- Prettier
- huskey
- lint-staged
- commitlint
- commitizen
- gitmoji
