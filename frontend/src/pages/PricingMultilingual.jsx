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

// Direct translation data for all languages
const translationData = {
  // English (default)
  'en': {
    title: "Choose Your Plan",
    subtitle: "Simple pricing for everyone",
    monthly: "Monthly",
    yearly: "Yearly",
    yearlyDiscount: "Save 10%",
    popular: "Most Popular",
    free: {
      name: "Free",
      description: "For individuals wanting to try our service",
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
  },
  // German
  'de': {
    title: "Wählen Sie Ihren Plan",
    subtitle: "Einfache Preisgestaltung für alle",
    monthly: "Monatlich",
    yearly: "Jährlich",
    yearlyDiscount: "Sparen Sie 10%",
    popular: "Am beliebtesten",
    free: {
      name: "Kostenlos",
      description: "Für Personen, die unseren Service ausprobieren möchten",
      features: [
        "3 kostenlose Credits pro Monat",
        "Standardqualitätsverarbeitung",
        "Webbasierter Editor",
        "JPG- und PNG-Downloads"
      ]
    },
    lite: {
      name: "Lite",
      description: "Für Einzelpersonen und kleine Teams mit regelmäßigem Bedarf",
      features: [
        "50 Credits pro Monat",
        "Hochwertige Verarbeitung",
        "Webbasierter Editor",
        "Unterstützung für alle gängigen Formate",
        "Batch-Verarbeitung von bis zu 10 Bildern",
        "Prioritätsverarbeitung"
      ]
    },
    pro: {
      name: "Pro",
      description: "Für Profis und Unternehmen mit hohem Volumen",
      features: [
        "250 Credits pro Monat",
        "Premium-Qualitätsverarbeitung",
        "Erweiterte Bearbeitungswerkzeuge",
        "Unterstützung für alle Formate, einschließlich TIFF",
        "Batch-Verarbeitung von bis zu 50 Bildern",
        "API-Zugriff",
        "Höchste Prioritätsverarbeitung"
      ]
    }
  },
  // Spanish
  'es': {
    title: "Elige Tu Plan",
    subtitle: "Precios simples para todos",
    monthly: "Mensual",
    yearly: "Anual",
    yearlyDiscount: "Ahorra 10%",
    popular: "Más Popular",
    free: {
      name: "Gratis",
      description: "Para personas que desean probar nuestro servicio",
      features: [
        "3 créditos gratis al mes",
        "Procesamiento de calidad estándar",
        "Editor basado en web",
        "Descargas JPG y PNG"
      ]
    },
    lite: {
      name: "Lite",
      description: "Para individuos y equipos pequeños con necesidades regulares",
      features: [
        "50 créditos al mes",
        "Procesamiento de alta calidad",
        "Editor basado en web",
        "Soporte para todos los formatos comunes",
        "Procesamiento por lotes de hasta 10 imágenes",
        "Procesamiento prioritario"
      ]
    },
    pro: {
      name: "Pro",
      description: "Para profesionales y empresas con necesidades de alto volumen",
      features: [
        "250 créditos al mes",
        "Procesamiento de calidad premium",
        "Herramientas de edición avanzadas",
        "Soporte para todos los formatos, incluido TIFF",
        "Procesamiento por lotes de hasta 50 imágenes",
        "Acceso API",
        "Procesamiento de máxima prioridad"
      ]
    }
  },
  // French
  'fr': {
    title: "Choisissez Votre Plan",
    subtitle: "Tarification simple pour tous",
    monthly: "Mensuel",
    yearly: "Annuel",
    yearlyDiscount: "Économisez 10%",
    popular: "Le Plus Populaire",
    free: {
      name: "Gratuit",
      description: "Pour les personnes qui souhaitent essayer notre service",
      features: [
        "3 crédits gratuits par mois",
        "Traitement de qualité standard",
        "Éditeur web",
        "Téléchargements JPG et PNG"
      ]
    },
    lite: {
      name: "Lite",
      description: "Pour les individus et les petites équipes avec des besoins réguliers",
      features: [
        "50 crédits par mois",
        "Traitement de haute qualité",
        "Éditeur web",
        "Support pour tous les formats courants",
        "Traitement par lots jusqu'à 10 images",
        "Traitement prioritaire"
      ]
    },
    pro: {
      name: "Pro",
      description: "Pour les professionnels et les entreprises avec des besoins de volume élevé",
      features: [
        "250 crédits par mois",
        "Traitement de qualité premium",
        "Outils d'édition avancés",
        "Support pour tous les formats, y compris TIFF",
        "Traitement par lots jusqu'à 50 images",
        "Accès API",
        "Traitement de la plus haute priorité"
      ]
    }
  },
  // Japanese
  'ja': {
    title: "プランを選択",
    subtitle: "シンプルな価格設定",
    monthly: "毎月",
    yearly: "毎年",
    yearlyDiscount: "10%節約",
    popular: "人気",
    free: {
      name: "無料",
      description: "サービスを試したい個人向け",
      features: [
        "月に3つの無料クレジット",
        "標準品質の処理",
        "Webベースのエディタ",
        "JPGとPNGのダウンロード"
      ]
    },
    lite: {
      name: "ライト",
      description: "定期的なニーズを持つ個人や小さなチーム向け",
      features: [
        "月に50クレジット",
        "高品質の処理",
        "Webベースのエディタ",
        "すべての一般的なフォーマットをサポート",
        "最大10画像のバッチ処理",
        "優先処理"
      ]
    },
    pro: {
      name: "プロ",
      description: "大量のニーズを持つプロフェッショナルや企業向け",
      features: [
        "月に250クレジット",
        "プレミアム品質の処理",
        "高度な編集ツール",
        "TIFFを含むすべてのフォーマットをサポート",
        "最大50画像のバッチ処理",
        "APIアクセス",
        "最高優先度の処理"
      ]
    }
  },
  // Russian
  'ru': {
    title: "Выберите Свой План",
    subtitle: "Простое ценообразование для всех",
    monthly: "Ежемесячно",
    yearly: "Ежегодно",
    yearlyDiscount: "Сэкономьте 10%",
    popular: "Самый Популярный",
    free: {
      name: "Бесплатный",
      description: "Для людей, желающих попробовать наш сервис",
      features: [
        "3 бесплатных кредита в месяц",
        "Обработка стандартного качества",
        "Веб-редактор",
        "Загрузки в JPG и PNG"
      ]
    },
    lite: {
      name: "Лайт",
      description: "Для частных лиц и небольших команд с регулярными потребностями",
      features: [
        "50 кредитов в месяц",
        "Обработка высокого качества",
        "Веб-редактор",
        "Поддержка всех распространенных форматов",
        "Пакетная обработка до 10 изображений",
        "Приоритетная обработка"
      ]
    },
    pro: {
      name: "Про",
      description: "Для профессионалов и компаний с большими объемами",
      features: [
        "250 кредитов в месяц",
        "Обработка премиум-качества",
        "Расширенные инструменты редактирования",
        "Поддержка всех форматов, включая TIFF",
        "Пакетная обработка до 50 изображений",
        "Доступ к API",
        "Обработка с наивысшим приоритетом"
      ]
    }
  },
  // Indonesian
  'id': {
    title: "Pilih Paket Anda",
    subtitle: "Harga sederhana untuk semua",
    monthly: "Bulanan",
    yearly: "Tahunan",
    yearlyDiscount: "Hemat 10%",
    popular: "Paling Populer",
    free: {
      name: "Gratis",
      description: "Untuk individu yang ingin mencoba layanan kami",
      features: [
        "3 kredit gratis per bulan",
        "Pemrosesan kualitas standar",
        "Editor berbasis web",
        "Unduhan JPG dan PNG"
      ]
    },
    lite: {
      name: "Lite",
      description: "Untuk individu dan tim kecil dengan kebutuhan rutin",
      features: [
        "50 kredit per bulan",
        "Pemrosesan kualitas tinggi",
        "Editor berbasis web",
        "Dukungan untuk semua format umum",
        "Pemrosesan batch hingga 10 gambar",
        "Pemrosesan prioritas"
      ]
    },
    pro: {
      name: "Pro",
      description: "Untuk profesional dan bisnis dengan kebutuhan volume tinggi",
      features: [
        "250 kredit per bulan",
        "Pemrosesan kualitas premium",
        "Alat pengeditan lanjutan",
        "Dukungan untuk semua format, termasuk TIFF",
        "Pemrosesan batch hingga 50 gambar",
        "Akses API",
        "Pemrosesan prioritas tertinggi"
      ]
    }
  },
  // Malaysian
  'ms': {
    title: "Pilih Pelan Anda",
    subtitle: "Harga mudah untuk semua",
    monthly: "Bulanan",
    yearly: "Tahunan",
    yearlyDiscount: "Jimat 10%",
    popular: "Paling Popular",
    free: {
      name: "Percuma",
      description: "Untuk individu yang ingin mencuba perkhidmatan kami",
      features: [
        "3 kredit percuma setiap bulan",
        "Pemprosesan kualiti standard",
        "Editor berasaskan web",
        "Muat turun JPG dan PNG"
      ]
    },
    lite: {
      name: "Lite",
      description: "Untuk individu dan pasukan kecil dengan keperluan biasa",
      features: [
        "50 kredit setiap bulan",
        "Pemprosesan berkualiti tinggi",
        "Editor berasaskan web",
        "Sokongan untuk semua format biasa",
        "Pemprosesan kelompok sehingga 10 imej",
        "Pemprosesan keutamaan"
      ]
    },
    pro: {
      name: "Pro",
      description: "Untuk profesional dan perniagaan dengan keperluan volum tinggi",
      features: [
        "250 kredit setiap bulan",
        "Pemprosesan kualiti premium",
        "Alat penyuntingan lanjutan",
        "Sokongan untuk semua format, termasuk TIFF",
        "Pemprosesan kelompok sehingga 50 imej",
        "Akses API",
        "Pemprosesan keutamaan tertinggi"
      ]
    }
  },
  // Italian
  'it': {
    title: "Scegli il Tuo Piano",
    subtitle: "Prezzi semplici per tutti",
    monthly: "Mensile",
    yearly: "Annuale",
    yearlyDiscount: "Risparmia 10%",
    popular: "Più Popolare",
    free: {
      name: "Gratuito",
      description: "Per chi vuole provare il nostro servizio",
      features: [
        "3 crediti gratuiti al mese",
        "Elaborazione di qualità standard",
        "Editor basato sul web",
        "Download JPG e PNG"
      ]
    },
    lite: {
      name: "Lite",
      description: "Per individui e piccoli team con esigenze regolari",
      features: [
        "50 crediti al mese",
        "Elaborazione di alta qualità",
        "Editor basato sul web",
        "Supporto per tutti i formati comuni",
        "Elaborazione in batch fino a 10 immagini",
        "Elaborazione prioritaria"
      ]
    },
    pro: {
      name: "Pro",
      description: "Per professionisti e aziende con esigenze di alto volume",
      features: [
        "250 crediti al mese",
        "Elaborazione di qualità premium",
        "Strumenti di modifica avanzati",
        "Supporto per tutti i formati, incluso TIFF",
        "Elaborazione in batch fino a 50 immagini",
        "Accesso API",
        "Elaborazione con massima priorità"
      ]
    }
  },
  // Hungarian
  'hu': {
    title: "Válassza ki a csomagját",
    subtitle: "Egyszerű árazás mindenkinek",
    monthly: "Havi",
    yearly: "Éves",
    yearlyDiscount: "10% megtakarítás",
    popular: "Legnépszerűbb",
    free: {
      name: "Ingyenes",
      description: "Azoknak, akik szeretnék kipróbálni szolgáltatásunkat",
      features: [
        "3 ingyenes kredit havonta",
        "Normál minőségű feldolgozás",
        "Webalapú szerkesztő",
        "JPG és PNG letöltések"
      ]
    },
    lite: {
      name: "Lite",
      description: "Egyéneknek és kis csapatoknak rendszeres igényekkel",
      features: [
        "50 kredit havonta",
        "Kiváló minőségű feldolgozás",
        "Webalapú szerkesztő",
        "Támogatás minden általános formátumhoz",
        "Kötegelt feldolgozás akár 10 képig",
        "Elsőbbségi feldolgozás"
      ]
    },
    pro: {
      name: "Pro",
      description: "Szakembereknek és vállalkozásoknak nagy mennyiségi igényekkel",
      features: [
        "250 kredit havonta",
        "Prémium minőségű feldolgozás",
        "Fejlett szerkesztési eszközök",
        "Támogatás minden formátumhoz, beleértve a TIFF-et is",
        "Kötegelt feldolgozás akár 50 képig",
        "API hozzáférés",
        "Legmagasabb prioritású feldolgozás"
      ]
    }
  },
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
  },
  // Portuguese
  'pt': {
    title: "Escolha Seu Plano",
    subtitle: "Preços simples para todos",
    monthly: "Mensal",
    yearly: "Anual",
    yearlyDiscount: "Economize 10%",
    popular: "Mais Popular",
    free: {
      name: "Gratuito",
      description: "Para indivíduos que querem experimentar nosso serviço",
      features: [
        "3 créditos gratuitos por mês",
        "Processamento de qualidade padrão",
        "Editor baseado na web",
        "Downloads JPG e PNG"
      ]
    },
    lite: {
      name: "Lite",
      description: "Para indivíduos e pequenas equipes com necessidades regulares",
      features: [
        "50 créditos por mês",
        "Processamento de alta qualidade",
        "Editor baseado na web",
        "Suporte para todos os formatos comuns",
        "Processamento em lote de até 10 imagens",
        "Processamento prioritário"
      ]
    },
    pro: {
      name: "Pro",
      description: "Para profissionais e empresas com necessidades de alto volume",
      features: [
        "250 créditos por mês",
        "Processamento de qualidade premium",
        "Ferramentas de edição avançadas",
        "Suporte para todos os formatos, incluindo TIFF",
        "Processamento em lote de até 50 imagens",
        "Acesso à API",
        "Processamento com prioridade máxima"
      ]
    }
  },
  // Korean
  'ko': {
    title: "플랜 선택",
    subtitle: "모두를 위한 간단한 가격 책정",
    monthly: "월간",
    yearly: "연간",
    yearlyDiscount: "10% 절약",
    popular: "가장 인기",
    free: {
      name: "무료",
      description: "서비스를 시도하고 싶은 개인을 위한",
      features: [
        "월 3개의 무료 크레딧",
        "표준 품질 처리",
        "웹 기반 에디터",
        "JPG 및 PNG 다운로드"
      ]
    },
    lite: {
      name: "라이트",
      description: "정기적인 요구가 있는 개인 및 소규모 팀을 위한",
      features: [
        "월 50 크레딧",
        "고품질 처리",
        "웹 기반 에디터",
        "모든 일반 형식 지원",
        "최대 10개 이미지 일괄 처리",
        "우선 처리"
      ]
    },
    pro: {
      name: "프로",
      description: "대용량 요구가 있는 전문가 및 기업을 위한",
      features: [
        "월 250 크레딧",
        "프리미엄 품질 처리",
        "고급 편집 도구",
        "TIFF를 포함한 모든 형식 지원",
        "최대 50개 이미지 일괄 처리",
        "API 액세스",
        "최고 우선 순위 처리"
      ]
    }
  },
  // Arabic
  'ar': {
    title: "اختر خطتك",
    subtitle: "تسعير بسيط للجميع",
    monthly: "شهري",
    yearly: "سنوي",
    yearlyDiscount: "وفر 10%",
    popular: "الأكثر شعبية",
    free: {
      name: "مجاني",
      description: "للأفراد الراغبين في تجربة خدمتنا",
      features: [
        "3 رصيد مجاني شهريًا",
        "معالجة بجودة قياسية",
        "محرر عبر الويب",
        "تنزيلات بصيغة JPG وPNG"
      ]
    },
    lite: {
      name: "لايت",
      description: "للأفراد والفرق الصغيرة ذات الاحتياجات المنتظمة",
      features: [
        "50 رصيد شهريًا",
        "معالجة عالية الجودة",
        "محرر عبر الويب",
        "دعم لجميع التنسيقات الشائعة",
        "معالجة دفعية تصل إلى 10 صور",
        "معالجة ذات أولوية"
      ]
    },
    pro: {
      name: "برو",
      description: "للمحترفين والشركات ذات احتياجات الحجم العالي",
      features: [
        "250 رصيد شهريًا",
        "معالجة بجودة ممتازة",
        "أدوات تحرير متقدمة",
        "دعم لجميع التنسيقات بما في ذلك TIFF",
        "معالجة دفعية تصل إلى 50 صورة",
        "وصول API",
        "معالجة بأعلى أولوية"
      ]
    }
  },
  // Vietnamese
  'vi': {
    title: "Chọn Gói Của Bạn",
    subtitle: "Giá đơn giản cho tất cả mọi người",
    monthly: "Hàng tháng",
    yearly: "Hàng năm",
    yearlyDiscount: "Tiết kiệm 10%",
    popular: "Phổ Biến Nhất",
    free: {
      name: "Miễn phí",
      description: "Dành cho những người muốn thử dịch vụ của chúng tôi",
      features: [
        "3 tín dụng miễn phí mỗi tháng",
        "Xử lý chất lượng tiêu chuẩn",
        "Trình chỉnh sửa dựa trên web",
        "Tải xuống JPG và PNG"
      ]
    },
    lite: {
      name: "Lite",
      description: "Dành cho cá nhân và nhóm nhỏ có nhu cầu thường xuyên",
      features: [
        "50 tín dụng mỗi tháng",
        "Xử lý chất lượng cao",
        "Trình chỉnh sửa dựa trên web",
        "Hỗ trợ tất cả các định dạng phổ biến",
        "Xử lý hàng loạt lên đến 10 hình ảnh",
        "Xử lý ưu tiên"
      ]
    },
    pro: {
      name: "Pro",
      description: "Dành cho chuyên gia và doanh nghiệp có nhu cầu khối lượng lớn",
      features: [
        "250 tín dụng mỗi tháng",
        "Xử lý chất lượng cao cấp",
        "Công cụ chỉnh sửa nâng cao",
        "Hỗ trợ tất cả các định dạng, bao gồm TIFF",
        "Xử lý hàng loạt lên đến 50 hình ảnh",
        "Truy cập API",
        "Xử lý ưu tiên cao nhất"
      ]
    }
  },
  // Thai
  'th': {
    title: "เลือกแผนของคุณ",
    subtitle: "ราคาที่เรียบง่ายสำหรับทุกคน",
    monthly: "รายเดือน",
    yearly: "รายปี",
    yearlyDiscount: "ประหยัด 10%",
    popular: "นิยมมากที่สุด",
    free: {
      name: "ฟรี",
      description: "สำหรับบุคคลที่ต้องการทดลองใช้บริการของเรา",
      features: [
        "3 เครดิตฟรีต่อเดือน",
        "การประมวลผลคุณภาพมาตรฐาน",
        "โปรแกรมแก้ไขบนเว็บ",
        "ดาวน์โหลดไฟล์ JPG และ PNG"
      ]
    },
    lite: {
      name: "Lite",
      description: "สำหรับบุคคลและทีมขนาดเล็กที่มีความต้องการเป็นประจำ",
      features: [
        "50 เครดิตต่อเดือน",
        "การประมวลผลคุณภาพสูง",
        "โปรแกรมแก้ไขบนเว็บ",
        "รองรับทุกรูปแบบไฟล์ทั่วไป",
        "ประมวลผลแบบกลุ่มสูงสุด 10 ภาพ",
        "การประมวลผลแบบมีลำดับความสำคัญ"
      ]
    },
    pro: {
      name: "Pro",
      description: "สำหรับมืออาชีพและธุรกิจที่มีความต้องการปริมาณมาก",
      features: [
        "250 เครดิตต่อเดือน",
        "การประมวลผลคุณภาพพรีเมียม",
        "เครื่องมือแก้ไขขั้นสูง",
        "รองรับทุกรูปแบบไฟล์ รวมถึง TIFF",
        "ประมวลผลแบบกลุ่มสูงสุด 50 ภาพ",
        "การเข้าถึง API",
        "การประมวลผลที่มีลำดับความสำคัญสูงสุด"
      ]
    }
  },
  // Dutch
  'nl': {
    title: "Kies Uw Plan",
    subtitle: "Eenvoudige prijzen voor iedereen",
    monthly: "Maandelijks",
    yearly: "Jaarlijks",
    yearlyDiscount: "Bespaar 10%",
    popular: "Meest Populair",
    free: {
      name: "Gratis",
      description: "Voor individuen die onze service willen proberen",
      features: [
        "3 gratis credits per maand",
        "Standaard kwaliteitsverwerking",
        "Web-gebaseerde editor",
        "JPG- en PNG-downloads"
      ]
    },
    lite: {
      name: "Lite",
      description: "Voor individuen en kleine teams met regelmatige behoeften",
      features: [
        "50 credits per maand",
        "Hoge kwaliteitsverwerking",
        "Web-gebaseerde editor",
        "Ondersteuning voor alle gangbare formaten",
        "Batchverwerking tot 10 afbeeldingen",
        "Prioriteitsverwerking"
      ]
    },
    pro: {
      name: "Pro",
      description: "Voor professionals en bedrijven met hoge volume behoeften",
      features: [
        "250 credits per maand",
        "Premium kwaliteitsverwerking",
        "Geavanceerde bewerkingstools",
        "Ondersteuning voor alle formaten, inclusief TIFF",
        "Batchverwerking tot 50 afbeeldingen",
        "API-toegang",
        "Hoogste prioriteitsverwerking"
      ]
    }
  },
  // Polish
  'pl': {
    title: "Wybierz Swój Plan",
    subtitle: "Proste ceny dla wszystkich",
    monthly: "Miesięcznie",
    yearly: "Rocznie",
    yearlyDiscount: "Zaoszczędź 10%",
    popular: "Najpopularniejszy",
    free: {
      name: "Darmowy",
      description: "Dla osób, które chcą wypróbować naszą usługę",
      features: [
        "3 darmowe kredyty miesięcznie",
        "Przetwarzanie standardowej jakości",
        "Edytor internetowy",
        "Pobieranie w formatach JPG i PNG"
      ]
    },
    lite: {
      name: "Lite",
      description: "Dla osób i małych zespołów o regularnych potrzebach",
      features: [
        "50 kredytów miesięcznie",
        "Przetwarzanie wysokiej jakości",
        "Edytor internetowy",
        "Wsparcie dla wszystkich popularnych formatów",
        "Przetwarzanie wsadowe do 10 obrazów",
        "Priorytetowe przetwarzanie"
      ]
    },
    pro: {
      name: "Pro",
      description: "Dla profesjonalistów i firm o dużych potrzebach",
      features: [
        "250 kredytów miesięcznie",
        "Przetwarzanie jakości premium",
        "Zaawansowane narzędzia do edycji",
        "Wsparcie dla wszystkich formatów, w tym TIFF",
        "Przetwarzanie wsadowe do 50 obrazów",
        "Dostęp do API",
        "Przetwarzanie o najwyższym priorytecie"
      ]
    }
  },
  // Norwegian
  'no': {
    title: "Velg Din Plan",
    subtitle: "Enkel prissetting for alle",
    monthly: "Månedlig",
    yearly: "Årlig",
    yearlyDiscount: "Spar 10%",
    popular: "Mest Populær",
    free: {
      name: "Gratis",
      description: "For enkeltpersoner som ønsker å prøve tjenesten vår",
      features: [
        "3 gratis kreditter per måned",
        "Behandling i standardkvalitet",
        "Nettbasert redigering",
        "JPG- og PNG-nedlastinger"
      ]
    },
    lite: {
      name: "Lite",
      description: "For enkeltpersoner og små team med regelmessige behov",
      features: [
        "50 kreditter per måned",
        "Behandling i høy kvalitet",
        "Nettbasert redigering",
        "Støtte for alle vanlige formater",
        "Batch-behandling av opptil 10 bilder",
        "Prioritert behandling"
      ]
    },
    pro: {
      name: "Pro",
      description: "For profesjonelle og bedrifter med store volumbehov",
      features: [
        "250 kreditter per måned",
        "Premium kvalitetsbehandling",
        "Avanserte redigeringsverktøy",
        "Støtte for alle formater, inkludert TIFF",
        "Batch-behandling av opptil 50 bilder",
        "API-tilgang",
        "Høyeste prioritetsbehandling"
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
          // If we're looking for features and didn't find them, use the English fallback
          if (parts.length > 1 && parts[1] === 'features') {
            const planKey = parts[0]; // 'free', 'lite', or 'pro'
            if (englishFeatures[planKey] && englishFeatures[planKey].features) {
              return englishFeatures[planKey].features;
            }
          }
          break;
        }
        result = result[part];
      }
      
      // If we found a result, return it
      if (result !== undefined) {
        return result;
      }
    }
    
    // If nothing found in current language, try English
    if (translationData.en) {
      let result = translationData.en;
      
      // Navigate through the path
      for (const part of parts) {
        if (!result || typeof result !== 'object') break;
        result = result[part];
      }
      
      // If we found a result in English, return it
      if (result !== undefined) {
        return result;
      }
    }
    
    // If we're looking for features, use our hardcoded English features
    if (parts.length > 1 && parts[1] === 'features') {
      const planKey = parts[0]; // 'free', 'lite', or 'pro'
      if (englishFeatures[planKey] && englishFeatures[planKey].features) {
        return englishFeatures[planKey].features;
      }
    }
    
    // As a last resort, check if it's any other plan property 
    if (parts.length === 2) {
      const planKey = parts[0]; // 'free', 'lite', or 'pro'
      const propKey = parts[1]; // 'name', 'description', etc.
      if (englishFeatures[planKey] && englishFeatures[planKey][propKey] !== undefined) {
        return englishFeatures[planKey][propKey];
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