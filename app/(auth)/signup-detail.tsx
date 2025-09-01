"use client";

import SignupStep2 from "@/components/auth/Step2";
import React, { Suspense } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SignupStep2Page() {
  return (
    <Suspense
      fallback={
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      }
    >
      <SignupStep2 />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    
  },
});
