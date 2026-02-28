"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Lang = "en" | "tr";

// ─── Define shape as a string-valued type ─────────────────────────────────
export type Translations = {
    // Nav / Sidebar
    dashboard: string;
    importCV: string;
    myCVs: string;
    cvOptimizer: string;
    searchJobs: string;
    savedJobs: string;
    myLetters: string;
    upgradePlan: string;
    settings: string;
    collapse: string;
    back: string;
    backToDashboard: string;
    // Dashboard
    recentCVs: string;
    recentCoverLetters: string;
    sortedByLastUpdated: string;
    viewAll: string;
    createCV: string;
    createLetter: string;
    noCVsYet: string;
    noCoverLettersYet: string;
    untitledPosition: string;
    noCompany: string;
    updated: string;
    recently: string;
    edit: string;
    convert: string;
    view: string;
    // Import
    importProfile: string;
    importProfileDesc: string;
    linkedinURL: string;
    pdfUpload: string;
    manualText: string;
    fromScratch: string;
    // Scout
    findOpportunity: string;
    opportunity: string;
    scoutDesc: string;
    searchJobsPlaceholder: string;
    locationLabel: string;
    searchJobsBtn: string;
    searching: string;
    popular: string;
    viewOnLinkedIn: string;
    optimizeCVBtn: string;
    // Letter Wizard
    createNewLetter: string;
    letterDesc: string;
    cvProfile: string;
    companyOrJobURL: string;
    companyURLPlaceholder: string;
    enterCompanyURL: string;
    selectCV: string;
    next: string;
    targetRole: string;
    targetRolePlaceholder: string;
    letterTone: string;
    letterLanguage: string;
    creatingLetter: string;
    noCV: string;
    loading: string;
    myCVsLabel: string;
    optimizedCVs: string;
    // Tones
    toneStartup: string;
    toneStartupDesc: string;
    toneCorporate: string;
    toneCorporateDesc: string;
    toneFriendly: string;
    toneFriendlyDesc: string;
    toneExecutive: string;
    toneExecutiveDesc: string;
    // Builder
    cvEditor: string;
    livePreview: string;
    saveChanges: string;
    saving: string;
    saved: string;
    unsaved: string;
    template: string;
    personal: string;
    summary: string;
    experience: string;
    education: string;
    skills: string;
    order: string;
    // Settings
    settingsTitle: string;
    languageSettingLabel: string;
    languageSettingDesc: string;
    english: string;
    turkish: string;
    signOut: string;
    // Landing
    pricing: string;
    login: string;
    signup: string;
    getStarted: string;
    learnMore: string;
};

