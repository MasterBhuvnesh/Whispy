import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import DiscordAuth from "@/components/sso/sso_discord";
import GoogleAuth from "@/components/sso/sso_google";

export default function Page() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <SignedIn>
        <Redirect href="/(main)/home" />
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginVertical: 5,
          }}
        >
          <DiscordAuth />
          <GoogleAuth />
        </View>
        <Text style={{ marginTop: 10, fontFamily: "Regular" }}>
          Auth using Clerk - Bhuvnesh Verma
        </Text>
        <Pressable
          style={{
            backgroundColor: "#000",
            width: 100,
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontFamily: "Regular" }}>HLO - 😘</Text>
        </Pressable>
      </SignedOut>
    </View>
  );
}
