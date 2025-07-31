import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Platform,
} from "react-native";
import { Trash2, ChevronDown, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useHistory, HistoryItem } from "@/context/HistoryContext";
import { useLanguage } from "@/context/LanguageContext";
import { TranslationKey } from "@/constants/languages";
import Colors from "@/constants/Colors";
import { formatCurrency, formatDate } from "@/utils/formatters";
import EmptyState from "@/components/EmptyState";
import { TimeUnit, TIME_UNITS, convertHoursToUnit, getPluralUnit } from "@/constants/timeUnits";

export default function HistoryScreen() {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const { t } = useLanguage();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isDeleting, setIsDeleting] = useState(false);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('hour');
  const [showTimeUnitPicker, setShowTimeUnitPicker] = useState(false);

  const handleClearHistory = () => {
    if (history.length === 0) return;

    const confirmClear = () => {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      clearHistory();
    };

    if (Platform.OS === 'web') {
      if (confirm(t('clearHistory') + '?')) {
        confirmClear();
      }
    } else {
      Alert.alert(
        t('clearHistory'),
        t('clearHistory') + '?',
        [
          { text: "Cancel", style: "cancel" },
          { text: t('clearHistory'), style: "destructive", onPress: confirmClear }
        ]
      );
    }
  };

  const handleDeleteItem = (id: string) => {
    setIsDeleting(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    removeFromHistory(id);
    
    // Small delay to allow animation to complete
    setTimeout(() => {
      setIsDeleting(false);
    }, 300);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View 
      style={[
        styles.historyItem, 
        { backgroundColor: colors.card, borderColor: colors.border }
      ]}
      testID={`history-item-${item.id}`}
    >
      <View style={styles.historyItemContent}>
        <View style={styles.historyItemHeader}>
          <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
            {item.productName}
          </Text>
          <Text style={[styles.historyDate, { color: colors.secondaryText }]}>
            {formatDate(item.date)}
          </Text>
        </View>
        
        <View style={styles.historyItemDetails}>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, { color: colors.secondaryText }]}>{t('price')}</Text>
            <Text style={[styles.priceValue, { color: colors.text }]}>
              {formatCurrency(item.price, item.currency)}
            </Text>
          </View>
          
          <View style={styles.hoursContainer}>
            <Text style={[styles.hoursLabel, { color: colors.secondaryText }]}>{t('ofWorkTime')}:</Text>
            <Text style={[styles.hoursValue, { color: colors.primary }]}>
              {convertHoursToUnit(item.hoursNeeded, timeUnit).toFixed(1)} {t(getPluralUnit(convertHoursToUnit(item.hoursNeeded, timeUnit), timeUnit) as TranslationKey)}
            </Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteItem(item.id)}
        disabled={isDeleting}
        testID={`delete-history-${item.id}`}
      >
        <Trash2 size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('history')}</Text>
        <View style={styles.headerActions}>
          {history.length > 0 && (
            <TouchableOpacity
              style={[styles.timeUnitButton, { backgroundColor: colors.secondaryBackground }]}
              onPress={() => setShowTimeUnitPicker(true)}
              testID="time-unit-button"
            >
              <Text style={[styles.timeUnitText, { color: colors.text }]}>
                {t((timeUnit + 's') as TranslationKey)}
              </Text>
              <ChevronDown size={16} color={colors.text} />
            </TouchableOpacity>
          )}
          {history.length > 0 && (
            <TouchableOpacity 
              onPress={handleClearHistory}
              style={styles.clearButton}
              testID="clear-history-button"
            >
              <Text style={[styles.clearButtonText, { color: colors.error }]}>{t('clearHistory')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {history.length === 0 ? (
        <EmptyState
          icon="history"
          title={t('noHistoryTitle')}
          message={t('noHistoryDescription')}
        />
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          testID="history-list"
        />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeUnitButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeUnitText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 20,
  },
  historyItem: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
  },
  historyItemContent: {
    flex: 1,
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  historyDate: {
    fontSize: 14,
  },
  historyItemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceContainer: {
    flex: 1,
    marginRight: 8,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  hoursContainer: {
    flex: 1,
  },
  hoursLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  hoursValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    justifyContent: "center",
    paddingLeft: 16,
  },
  timeUnitPickerContainer: {
    position: "absolute",
    top: 100,
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
