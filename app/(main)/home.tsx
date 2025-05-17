import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Birthday } from "@/types/types";

export default function BirthdaysScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch of birthdays
  useEffect(() => {
    fetchBirthdays();

    // Set up real-time subscription
    if (user?.id) {
      const subscription = supabase
        .channel("friends_birthdays_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "friends_birthdays",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            // Handle different types of database events
            if (payload.eventType === "INSERT") {
              setBirthdays((current) => [...current, payload.new as Birthday]);
            } else if (payload.eventType === "UPDATE") {
              setBirthdays((current) =>
                current.map((birthday) =>
                  birthday.id === payload.new.id
                    ? (payload.new as Birthday)
                    : birthday
                )
              );
            } else if (payload.eventType === "DELETE") {
              setBirthdays((current) =>
                current.filter((birthday) => birthday.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

      // Clean up subscription on unmount
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user?.id]);

  const fetchBirthdays = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("friends_birthdays")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) throw error;
      setBirthdays(data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch birthdays");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Birthday }) => (
    <Pressable style={styles.birthdayCard}>
      <View style={styles.birthdayContent}>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </Text>
          {item.note && <Text style={styles.note}>{item.note}</Text>}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Simple Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Birthdays</Text>
      </View>

      {loading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator
            color="#000"
            size="large"
          />
        </View>
      ) : birthdays.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>No birthdays added yet</Text>
        </View>
      ) : (
        <FlatList
          data={birthdays}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Pressable
        style={styles.addButton}
        onPress={() => router.push("/add")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  headerTitle: {
    fontFamily: "Regular",
    fontSize: 24,
    color: "#000",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Regular",
    fontSize: 16,
    color: "#999",
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  birthdayCard: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  birthdayContent: {
    padding: 15,
  },
  name: {
    fontFamily: "Regular",
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  date: {
    fontFamily: "Regular",
    fontSize: 14,
    color: "#999",
  },
  note: {
    fontFamily: "Regular",
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    fontFamily: "Regular",
    fontSize: 24,
    color: "#fff",
  },
});
