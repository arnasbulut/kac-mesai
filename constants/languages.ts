export type Language = 'en' | 'tr';

export const languages = {
  en: {
    name: 'English',
    flag: '🇺🇸'
  },
  tr: {
    name: 'Türkçe',
    flag: '🇹🇷'
  }
};

export const translations = {
  en: {
    // Main screen
    appTitle: 'Kaç Mesai?',
    costInHours: 'Cost in Hours',
    priceInputPlaceholder: '0.00',
    productNamePlaceholder: 'Product name (optional)',
    addName: 'Add name',
    hideName: 'Hide name',
    calculate: 'Calculate',
    newCalculation: 'New Calculation',
    loading: 'Loading...',
    
    // Result
    thisPurchaseCosts: 'This purchase costs you:',
    productCosts: 'costs you:',
    hours: 'hours',
    days: 'days',
    weeks: 'weeks',
    months: 'months',
    hour: 'hour',
    day: 'day',
    week: 'week',
    month: 'month',
    ofWorkTime: 'of work time',
    price: 'Price:',
    hourlyRate: 'Hourly rate:',
    unnamedProduct: 'Unnamed product',
    
    // Profile
    yourProfile: 'Your Profile',
    edit: 'Edit',
    incomeDetails: 'Income Details',
    monthlySalary: 'Monthly Salary:',
    currency: 'Currency:',
    workHoursPerWeek: 'Work Hours per Week:',
    hourlyRateTitle: 'Hourly Rate',
    perHour: 'per hour',
    hourlyRateExplanation: 'This is your approximate hourly rate based on your monthly salary and work hours. The app uses this value to calculate how many work hours a purchase costs you.',
    futureIncome: 'Future Income',
    futureMonthlySalary: 'Future Monthly Salary:',
    futureHourlyRate: 'Future Hourly Rate:',
    
    // Edit Profile
    editProfile: 'Edit Profile',
    save: 'Save',
    monthlySalaryLabel: 'Monthly Salary',
    currencyLabel: 'Currency',
    workHoursLabel: 'Work Hours per Week',
    futureSalaryLabel: 'Future Monthly Salary (Optional)',
    
    // History
    history: 'History',
    noHistoryTitle: 'No calculations yet',
    noHistoryDescription: 'Your calculation history will appear here once you start using the app.',
    clearHistory: 'Clear History',
    
    // Onboarding
    welcome: 'Welcome!',
    setupProfile: 'Let\'s set up your profile to get started.',
    getStarted: 'Get Started',
    
    // Tabs
    calculator: 'Calculator',
    historyTab: 'History',
    profile: 'Profile',
    
    // Language
    language: 'Language',
    selectLanguage: 'Select Language',
    selectTimeUnit: 'Select Time Unit'
  },
  tr: {
    // Main screen
    appTitle: 'Kaç Mesai?',
    costInHours: 'Saat Cinsinden Maliyet',
    priceInputPlaceholder: '0,00',
    productNamePlaceholder: 'Ürün adı (isteğe bağlı)',
    addName: 'İsim ekle',
    hideName: 'İsmi gizle',
    calculate: 'Hesapla',
    newCalculation: 'Yeni Hesaplama',
    loading: 'Yükleniyor...',
    
    // Result
    thisPurchaseCosts: 'Bu satın alma size mal oluyor:',
    productCosts: 'size mal oluyor:',
    hours: 'saat',
    days: 'gün',
    weeks: 'hafta',
    months: 'ay',
    hour: 'saat',
    day: 'gün',
    week: 'hafta',
    month: 'ay',
    ofWorkTime: 'çalışma zamanı',
    price: 'Fiyat:',
    hourlyRate: 'Saatlik ücret:',
    unnamedProduct: 'İsimsiz ürün',
    
    // Profile
    yourProfile: 'Profiliniz',
    edit: 'Düzenle',
    incomeDetails: 'Gelir Detayları',
    monthlySalary: 'Aylık Maaş:',
    currency: 'Para Birimi:',
    workHoursPerWeek: 'Haftalık Çalışma Saati:',
    hourlyRateTitle: 'Saatlik Ücret',
    perHour: 'saat başına',
    hourlyRateExplanation: 'Bu, aylık maaşınız ve çalışma saatlerinize dayalı yaklaşık saatlik ücretinizdir. Uygulama bu değeri kullanarak bir satın almanın size kaç çalışma saatine mal olduğunu hesaplar.',
    futureIncome: 'Gelecek Gelir',
    futureMonthlySalary: 'Gelecek Aylık Maaş:',
    futureHourlyRate: 'Gelecek Saatlik Ücret:',
    
    // Edit Profile
    editProfile: 'Profili Düzenle',
    save: 'Kaydet',
    monthlySalaryLabel: 'Aylık Maaş',
    currencyLabel: 'Para Birimi',
    workHoursLabel: 'Haftalık Çalışma Saati',
    futureSalaryLabel: 'Gelecek Aylık Maaş (İsteğe Bağlı)',
    
    // History
    history: 'Geçmiş',
    noHistoryTitle: 'Henüz hesaplama yok',
    noHistoryDescription: 'Uygulamayı kullanmaya başladığınızda hesaplama geçmişiniz burada görünecek.',
    clearHistory: 'Geçmişi Temizle',
    
    // Onboarding
    welcome: 'Hoş Geldiniz!',
    setupProfile: 'Başlamak için profilinizi ayarlayalım.',
    getStarted: 'Başlayın',
    
    // Tabs
    calculator: 'Hesaplayıcı',
    historyTab: 'Geçmiş',
    profile: 'Profil',
    
    // Language
    language: 'Dil',
    selectLanguage: 'Dil Seçin',
    selectTimeUnit: 'Zaman Birimi Seçin'
  }
};

export type TranslationKey = keyof typeof translations.en;
