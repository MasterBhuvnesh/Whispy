// import React, { useCallback, useEffect } from "react";
// import * as WebBrowser from "expo-web-browser";
// import * as AuthSession from "expo-auth-session";
// import { useSSO } from "@clerk/clerk-expo";
import {
  // View,
  // Button,
  Alert,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

// export const useWarmUpBrowser = () => {
//   useEffect(() => {
//     // Only warm up on native platforms
//     if (Platform.OS !== "web") {
//       void WebBrowser.warmUpAsync();
//     }
//     return () => {
//       // Only cool down on native platforms
//       if (Platform.OS !== "web") {
//         void WebBrowser.coolDownAsync();
//       }
//     };
//   }, []);
// };

// if (Platform.OS !== "web") {
//   WebBrowser.maybeCompleteAuthSession();
// }
// export default function GoogleAuth() {
//   useWarmUpBrowser();

//   // Use the `useSSO()` hook to access the `startSSOFlow()` method
//   const { startSSOFlow } = useSSO();

//   const onPress = useCallback(async () => {
//     try {
//       // Start the authentication process by calling `startSSOFlow()`
//       const { createdSessionId, setActive, signIn, signUp } =
//         await startSSOFlow({
//           strategy: "oauth_google",
//           // Defaults to current path
//           redirectUrl: AuthSession.makeRedirectUri(),
//         });

//       // If sign in was successful, set the active session
//       if (createdSessionId) {
//         setActive!({ session: createdSessionId });
//       } else {
//         // If there is no `createdSessionId`,
//         // there are missing requirements, such as MFA
//         // Use the `signIn` or `signUp` returned from `startSSOFlow`
//         // to handle next steps

//         // Example: Check if additional sign-in steps are required
//         if (signIn) {
//           // Handle additional sign-in steps (e.g., MFA)
//           Alert.alert(
//             "Additional Steps Required",
//             "Please complete the additional sign-in steps."
//           );
//           console.log("Sign-in requires additional steps:", signIn);
//         } else if (signUp) {
//           // Handle new user sign-up
//           Alert.alert("Welcome!", "Please complete your account setup.");
//           console.log("New user sign-up required:", signUp);
//         }
//       }
//     } catch (err) {
//       // See https://clerk.com/docs/custom-flows/error-handling
//       // for more info on error handling
//       console.error(JSON.stringify(err, null, 2));
//       Alert.alert(
//         "Error",
//         "An error occurred during authentication. Please try again."
//       );
//     }
//   }, []);

import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useSSO } from "@clerk/clerk-expo";
import { View, Button } from "react-native";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        console.log("Session created successfully:", createdSessionId);
        Alert.alert(
          "Success",
          "You have successfully signed in with Google!",
          [
            {
              text: "OK",
              onPress: () => console.log("OK Pressed"),
            },
          ],
          { cancelable: false }
        );
      } else {
        // If there is no `createdSessionId`,
        // there are missing requirements, such as MFA
        // Use the `signIn` or `signUp` returned from `startSSOFlow`
        // to handle next steps
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
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
          name="google"
          size={18}
          color="black"
        />
        <Text style={{ marginLeft: 10, fontFamily: "Regular", fontSize: 16 }}>
          Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}
