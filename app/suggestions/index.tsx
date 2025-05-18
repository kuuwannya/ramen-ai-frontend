import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Text } from "@components/ui/text";
import { Image, ScrollView, View } from "react-native";

export default function Suggestions() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="w-full">
      <View className="flex items-center justify-center py-8 w-full min-h-full">
        <View className="w-full max-w-sm px-4">
          <Image
            source={require("../../assets/Kocotto_demo.png")}
            className="w-full h-auto mb-6 rounded-lg shadow-md"
            resizeMode="contain"
          />
          <Card className="w-full shadow-lg mb-8">
            <CardHeader>
              <CardTitle>豚山 町田店</CardTitle>
              <CardDescription>ぶたやままちだてん</CardDescription>
            </CardHeader>
            <CardContent>
              <Text>営業時間: 00:00~00:00</Text>
            </CardContent>
            <CardFooter>
              <Text>定休日: 火・木</Text>
            </CardFooter>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
