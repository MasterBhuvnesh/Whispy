import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof AntDesign>["name"];
  color: string;
}) {
  return (
    <AntDesign
      size={24}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#ccc",
        tabBarShowLabel: false,

        headerShown: false,

        // headerStyle: {
        //   backgroundColor: "#fff",
        // },
        // headerTintColor: "#000",
        // headerTitleStyle: {
        //   fontFamily: "Poppins_Black",
        // },

        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ color: "transparent" }}
            style={({ pressed }) => [
              props.style,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="home"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="user"
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
