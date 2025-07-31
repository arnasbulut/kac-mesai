import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TimeUnit } from "@/constants/timeUnits";

export interface HistoryItem {
  id: string;
  productName: string;
  price: number;
  currency: string;
  hoursNeeded: number;
  date: string;
  timeUnit?: TimeUnit; // Optional for backward compatibility
}

const HISTORY_STORAGE_KEY = "cost-in-hours-history";

export const [HistoryProvider, useHistory] = createContextHook(() => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from storage on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  // Save history to storage whenever it changes
  const saveHistory = async (newHistory: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  // Add a new item to history
  const addToHistory = (item: HistoryItem) => {
    const newHistory = [item, ...history];
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  // Remove an item from history
  const removeFromHistory = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    isLoading,
  };
});
