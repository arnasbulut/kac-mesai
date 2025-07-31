import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  useColorScheme,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { Check, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useProfile } from "@/context/ProfileContext";
import { useLanguage } from "@/context/LanguageContext";
import Colors from "@/constants/colors";
import { CURRENCIES } from "@/constants/currencies";

export default function EditProfileScreen() {
  const { profile, updateProfile } = useProfile();
  const { t } = useLanguage();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [salary, setSalary] = useState(profile ? profile.salary.toString() : "");
  const [currency, setCurrency] = useState(profile ? profile.currency : "$");
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState(
    profile ? profile.workHoursPerWeek.toString() : "40"
  );
  const [futureSalary, setFutureSalary] = useState(
    profile && profile.futureSalary ? profile.futureSalary.toString() : ""
  );
  
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const handleSave = () => {
    // Validate inputs
    const salaryNum = parseFloat(salary);
    const hoursNum = parseFloat(workHoursPerWeek);
    const futureSalaryNum = futureSalary ? parseFloat(futureSalary) : 0;
    
    if (isNaN(salaryNum) || salaryNum <= 0) {
      showAlert("Please enter a valid salary amount.");
      return;
    }
    
    if (isNaN(hoursNum) || hoursNum <= 0 || hoursNum > 168) {
      showAlert("Please enter valid work hours (between 1 and 168).");
      return;
    }
    
    if (futureSalary && (isNaN(futureSalaryNum) || futureSalaryNum <= 0)) {
      showAlert("Please enter a valid future salary or leave it empty.");
      return;
    }
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Update profile
    updateProfile({
      salary: salaryNum,
      currency,
      workHoursPerWeek: hoursNum,
      futureSalary: futureSalaryNum,
    });
    
    router.back();
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  const showAlert = (message: string) => {
    if (Platform.OS === 'web') {
      alert(message);
    } else {
      Alert.alert("Invalid Input", message);
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
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t('monthlySalaryLabel')}</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TouchableOpacity 
              style={styles.currencyButton}
              onPress={() => setShowCurrencyPicker(true)}
              testID="currency-selector-button"
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
              testID="salary-input"
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t('workHoursLabel')}</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="40"
              placeholderTextColor={colors.placeholder}
              keyboardType="decimal-pad"
              value={workHoursPerWeek}
              onChangeText={setWorkHoursPerWeek}
              testID="work-hours-input"
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>{t('futureSalaryLabel')}</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.currencySymbol, { color: colors.text }]}>{currency}</Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.placeholder}
              keyboardType="decimal-pad"
              value={futureSalary}
              onChangeText={setFutureSalary}
              testID="future-salary-input"
            />
          </View>
          <Text style={[styles.helperText, { color: colors.secondaryText }]}>
            Set this if you want to compare current vs. future purchasing power
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.secondaryBackground }]}
            onPress={handleCancel}
            testID="cancel-button"
          >
            <X size={20} color={colors.text} />
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            testID="save-button"
          >
            <Check size={20} color="#fff" />
            <Text style={styles.saveButtonText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
        
        {showCurrencyPicker && (
          <View 
            style={[
              styles.currencyPickerContainer, 
              { backgroundColor: colors.card, borderColor: colors.border }
            ]}
            testID="currency-picker"
          >
            <View style={styles.currencyPickerHeader}>
              <Text style={[styles.currencyPickerTitle, { color: colors.text }]}>{t('currencyLabel')}</Text>
              <TouchableOpacity onPress={() => setShowCurrencyPicker(false)}>
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.currencyList}>
              {CURRENCIES.map((curr, index) => (
                <TouchableOpacity
                  key={`${curr.symbol}-${index}`}
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
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
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
  currencySymbol: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    height: "100%",
    paddingLeft: 8,
  },
  helperText: {
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  currencyPickerContainer: {
    position: "absolute",
    top: 80,
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
