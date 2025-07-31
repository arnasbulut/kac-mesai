import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Edit2, DollarSign, Clock, Globe } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useProfile } from "@/context/ProfileContext";
import { useLanguage } from "@/context/LanguageContext";
import { languages } from "@/constants/languages";
import Colors from "@/constants/Colors";
import { formatCurrency } from "@/utils/formatters";

export default function ProfileScreen() {
  const { profile, isLoading } = useProfile();
  const { t, language, updateLanguage } = useLanguage();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (!isLoading && !profile) {
      const timer = setTimeout(() => {
        router.replace("/onboarding");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [profile, isLoading, router]);

  const handleEditProfile = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    router.push("/profile/edit");
  };

  const toggleLanguage = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    const newLanguage = language === 'en' ? 'tr' : 'en';
    updateLanguage(newLanguage);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('loading')}</Text>
      </View>
    );
  }

  if (!profile) {
    return null;
  }

  // Calculate hourly rate
  const hourlyRate = profile.salary / (profile.workHoursPerWeek * 4.33); // 4.33 weeks per month average

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('yourProfile')}</Text>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={handleEditProfile}
          testID="edit-profile-button"
        >
          <Edit2 size={20} color="#fff" />
          <Text style={styles.editButtonText}>{t('edit')}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <DollarSign size={24} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('incomeDetails')}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>{t('monthlySalary')}</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {formatCurrency(profile.salary, profile.currency)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>{t('currency')}</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{profile.currency}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>{t('workHoursPerWeek')}</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{profile.workHoursPerWeek} {t('hours')}</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Clock size={24} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('hourlyRateTitle')}</Text>
        </View>
        
        <View style={styles.hourlyRateContainer}>
          <Text style={[styles.hourlyRateValue, { color: colors.primary }]}>
            {formatCurrency(hourlyRate, profile.currency)}
          </Text>
          <Text style={[styles.hourlyRateLabel, { color: colors.secondaryText }]}>{t('perHour')}</Text>
        </View>
        
        <Text style={[styles.hourlyRateExplanation, { color: colors.secondaryText }]}>
          {t('hourlyRateExplanation')}
        </Text>
      </View>

      {profile.futureSalary > 0 && (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <DollarSign size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('futureIncome')}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>{t('futureMonthlySalary')}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatCurrency(profile.futureSalary, profile.currency)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>{t('futureHourlyRate')}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {formatCurrency(profile.futureSalary / (profile.workHoursPerWeek * 4.33), profile.currency)}
            </Text>
          </View>
        </View>
      )}

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Globe size={24} color={colors.primary} />
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('language')}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.languageButton, { backgroundColor: colors.secondaryBackground }]}
          onPress={toggleLanguage}
          testID="language-toggle-button"
        >
          <Text style={[styles.languageButtonText, { color: colors.text }]}>
            {languages[language].flag} {languages[language].name}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "500",
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  hourlyRateContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  hourlyRateValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  hourlyRateLabel: {
    fontSize: 16,
  },
  hourlyRateExplanation: {
    fontSize: 14,
    textAlign: "center",
  },
  languageButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
