import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { History } from "lucide-react-native";
import Colors from "@/constants/colors";

interface EmptyStateProps {
  icon: "history";
  title: string;
  message: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container} testID="empty-state">
      <View style={[styles.iconContainer, { backgroundColor: colors.secondaryBackground }]}>
        {icon === "history" && <History size={32} color={colors.secondaryText} />}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.secondaryText }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
});
