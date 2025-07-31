import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
  Platform,
  useColorScheme,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight, Plus, X, ChevronDown } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useProfile } from "@/context/ProfileContext";
import { useHistory } from "@/context/HistoryContext";
import { useLanguage } from "@/context/LanguageContext";
import { TranslationKey } from "@/constants/languages";
import Colors from "@/constants/Colors";
import { formatCurrency } from "@/utils/formatters";
import { TimeUnit, TIME_UNITS, convertHoursToUnit, getPluralUnit } from "@/constants/timeUnits";

export default function CalculatorScreen() {
  const { profile, isLoading } = useProfile();
  const { addToHistory } = useHistory();
  const { t } = useLanguage();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [price, setPrice] = useState("");
  const [productName, setProductName] = useState("");
  const [showProductName, setShowProductName] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [isCalculated, setIsCalculated] = useState(false);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('hour');
  const [showTimeUnitPicker, setShowTimeUnitPicker] = useState(false);
  
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const resultTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Check if profile exists, if not redirect to onboarding
    if (!isLoading && !profile) {
      // Use requestAnimationFrame to ensure navigation happens after render
      requestAnimationFrame(() => {
        router.replace("/onboarding");
      });
    }
  }, [profile, isLoading, router]);

  const calculateHours = () => {
    if (!price || !profile) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Keyboard.dismiss();
    
    const priceValue = parseFloat(price.replace(/,/g, '.'));
    const hourlyRate = profile.salary / (profile.workHoursPerWeek * 4.33); // 4.33 weeks per month average
    const hoursNeeded = priceValue / hourlyRate;
    
    setResult(hoursNeeded);
    setIsCalculated(true);
    
    // Add to history
    addToHistory({
      id: Date.now().toString(),
      productName: productName || t('unnamedProduct'),
      price: priceValue,
      currency: profile.currency,
      hoursNeeded,
      date: new Date().toISOString(),
      timeUnit,
    });
    
    // Animate result
    Animated.parallel([
      Animated.timing(resultOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(resultTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetCalculation = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Animate out
    Animated.parallel([
      Animated.timing(resultOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(resultTranslateY, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
        setPrice("");
      setProductName("");
      setResult(null);
      setIsCalculated(false);
      setShowTimeUnitPicker(false);
    });
  };

  const toggleProductNameInput = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setShowProductName(!showProductName);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <Text style={[styles.title, { color: colors.text }]}>{t('loading')}</Text>
      </View>
    );
  }

  if (!profile) {
    return null; // Will redirect in useEffect
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.calculatorContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('appTitle')}
          </Text>
          
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.currencySymbol, { color: colors.text }]}>
              {profile.currency}
            </Text>
            <TextInput
              style={[styles.priceInput, { color: colors.text }]}
              placeholder={t('priceInputPlaceholder')}
              placeholderTextColor={colors.placeholder}
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
              onSubmitEditing={calculateHours}
              testID="price-input"
            />
          </View>
          
          {showProductName && (
            <View style={[styles.productNameContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TextInput
                style={[styles.productNameInput, { color: colors.text }]}
                placeholder={t('productNamePlaceholder')}
                placeholderTextColor={colors.placeholder}
                value={productName}
                onChangeText={setProductName}
                testID="product-name-input"
              />
            </View>
          )}
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.advancedButton, { backgroundColor: colors.secondaryBackground }]}
              onPress={toggleProductNameInput}
              testID="toggle-product-name-button"
            >
              {showProductName ? (
                <X size={20} color={colors.text} />
              ) : (
                <Plus size={20} color={colors.text} />
              )}
              <Text style={[styles.advancedButtonText, { color: colors.text }]}>
                {showProductName ? t('hideName') : t('addName')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.calculateButton, { backgroundColor: colors.primary }]}
              onPress={calculateHours}
              disabled={!price}
              testID="calculate-button"
            >
              <Text style={styles.calculateButtonText}>{t('calculate')}</Text>
              <ArrowRight size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {isCalculated && (
            <Animated.View 
              style={[
                styles.resultContainer,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: resultOpacity,
                  transform: [{ translateY: resultTranslateY }]
                }
              ]}
              testID="result-container"
            >
              <View style={styles.resultTextContainer}>
                <Text style={[styles.resultLabel, { color: colors.secondaryText }]}>
                  {productName ? `${productName} ${t('productCosts')}` : t('thisPurchaseCosts')}
                </Text>
                <View style={styles.resultValueContainer}>
                  <Text style={[styles.resultValue, { color: colors.primary }]}>
                    {result !== null ? convertHoursToUnit(result, timeUnit).toFixed(1) : "0"}
                  </Text>
                  <TouchableOpacity
                    style={[styles.timeUnitButton, { backgroundColor: colors.secondaryBackground }]}
                    onPress={() => setShowTimeUnitPicker(true)}
                    testID="time-unit-button"
                  >
                    <Text style={[styles.timeUnitText, { color: colors.text }]}>
                      {result !== null && convertHoursToUnit(result, timeUnit) === 1 ? t(timeUnit as TranslationKey) : t(getPluralUnit(convertHoursToUnit(result || 0, timeUnit), timeUnit) as TranslationKey)}
                    </Text>
                    <ChevronDown size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.resultSubtext, { color: colors.secondaryText }]}>
                  {t('ofWorkTime')}
                </Text>
              </View>
              
              <View style={styles.resultDetails}>
                <Text style={[styles.resultDetailText, { color: colors.secondaryText }]}>
                  {t('price')} {formatCurrency(parseFloat(price), profile.currency)}
                </Text>
                <Text style={[styles.resultDetailText, { color: colors.secondaryText }]}>
                  {t('hourlyRate')} {formatCurrency(profile.salary / (profile.workHoursPerWeek * 4.33), profile.currency)}
                </Text>
              </View>
              
              <TouchableOpacity
                style={[styles.resetButton, { backgroundColor: colors.secondaryBackground }]}
                onPress={resetCalculation}
                testID="reset-button"
              >
                <Text style={[styles.resetButtonText, { color: colors.text }]}>
                  {t('newCalculation')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          
          {showTimeUnitPicker && (
            <View 
              style={[
                styles.timeUnitPickerContainer, 
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
              testID="time-unit-picker"
            >
              <View style={styles.timeUnitPickerHeader}>
                <Text style={[styles.timeUnitPickerTitle, { color: colors.text }]}>{t('selectTimeUnit')}</Text>
                <TouchableOpacity onPress={() => setShowTimeUnitPicker(false)}>
                  <X size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.timeUnitList}>
                {TIME_UNITS.map((unit) => (
                  <TouchableOpacity
                    key={unit.value}
                    style={[
                      styles.timeUnitOption,
                      timeUnit === unit.value && { backgroundColor: colors.secondaryBackground }
                    ]}
                    onPress={() => {
                      setTimeUnit(unit.value);
                      setShowTimeUnitPicker(false);
                      if (Platform.OS !== 'web') {
                        Haptics.selectionAsync();
                      }
                    }}
                    testID={`time-unit-option-${unit.value}`}
                  >
                    <Text style={[styles.timeUnitOptionText, { color: colors.text }]}>
                      {t((unit.labelKey + 's') as TranslationKey)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  calculatorContainer: {
    width: "100%",
    maxWidth: 500,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 70,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 24,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 24,
    height: "100%",
  },
  productNameContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 16,
  },
  productNameInput: {
    flex: 1,
    fontSize: 18,
    height: "100%",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  advancedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },
  advancedButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
  calculateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1.5,
  },
  calculateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  resultContainer: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  resultTextContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultSubtext: {
    fontSize: 16,
  },
  resultDetails: {
    marginBottom: 20,
  },
  resultDetailText: {
    fontSize: 14,
    marginBottom: 4,
  },
  resetButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  resultValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  timeUnitButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  timeUnitText: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 4,
  },
  timeUnitPickerContainer: {
    position: "absolute",
    top: 300,
    left: 20,
    right: 20,
    borderWidth: 1,
    borderRadius: 12,
    zIndex: 1000,
  },
  timeUnitPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  timeUnitPickerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  timeUnitList: {
    padding: 8,
  },
  timeUnitOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  timeUnitOptionText: {
    fontSize: 16,
    textAlign: "center",
  },
});
