import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";
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
          Auth using Clerk
        </Text>
      </SignedOut>
    </View>
  );
}
