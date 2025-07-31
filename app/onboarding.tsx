import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight, DollarSign, Clock } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useProfile } from "@/context/ProfileContext";
import { useLanguage } from "@/context/LanguageContext";
import Colors from "@/constants/colors";
import { CURRENCIES } from "@/constants/currencies";

export default function OnboardingScreen() {
  const { updateProfile } = useProfile();
  const { t } = useLanguage();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [step, setStep] = useState(0);
  const [salary, setSalary] = useState("");
  const [currency, setCurrency] = useState("₺");
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState("40");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const handleNext = () => {
    if (step === 0) {
      // Validate salary
      const salaryNum = parseFloat(salary);
      if (!salary || isNaN(salaryNum) || salaryNum <= 0) {
        showAlert(t('language') === 'tr' ? "Lütfen geçerli bir maaş miktarı girin." : "Please enter a valid salary amount.");
        return;
      }
      
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
      setStep(1);
    } else if (step === 1) {
      // Validate work hours
      const hoursNum = parseFloat(workHoursPerWeek);
      if (!workHoursPerWeek || isNaN(hoursNum) || hoursNum <= 0 || hoursNum > 168) {
        showAlert(t('language') === 'tr' ? "Lütfen geçerli çalışma saatleri girin (1 ile 168 arasında)." : "Please enter valid work hours (between 1 and 168).");
        return;
      }
      
      // Save profile and navigate to main app
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      updateProfile({
        salary: parseFloat(salary),
        currency,
        workHoursPerWeek: parseFloat(workHoursPerWeek),
        futureSalary: 0,
      });
      
      router.replace("/(tabs)");
    }
  };
  
  const showAlert = (message: string) => {
    if (Platform.OS === 'web') {
      alert(message);
    } else {
      Alert.alert(t('language') === 'tr' ? "Geçersiz Giriş" : "Invalid Input", message);
    }
  };
  
  const selectCurrency = (curr: string) => {
    setCurrency(curr);
    setShowCurrencyPicker(false);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{t('appTitle')}</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            {t('setupProfile')}
          </Text>
        </View>
        
        <View style={styles.stepsContainer}>
          <View 
            style={[
              styles.stepIndicator, 
              { backgroundColor: step === 0 ? colors.primary : colors.secondaryBackground }
            ]}
          />
          <View 
            style={[
              styles.stepIndicator, 
              { backgroundColor: step === 1 ? colors.primary : colors.secondaryBackground }
            ]}
          />
        </View>
        
        {step === 0 ? (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <DollarSign size={32} color={colors.primary} />
            </View>
            
            <Text style={[styles.stepTitle, { color: colors.text }]}>{t('monthlySalaryLabel')}?</Text>
            <Text style={[styles.stepDescription, { color: colors.secondaryText }]}>
              {t('setupProfile')}
            </Text>
            
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TouchableOpacity 
                style={styles.currencyButton}
                onPress={() => setShowCurrencyPicker(true)}
                testID="onboarding-currency-button"
              >
                <Text style={[styles.currencyButtonText, { color: colors.text }]}>{currency}</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="0.00"
                placeholderTextColor={colors.placeholder}
                keyboardType="decimal-pad"
                value={salary}
                onChangeText={setSalary}
                testID="onboarding-salary-input"
              />
            </View>
          </View>
        ) : (
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Clock size={32} color={colors.primary} />
            </View>
            
            <Text style={[styles.stepTitle, { color: colors.text }]}>{t('workHoursLabel')}?</Text>
            <Text style={[styles.stepDescription, { color: colors.secondaryText }]}>
              {t('hourlyRateExplanation')}
            </Text>
            
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="40"
                placeholderTextColor={colors.placeholder}
                keyboardType="decimal-pad"
                value={workHoursPerWeek}
                onChangeText={setWorkHoursPerWeek}
                testID="onboarding-hours-input"
              />
            </View>
          </View>
        )}
        
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
          testID="onboarding-next-button"
        >
          <Text style={styles.nextButtonText}>
            {step === 0 ? (t('language') === 'tr' ? "İleri" : "Next") : t('getStarted')}
          </Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>
        
        {showCurrencyPicker && (
          <View 
            style={[
              styles.currencyPickerContainer, 
              { backgroundColor: colors.card, borderColor: colors.border }
            ]}
            testID="onboarding-currency-picker"
          >
            <View style={styles.currencyPickerHeader}>
              <Text style={[styles.currencyPickerTitle, { color: colors.text }]}>{t('currencyLabel')}</Text>
              <TouchableOpacity onPress={() => setShowCurrencyPicker(false)}>
                <Text style={[styles.closeButton, { color: colors.text }]}>{t('language') === 'tr' ? "Kapat" : "Close"}</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.currencyList}>
              {CURRENCIES.map((curr) => (
                <TouchableOpacity
                  key={curr.symbol}
                  style={[
                    styles.currencyOption,
                    currency === curr.symbol && { backgroundColor: colors.secondaryBackground }
                  ]}
                  onPress={() => selectCurrency(curr.symbol)}
                  testID={`currency-option-${curr.symbol}`}
                >
                  <Text style={[styles.currencySymbolText, { color: colors.text }]}>
                    {curr.symbol}
                  </Text>
                  <Text style={[styles.currencyNameText, { color: colors.secondaryText }]}>
                    {curr.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  stepIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  stepContainer: {
    marginBottom: 40,
  },
  iconContainer: {
    alignSelf: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(47, 149, 220, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 60,
  },
  currencyButton: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    height: "60%",
    justifyContent: "center",
  },
  currencyButtonText: {
    fontSize: 18,
    fontWeight: "500",
  },
  input: {
    flex: 1,
    fontSize: 18,
    height: "100%",
    paddingLeft: 8,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  currencyPickerContainer: {
    position: "absolute",
    top: "30%",
    left: 20,
    right: 20,
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 300,
    zIndex: 1000,
  },
  currencyPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  currencyPickerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    fontSize: 16,
  },
  currencyList: {
    maxHeight: 240,
  },
  currencyOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  currencySymbolText: {
    fontSize: 16,
    fontWeight: "600",
    width: 40,
  },
  currencyNameText: {
    fontSize: 16,
  },
});
