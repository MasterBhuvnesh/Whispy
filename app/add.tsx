import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";

export default function AddBirthdayScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddBirthday = async () => {
    if (!name) {
      Alert.alert("Error", "Please enter a name");
      return;
    }

    if (!date) {
      Alert.alert("Error", "Please enter a date");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from("friends_birthdays").insert({
        user_id: user.id,
        name,
        date,
        note: note || null,
      });

      if (error) throw error;

      Alert.alert("Success", "Birthday added successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to add birthday");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        alignContent: "center",
        justifyContent: "center",
      }}
    >
      <Stack.Screen
        options={{
          title: "Add Birthday",
          headerTitleStyle: { fontFamily: "Regular" },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#fff" },
        }}
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
        value={name}
        placeholder="Friend's Name"
        placeholderTextColor="#999"
        onChangeText={setName}
        editable={!loading}
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
        value={date}
        placeholder="Birthday (YYYY-MM-DD)"
        placeholderTextColor="#999"
        onChangeText={setDate}
        editable={!loading}
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#000",
          padding: 10,
          marginBottom: 20,
          fontFamily: "Regular",
          color: "#000",
          minHeight: 100,
          textAlignVertical: "top",
        }}
        value={note}
        placeholder="Notes (optional)"
        placeholderTextColor="#999"
        onChangeText={setNote}
        editable={!loading}
        multiline
      />

      <Pressable
        onPress={handleAddBirthday}
        disabled={loading}
        style={{
          padding: 15,
          backgroundColor: "#000",
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontFamily: "Regular" }}>
          {loading ? "Adding..." : "Add Birthday"}
        </Text>
      </Pressable>
    </View>
  );
}
