import { SignOutButton } from "@/components/SignOutButton";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, View, Pressable, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";

export default function ProfileScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#000"
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Image
        source={{ uri: user?.imageUrl }}
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text style={{ fontFamily: "Regular" }}>{user?.fullName}</Text>
      <Text style={{ fontFamily: "Regular" }}>
        Hello, {user?.emailAddresses[0].emailAddress}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "80%",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Pressable
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: "#000",
            borderRadius: 5,
            marginRight: 5,
          }}
        >
          <Link href="/edit">
            <Text
              style={{
                color: "#fff",
                fontFamily: "Regular",
                textAlign: "center",
              }}
            >
              Edit Profile
            </Text>
          </Link>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: "#000",
            borderRadius: 5,
            marginRight: 5,
          }}
        >
          <SignOutButton />
        </Pressable>
      </View>
    </View>
  );
}
