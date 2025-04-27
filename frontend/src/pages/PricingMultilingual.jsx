import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import from mock module
import { PRICE_IDS } from '../lib/stripe-mock.js';

// Pricing plan base structure
const pricingPlansBase = [
  {
    id: 'free',
    key: 'free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyCredits: 3,
    yearlyCredits: 3,
    mostPopular: false,
  },
  {
    id: 'lite_monthly',
    idYearly: 'lite_yearly',
    key: 'lite',
    monthlyPrice: 9.9,
    yearlyPrice: 106.8,
    monthlyCredits: 50,
    yearlyCredits: 600,
    monthlyPriceId: PRICE_IDS.LITE_MONTHLY,
    yearlyPriceId: PRICE_IDS.LITE_YEARLY,
    mostPopular: true,
  },
  {
    id: 'pro_monthly',
    idYearly: 'pro_yearly',
    key: 'pro',
    monthlyPrice: 24.9,
    yearlyPrice: 262.8,
    monthlyCredits: 250,
    yearlyCredits: 3000,
    monthlyPriceId: PRICE_IDS.PRO_MONTHLY,
    yearlyPriceId: PRICE_IDS.PRO_YEARLY,
    mostPopular: false,
  },
];

// Direct translation data for each target language
const translationData = {
  'tr': {
    title: "Planınızı Seçin",
    subtitle: "Herkes için basit fiyatlandırma",
    monthly: "Aylık",
    yearly: "Yıllık",
    yearlyDiscount: "%10 Tasarruf Edin",
    popular: "En Popüler",
    free: {
      name: "Ücretsiz",
      description: "Hizmetimizi denemek isteyen bireyler için",
      features: [
        "Ayda 3 ücretsiz kredi",
        "Standart kalitede işleme",
        "Web tabanlı düzenleyici",
        "JPG ve PNG indirmeleri"
      ]
    },
    lite: {
      name: "Lite",
      description: "Düzenli ihtiyaçları olan bireyler ve küçük ekipler için",
      features: [
        "Ayda 50 kredi",
        "Yüksek kalitede işleme",
        "Web tabanlı düzenleyici",
        "Tüm yaygın formatlar için destek",
        "10 resme kadar toplu işleme",
        "Öncelikli işleme"
      ]
    },
    pro: {
      name: "Pro",
      description: "Yüksek hacimli ihtiyaçları olan profesyoneller ve işletmeler için",
      features: [
        "Ayda 250 kredi",
        "Premium kalitede işleme",
        "Gelişmiş düzenleme araçları",
        "TIFF dahil tüm formatlar için destek",
        "50 resme kadar toplu işleme",
        "API erişimi",
        "En yüksek öncelikli işleme"
      ]
    }
  },
  'el': {
    title: "Επιλέξτε το Πρόγραμμά Σας",
    subtitle: "Απλή τιμολόγηση για όλους",
    monthly: "Μηνιαίο",
    yearly: "Ετήσιο",
    yearlyDiscount: "Εξοικονομήστε 10%",
    popular: "Πιο Δημοφιλές",
    free: {
      name: "Δωρεάν",
      description: "Για άτομα που θέλουν να δοκιμάσουν την υπηρεσία μας",
      features: [
        "3 δωρεάν μονάδες ανά μήνα",
        "Επεξεργασία τυπικής ποιότητας",
        "Επεξεργαστής στο διαδίκτυο",
        "Λήψεις JPG και PNG"
      ]
    },
    lite: {
      name: "Lite",
      description: "Για άτομα και μικρές ομάδες με τακτικές ανάγκες",
      features: [
        "50 μονάδες ανά μήνα",
        "Επεξεργασία υψηλής ποιότητας",
        "Επεξεργαστής στο διαδίκτυο",
        "Υποστήριξη για όλες τις κοινές μορφές",
        "Μαζική επεξεργασία έως 10 εικόνων",
        "Επεξεργασία με προτεραιότητα"
      ]
    },
    pro: {
      name: "Pro",
      description: "Για επαγγελματίες και επιχειρήσεις με ανάγκες μεγάλου όγκου",
      features: [
        "250 μονάδες ανά μήνα",
        "Επεξεργασία κορυφαίας ποιότητας",
        "Προηγμένα εργαλεία επεξεργασίας",
        "Υποστήριξη για όλες τις μορφές, συμπεριλαμβανομένου του TIFF",
        "Μαζική επεξεργασία έως 50 εικόνων",
        "Πρόσβαση στο API",
        "Επεξεργασία με κορυφαία προτεραιότητα"
      ]
    }
  },
  'sv': {
    title: "Välj Din Plan",
    subtitle: "Enkel prissättning för alla",
    monthly: "Månadsvis",
    yearly: "Årsvis",
    yearlyDiscount: "Spara 10%",
    popular: "Mest Populär",
    free: {
      name: "Gratis",
      description: "För individer som vill prova vår tjänst",
      features: [
        "3 gratis krediter per månad",
        "Standardkvalitetsbearbetning",
        "Webbaserad redigerare",
        "JPG och PNG nedladdningar"
      ]
    },
    lite: {
      name: "Lite",
      description: "För individer och små team med regelbundna behov",
      features: [
        "50 krediter per månad",
        "Högkvalitativ bearbetning",
        "Webbaserad redigerare",
        "Stöd för alla vanliga format",
        "Batchbearbetning upp till 10 bilder",
        "Prioriterad bearbetning"
      ]
    },
    pro: {
      name: "Pro",
      description: "För professionella och företag med behov av hög volym",
      features: [
        "250 krediter per månad",
        "Premiumkvalitetsbearbetning",
        "Avancerade redigeringsverktyg",
        "Stöd för alla format, inklusive TIFF",
        "Batchbearbetning upp till 50 bilder",
        "API-åtkomst",
        "Högsta prioritetsbearbetning"
      ]
    }
  },
  'zh-TW': {
    title: "選擇您的方案",
    subtitle: "簡單明瞭的價格方案",
    monthly: "月付",
    yearly: "年付",
    yearlyDiscount: "節省10%",
    popular: "最受歡迎",
    free: {
      name: "免費",
      description: "適合想要嘗試我們服務的個人",
      features: [
        "每月3個免費點數",
        "標準品質處理",
        "網頁版編輯器",
        "JPG和PNG下載"
      ]
    },
    lite: {
      name: "輕量版",
      description: "適合有常規需求的個人和小型團隊",
      features: [
        "每月50點數",
        "高品質處理",
        "網頁版編輯器",
        "支持所有常見格式",
        "批量處理最多10張圖片",
        "優先處理"
      ]
    },
    pro: {
      name: "專業版",
      description: "適合有大量需求的專業人士和企業",
      features: [
        "每月250點數",
        "頂級品質處理",
        "進階編輯工具",
        "支持所有格式，包括TIFF",
        "批量處理最多50張圖片",
        "API訪問",
        "最高優先處理"
      ]
    }
  }
};

