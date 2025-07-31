import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Profile {
  salary: number;
  currency: string;
  workHoursPerWeek: number;
  futureSalary: number;
}

const PROFILE_STORAGE_KEY = "cost-in-hours-profile";

export const [ProfileProvider, useProfile] = createContextHook(() => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile from storage on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Update profile
  const updateProfile = async (newProfile: Profile) => {
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  return {
    profile,
    updateProfile,
    isLoading,
  };
});
