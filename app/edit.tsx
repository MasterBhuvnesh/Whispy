import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";

export default function EditProfileScreen() {
  const { user } = useUser();
  const { isLoaded } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [profileImage, setProfileImage] = useState(user?.imageUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to upload images."
        );
      }
    })();
  }, []);

  const convertImageToBase64 = async (uri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists && fileInfo.size && fileInfo.size > 2 * 1024 * 1024) {
        Alert.alert("Error", "Image size must be less than 2MB.");
        return null;
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      Alert.alert("Error", "Failed to process image. Please try again.");
      return null;
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const manipulatedImage = await manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 500, height: 500 } }],
          { compress: 0.7, format: SaveFormat.JPEG }
        );

        const base64Image = await convertImageToBase64(manipulatedImage.uri);
        if (base64Image) {
          setProfileImage(base64Image);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleGifPicker = async () => {
    try {
      setUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: "image/gif",
      });

      if (result.canceled) {
        console.log("User cancelled file picker.");
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        throw new Error("No file selected.");
      }

      const file = result.assets[0];
      if (!file.uri) {
        throw new Error("No file URI found.");
      }

      const base64Gif = await convertImageToBase64(file.uri);
      if (base64Gif) {
        setProfileImage(base64Gif);
      }
    } catch (error) {
      console.error("Error picking GIF:", error);
      Alert.alert("Error", "Failed to pick GIF. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!isLoaded || !user) {
      Alert.alert("Error", "User not loaded. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      if (profileImage !== user.imageUrl) {
        await user.setProfileImage({ file: profileImage });
      }

      await user.update({ firstName, lastName });

      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        error.errors?.[0]?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          title: "",
          headerTitleStyle: { fontFamily: "Regular" },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("@/assets/images/icon.png")
          }
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 10,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
          }}
        >
          <Pressable
            onPress={handleImagePicker}
            disabled={uploading || isLoading}
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: "#000",
              borderRadius: 5,
              marginRight: 5,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "Regular",
                textAlign: "center",
              }}
            >
              Change Photo
            </Text>
          </Pressable>
          <Pressable
            onPress={handleGifPicker}
            disabled={uploading || isLoading}
            style={{
              flex: 1,
              padding: 10,
              borderWidth: 1,
              borderColor: "#000",
              borderRadius: 5,
              marginLeft: 5,
            }}
          >
            <Text
              style={{
                color: "#000",
                fontFamily: "Regular",
                textAlign: "center",
              }}
            >
              Upload GIF
            </Text>
          </Pressable>
        </View>
      </View>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#000",
          padding: 10,
          marginBottom: 10,
          fontFamily: "Regular",
          color: "#000",
        }}
        value={firstName}
        placeholder="First Name"
        placeholderTextColor="#999"
        onChangeText={setFirstName}
        editable={!isLoading}
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#000",
          padding: 10,
          marginBottom: 10,
          fontFamily: "Regular",
          color: "#000",
        }}
        value={lastName}
        placeholder="Last Name"
        placeholderTextColor="#999"
        onChangeText={setLastName}
        editable={!isLoading}
      />

      <Pressable
        onPress={handleUpdateProfile}
        disabled={isLoading || uploading}
        style={{
          padding: 15,
          backgroundColor: "#000",
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontFamily: "Regular" }}>
          {isLoading ? "Updating..." : "Update Profile"}
        </Text>
      </Pressable>
    </View>
  );
}
