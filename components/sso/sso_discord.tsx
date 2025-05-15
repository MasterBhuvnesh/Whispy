import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";
import {
  View,
  Button,
  Alert,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Only warm up on native platforms
    if (Platform.OS !== "web") {
      void WebBrowser.warmUpAsync();
    }
    return () => {
      // Only cool down on native platforms
      if (Platform.OS !== "web") {
        void WebBrowser.coolDownAsync();
      }
    };
  }, []);
};

if (Platform.OS !== "web") {
  WebBrowser.maybeCompleteAuthSession();
}

export default function DiscordAuth() {
  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_discord",
          // Defaults to current path
          redirectUrl: AuthSession.makeRedirectUri({
            scheme: "myapp",
            path: "/",
          }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps

        // Example: Check if additional sign-in steps are required
        if (signIn) {
          // Handle additional sign-in steps (e.g., MFA)
          Alert.alert(
            "Additional Steps Required",
            "Please complete the additional sign-in steps."
          );
          console.log("Sign-in requires additional steps:", signIn);
        } else if (signUp) {
          // Handle new user sign-up
          Alert.alert("Welcome!", "Please complete your account setup.");
          console.log("New user sign-up required:", signUp);
        }
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        "An error occurred during authentication. Please try again."
      );
    }
  }, []);

  return (
    <View
      style={{
        marginVertical: 5,
        alignItems: "center",
        justifyContent: "center",
        borderColor: "black",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <FontAwesome5
          name="discord"
          size={18}
          color="black"
        />
        <Text style={{ marginLeft: 10, fontFamily: "Regular", fontSize: 16 }}>
          Discord
        </Text>
      </TouchableOpacity>
    </View>
  );
}