const en: Translations = {
    // Nav / Sidebar
    dashboard: "Dashboard",
    importCV: "Import CV",
    myCVs: "My CVs",
    cvOptimizer: "CV Optimizer",
    searchJobs: "Search Jobs",
    savedJobs: "Saved Jobs ⭐",
    myLetters: "My Letters",
    upgradePlan: "Upgrade Plan",
    settings: "Settings",
    collapse: "Collapse",
    back: "Back",
    backToDashboard: "Back to Dashboard",
    // Dashboard
    recentCVs: "Recent CVs",
    recentCoverLetters: "Recent Cover Letters",
    sortedByLastUpdated: "Sorted by last updated",
    viewAll: "View All",
    createCV: "Create CV",
    createLetter: "Create Letter",
    noCVsYet: "No CVs yet. Create your first CV!",
    noCoverLettersYet: "No cover letters yet.",
    untitledPosition: "Untitled Position",
    noCompany: "No company",
    updated: "Updated",
    recently: "Recently",
    edit: "Edit",
    convert: "Convert",
    view: "View",
    // Import
    importProfile: "Import Profile",
    importProfileDesc: "Create your base profile quickly using one of the methods below.",
    linkedinURL: "LinkedIn URL",
    pdfUpload: "PDF Upload",
    manualText: "Manual Text",
    fromScratch: "From Scratch",
    // Scout
    findOpportunity: "Find your next",
    opportunity: "opportunity.",
    scoutDesc: "Search LinkedIn for real-time job listings and let AI optimize your CV for the perfect match.",
    searchJobsPlaceholder: "Job title, keywords, or company",
    locationLabel: "Location",
    searchJobsBtn: "Search Jobs",
    searching: "Searching...",
    popular: "Popular:",
    viewOnLinkedIn: "View on LinkedIn",
    optimizeCVBtn: "Optimize CV",
    // Letter Wizard
    createNewLetter: "Create New Letter",
    letterDesc: "Enter the company URL, and AI will prepare a cover letter introducing you.",
    cvProfile: "CV / Profile",
    companyOrJobURL: "Company or Job URL",
    companyURLPlaceholder: "https://example.com or linkedin.com/jobs/...",
    enterCompanyURL: "Enter the company website or a LinkedIn job URL.",
    selectCV: "Select CV / Profile...",
    next: "Next",
    targetRole: "Target Role",
    targetRolePlaceholder: "e.g. Senior Product Manager",
    letterTone: "Letter Tone",
    letterLanguage: "Language",
    creatingLetter: "Creating...",
    noCV: "No CV or profile yet.",
    loading: "Loading...",
    myCVsLabel: "My CVs",
    optimizedCVs: "Optimized CVs",
    // Tones
    toneStartup: "🚀 Startup & Innovative",
    toneStartupDesc: "Energetic, modern",
    toneCorporate: "🏛️ Corporate",
    toneCorporateDesc: "Formal, reliable",
    toneFriendly: "🤝 Friendly",
    toneFriendlyDesc: "Warm but professional",
    toneExecutive: "💎 Executive",
    toneExecutiveDesc: "Leadership focused",
    // Builder
    cvEditor: "CV Editor",
    livePreview: "Live Preview",
    saveChanges: "Save Changes",
    saving: "Saving...",
    saved: "Saved!",
    unsaved: "Unsaved",
    template: "Template",
    personal: "Personal",
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    order: "Order",
    // Settings
    settingsTitle: "Settings",
    languageSettingLabel: "Language",
    languageSettingDesc: "Choose your preferred language for the dashboard.",
    english: "English",
    turkish: "Turkish",
    signOut: "Sign Out",
    // Landing
    pricing: "Pricing",
    login: "Log In",
    signup: "Sign Up",
    getStarted: "Get Started — Free",
    learnMore: "See How It Works",
};

const tr: Translations = {
    // Nav / Sidebar
    dashboard: "Panel",
    importCV: "CV İçe Aktar",
    myCVs: "CV'lerim",
    cvOptimizer: "CV Optimize Et",
    searchJobs: "İş Ara",
    savedJobs: "Kayıtlı İlanlar ⭐",
    myLetters: "Mektuplarım",
    upgradePlan: "Planı Yükselt",
    settings: "Ayarlar",
    collapse: "Küçült",
    back: "Geri",
    backToDashboard: "Panele Dön",
    // Dashboard
    recentCVs: "Son CV'ler",
    recentCoverLetters: "Son Ön Yazılar",
    sortedByLastUpdated: "Son güncellenenlere göre",
    viewAll: "Tümünü Gör",
    createCV: "CV Oluştur",
    createLetter: "Mektup Oluştur",
    noCVsYet: "Henüz CV yok. İlk CV'ni oluştur!",
    noCoverLettersYet: "Henüz ön yazı yok.",
    untitledPosition: "İsimsiz Pozisyon",
    noCompany: "Şirket yok",
    updated: "Güncellendi",
    recently: "Yakın zamanda",
    edit: "Düzenle",
    convert: "Dönüştür",
    view: "Görüntüle",
    // Import
    importProfile: "Profil İçe Aktar",
    importProfileDesc: "Aşağıdaki yöntemlerden birini kullanarak profilini hızlıca oluştur.",
    linkedinURL: "LinkedIn URL",
    pdfUpload: "PDF Yükle",
    manualText: "Manuel Metin",
    fromScratch: "Sıfırdan",
    // Scout
    findOpportunity: "Yeni fırsatını",
    opportunity: "bul.",
    scoutDesc: "LinkedIn'de gerçek zamanlı iş ilanlarını ara ve AI ile CV'ni optimize et.",
    searchJobsPlaceholder: "İş unvanı, anahtar kelime veya şirket",
    locationLabel: "Konum",
    searchJobsBtn: "İş Ara",
    searching: "Aranıyor...",
    popular: "Popüler:",
    viewOnLinkedIn: "LinkedIn'de Gör",
    optimizeCVBtn: "CV Optimize Et",
    // Letter Wizard
    createNewLetter: "Yeni Mektup Oluştur",
    letterDesc: "Şirket URL'sini gir, AI seni tanıtan bir ön yazı hazırlasın.",
    cvProfile: "CV / Profil",
    companyOrJobURL: "Şirket veya İş URL'si",
    companyURLPlaceholder: "https://example.com veya linkedin.com/jobs/...",
    enterCompanyURL: "Şirket web sitesini veya LinkedIn iş URL'sini gir.",
    selectCV: "CV / Profil Seç...",
    next: "İleri",
    targetRole: "Hedef Pozisyon",
    targetRolePlaceholder: "ör. Kıdemli Ürün Müdürü",
    letterTone: "Mektup Tonu",
    letterLanguage: "Dil",
    creatingLetter: "Oluşturuluyor...",
    noCV: "Henüz CV veya profil yok.",
    loading: "Yükleniyor...",
    myCVsLabel: "CV'lerim",
    optimizedCVs: "Optimize Edilmiş CV'ler",
    // Tones
    toneStartup: "🚀 Startup & Yenilikçi",
    toneStartupDesc: "Dinamik, modern",
    toneCorporate: "🏛️ Kurumsal",
    toneCorporateDesc: "Resmi, güvenilir",
    toneFriendly: "🤝 Samimi",
    toneFriendlyDesc: "Sıcak ama profesyonel",
    toneExecutive: "💎 Yönetici",
    toneExecutiveDesc: "Liderlik odaklı",
    // Builder
    cvEditor: "CV Editörü",
    livePreview: "Canlı Önizleme",
    saveChanges: "Değişiklikleri Kaydet",
    saving: "Kaydediliyor...",
    saved: "Kaydedildi!",
    unsaved: "Kaydedilmedi",
    template: "Şablon",
    personal: "Kişisel",
    summary: "Özet",
    experience: "Deneyim",
    education: "Eğitim",
    skills: "Beceriler",
    order: "Sıralama",
    // Settings
    settingsTitle: "Ayarlar",
    languageSettingLabel: "Dil",
    languageSettingDesc: "Panel için tercih ettiğin dili seç.",
    english: "İngilizce",
    turkish: "Türkçe",
    signOut: "Çıkış Yap",
    // Landing
    pricing: "Fiyatlandırma",
    login: "Giriş Yap",
    signup: "Kayıt Ol",
    getStarted: "Ücretsiz Başla",
    learnMore: "Nasıl Çalışır?",
};

export const translations: Record<Lang, Translations> = { en, tr };

interface LangContextType {
    lang: Lang;
    setLang: (l: Lang) => void;
    t: Translations;
}

const LangContext = createContext<LangContextType>({
    lang: "en",
    setLang: () => { },
    t: en,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
    const [lang, _setLang] = useState<Lang>("en");

    useEffect(() => {
        const stored = localStorage.getItem("app_lang") as Lang | null;
        if (stored === "en" || stored === "tr") _setLang(stored);
    }, []);

    const setLang = (l: Lang) => {
        _setLang(l);
        localStorage.setItem("app_lang", l);
    };

    return (
        <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    return useContext(LangContext);
}