const PricingMultilingual = () => {
  const { t, i18n } = useTranslation('pricing');
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem('i18nextLng') || 'en'
  );
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Effect to get language from URL or localStorage and set it
  useEffect(() => {
    // Check for language in URL parameters
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    
    // Check localStorage
    const storedLang = localStorage.getItem('i18nextLng');
    
    // Determine which language to use (URL has priority)
    const targetLang = urlLang || storedLang || 'en';
    
    console.log(`PricingMultilingual - URL lang: ${urlLang}, stored lang: ${storedLang}, selected: ${targetLang}`);
    
    // Set the language in all places
    if (targetLang !== currentLanguage) {
      setCurrentLanguage(targetLang);
      localStorage.setItem('i18nextLng', targetLang);
      document.documentElement.lang = targetLang;
      
      // Try to apply it to i18n as well
      try {
        i18n.changeLanguage(targetLang).catch(err => {
          console.warn('Error changing i18n language:', err);
        });
      } catch (error) {
        console.warn('Error with i18n:', error);
      }
    }
    
    // Set document title based on language
    if (translationData[targetLang]) {
      document.title = `${translationData[targetLang].title} - iMagenWiz`;
    } else {
      document.title = "Choose Your Plan - iMagenWiz";
    }
    
    // Log current state for debugging
    console.log(`PricingMultilingual - Current language set to: ${targetLang}`);
    console.log(`Available translations: ${Object.keys(translationData).join(', ')}`);
  }, []);
  
  // Hardcoded English fallback features in case i18n doesn't have them
  const englishFeatures = {
    free: {
      name: "Free",
      description: "For individuals wanting to try out our service",
      features: [
        "3 free credits per month",
        "Standard quality processing",
        "Web-based editor",
        "JPG and PNG downloads"
      ]
    },
    lite: {
      name: "Lite",
      description: "For individuals and small teams with regular needs",
      features: [
        "50 credits per month",
        "High quality processing",
        "Web-based editor",
        "Support for all common formats",
        "Batch processing up to 10 images",
        "Priority processing"
      ]
    },
    pro: {
      name: "Pro",
      description: "For professionals and businesses with high volume needs",
      features: [
        "250 credits per month",
        "Premium quality processing",
        "Advanced editing tools",
        "Support for all formats, including TIFF",
        "Batch processing up to 50 images",
        "API access",
        "Highest priority processing"
      ]
    }
  };
  
  // Get translation text based on the current language
  const getText = (path, fallback = '') => {
    // Split path by dots (e.g., "free.name" -> ["free", "name"])
    const parts = path.split('.');
    
    // Check if we have direct translation for this language
    if (translationData[currentLanguage]) {
      let result = translationData[currentLanguage];
      
      // Navigate through the path
      for (const part of parts) {
        if (!result || typeof result !== 'object') {
          // If we're looking for features and didn't find them, try the English fallback
          if (parts.length > 1 && parts[1] === 'features') {
            const planKey = parts[0]; // 'free', 'lite', or 'pro'
            const englishPlan = englishFeatures[planKey];
            if (englishPlan && englishPlan.features) {
              return englishPlan.features;
            }
          }
          return fallback;
        }
        result = result[part];
      }
      
      // If we found a result, return it
      if (result !== undefined) {
        return result;
      }
      
      // If we're looking for features but didn't find them, try the English fallback
      if (parts.length > 1 && parts[1] === 'features') {
        const planKey = parts[0]; // 'free', 'lite', or 'pro'
        const englishPlan = englishFeatures[planKey];
        if (englishPlan && englishPlan.features) {
          return englishPlan.features;
        }
      }
      
      return fallback;
    }
    
    // If not in our direct translations, check if we're looking for features
    if (parts.length > 1 && parts[1] === 'features') {
      const planKey = parts[0]; // 'free', 'lite', or 'pro'
      const englishPlan = englishFeatures[planKey];
      if (englishPlan && englishPlan.features) {
        return englishPlan.features;
      }
    }
    
    // As last resort, use i18next
    const i18nResult = t(path, null);
    if (i18nResult !== null) {
      return i18nResult;
    }
    
    // If i18next doesn't have it and it's a plan property, check our English fallback
    if (parts.length > 1) {
      const planKey = parts[0]; // 'free', 'lite', or 'pro'
      const propKey = parts[1]; // 'name', 'description', 'features'
      const englishPlan = englishFeatures[planKey];
      if (englishPlan && englishPlan[propKey]) {
        return englishPlan[propKey];
      }
    }
    
    // Ultimate fallback
    return fallback;
  };
  
  // Function to handle purchase
  const handlePurchase = (planId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/pricing', plan: planId } });
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      console.log('Purchase initiated for plan:', planId);
      setLoading(false);
      navigate('/checkout', { state: { plan: planId } });
    }, 1000);
  };
  
  // Create pricing plans with translations
  const pricingPlans = pricingPlansBase.map(plan => {
    const isYearly = yearlyBilling && plan.key !== 'free';
    
    // Get translated content
    const name = getText(`${plan.key}.name`) || plan.key;
    const description = getText(`${plan.key}.description`) || '';
    const features = getText(`${plan.key}.features`) || [];
    
    // Calculate price and credits based on billing cycle
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits;
    const priceId = isYearly ? plan.yearlyPriceId : plan.monthlyPriceId;
    
    return {
      ...plan,
      name,
      description,
      price,
      credits,
      priceId,
      features: Array.isArray(features) ? features : [],
      isYearly
    };
  });
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight lg:text-5xl">
            {getText('title', 'Choose Your Plan')}
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            {getText('subtitle', 'Simple pricing for everyone')}
          </p>
          
          {/* Billing toggle */}
          <div className="mt-8 flex justify-center">
            <div className="relative flex items-center space-x-3">
              <span className={`text-sm font-medium ${!yearlyBilling ? 'text-gray-900' : 'text-gray-500'}`}>
                {getText('monthly', 'Monthly')}
              </span>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  yearlyBilling ? 'bg-amber-500' : 'bg-gray-200'
                }`}
                onClick={() => setYearlyBilling(!yearlyBilling)}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    yearlyBilling ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${yearlyBilling ? 'text-gray-900' : 'text-gray-500'}`}>
                {getText('yearly', 'Yearly')}
              </span>
              <span className="ml-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                {getText('yearlyDiscount', 'Save 10%')}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                plan.mostPopular ? 'border-2 border-amber-500' : 'border border-gray-200'
              }`}
            >
              {plan.mostPopular && (
                <div className="bg-amber-500 text-white text-center py-2 font-medium uppercase tracking-wide">
                  {getText('popular', 'Most Popular')}
                </div>
              )}

              <div className="p-6">
                <h2 className="text-2xl font-medium text-gray-900">{plan.name}</h2>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">
                    {plan.key === 'free' ? ' forever' : yearlyBilling ? '/year' : '/month'}
                  </span>
                </p>
                
                <p className="mt-1">
                  <span className="text-sm font-normal text-gray-500">
                    {plan.credits} {plan.key === 'free' ? 'free ' : ''}credits
                    {plan.key !== 'free' ? (yearlyBilling ? ' per year' : ' per month') : ''}
                  </span>
                </p>
                
                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loading}
                  className={`mt-6 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processing...' : plan.key === 'free' ? 'Get Started' : 'Subscribe'}
                </button>
              </div>
              
              <div className="py-6 px-6 space-y-4">
                <h3 className="text-sm font-medium text-gray-900">What's included:</h3>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingMultilingual;