import { SignOutButton } from "@/components/SignOutButton";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, View, Pressable } from "react-native";

export default function ProfileScreen() {
  const { user } = useUser();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Image
        source={{ uri: user?.imageUrl }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text style={{ fontFamily: "Regular" }}>{user?.fullName}</Text>
      <Text style={{ fontFamily: "Regular" }}>
        Hello, {user?.emailAddresses[0].emailAddress}
      </Text>
      <View style={{ marginTop: 20, padding: 10, backgroundColor: "blue" }}>
        <Pressable>
          <Link href="/edit">
            <Text style={{ fontFamily: "Regular" }}>Edit Profile</Text>
          </Link>
        </Pressable>
      </View>
      <View style={{ marginTop: 20, padding: 10, backgroundColor: "red" }}>
        <SignOutButton />
      </View>
    </View>
  );
}
