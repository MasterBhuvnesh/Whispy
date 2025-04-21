import { View, Text } from "react-native";
import React from "react";

const home = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontFamily: "Regular" }}>
        Template made by Bhuvnesh Verma
      </Text>
    </View>
  );
};

export default home;
