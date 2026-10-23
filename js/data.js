/* =========================================================
   شمعة نوࢪ | data.js
   بيانات المتجر: المنتجات + الأقسام + الأحجام + الكوبونات + الشحن
   لازم يتحمل قبل app.js (بعد i18n.js).
   ========================================================= */

const MAX_QTY = 10;
const SHIPPING_FEE = 50; // رسوم الشحن (ج.م)
const FREE_SHIPPING_FROM = 1500; // شحن مجاني لو الطلب بعد الخصم وصل للمبلغ ده
const COUPONS = { NOUR10: 10 }; // كود الخصم: نسبة الخصم %

const CATEGORIES = {
  candles: { ar: "شموع", en: "Candles" },
  perfumes: { ar: "عطور", en: "Perfumes" },
  "home-fragrance": { ar: "معطرات المنزل", en: "Home fragrance" },
  decor: { ar: "ديكور", en: "Decor" },
};

const SIZES = {
  small: { ar: "صغير", en: "Small" },
  medium: { ar: "متوسط", en: "Medium" },
  large: { ar: "كبير", en: "Large" },
};

/* الأسعار بالجنيه (غيّرها لأسعارك الحقيقية). added = ترتيب الأحدث (الأكبر = الأحدث). */
const PRODUCTS = [
  {
    id: 1,
    category: "candles",
    price: 180,
    added: 1,
    nameAr: "شمعة الفانيليا والعنبر",
    nameEn: "Vanilla & Amber Candle",
    descAr: "شمعة معطرة بنفحات الفانيليا والعنبر، تمنح مكانك دفئاً وهدوءاً.",
    descEn:
      "A scented candle with vanilla and amber notes that brings warmth and calm.",
    image: "images/شمعة الفانيليا والعنبر.png",
  },
  {
    id: 2,
    category: "candles",
    price: 220,
    added: 2,
    nameAr: "شمعة الورد المجفف",
    nameEn: "Dried Rose Candle",
    descAr: "شمعة مزينة بالورد المجفف بلمسة رومانسية تناسب الهدايا.",
    descEn:
      "A candle decorated with dried flowers, a romantic touch that suits gifts.",
    image: "images/hero1.png",
  },
  {
    id: 3,
    category: "candles",
    price: 160,
    added: 3,
    nameAr: "شمعة البرطمان بالفانيليا",
    nameEn: "Vanilla Jar Candle",
    descAr: "شمعة في برطمان زجاجي برائحة الفانيليا الدافئة.",
    descEn: "A candle in a glass jar with a warm vanilla scent.",
    image: "images/img1.png",
  },
  {
    id: 4,
    category: "candles",
    price: 250,
    added: 4,
    nameAr: "طقم الشموع البيضاء",
    nameEn: "White Pillar Candle Set",
    descAr: "طقم شموع بيضاء بأحجام مختلفة لإضاءة هادئة وأنيقة.",
    descEn:
      "A set of white pillar candles in different sizes for calm, elegant lighting.",
    image: "images/img10.png",
  },
  {
    id: 5,
    category: "candles",
    price: 195,
    added: 5,
    nameAr: "شمعة العنبر الأسود",
    nameEn: "Black Amber Candle",
    descAr: "شمعة بعبوة داكنة ورائحة عنبر عميقة تناسب المساء.",
    descEn:
      "A candle in a dark vessel with a deep amber scent, made for the evening.",
    image: "images/شمعة العنبر الأسود.png",
  },
  {
    id: 6,
    category: "home-fragrance",
    price: 240,
    added: 6,
    nameAr: "ناشر العصي العطري",
    nameEn: "Aromatic Reed Diffuser",
    descAr: "ناشر بعصي خشبية ينشر رائحة هادئة ومستمرة في المكان.",
    descEn:
      "A reed diffuser that spreads a calm, lasting fragrance through the room.",
    image: "images/ناشر العصي العطري.png",
  },
  {
    id: 7,
    category: "perfumes",
    price: 450,
    added: 7,
    nameAr: "عطر العود الهادئ",
    nameEn: "Calm Oud Perfume",
    descAr: "عطر بنفحات العود الهادئة وثبات جيد، بتغليف مناسب للإهداء.",
    descEn:
      "A perfume with soft oud notes and good longevity, gift-ready packaging.",
    image: "images/عطر العود الهادئ.png",
  },
  {
    id: 8,
    category: "home-fragrance",
    price: 130,
    added: 8,
    nameAr: "معطر غرفة بالخزامى",
    nameEn: "Lavender Room Spray",
    descAr: "معطر غرفة برائحة الخزامى المنعشة لأجواء مريحة.",
    descEn: "A room spray with fresh lavender for a relaxing atmosphere.",
    image: "images/معطر غرفة بالخزامى.png",
  },
  {
    id: 9,
    category: "decor",
    price: 210,
    added: 9,
    nameAr: "حامل شموع نحاسي",
    nameEn: "Copper Candle Holder",
    descAr: "حامل شموع بلمسة نحاسية دافئة يزيّن الطاولة والرفوف.",
    descEn:
      "A candle holder with a warm copper finish that dresses tables and shelves.",
    image: "images/حامل شموع نحاسي.png",
  },
  {
    id: 10,
    category: "decor",
    price: 280,
    added: 10,
    nameAr: "صينية الشموع الدافئة",
    nameEn: "Warm Candle Tray",
    descAr: "مجموعة شموع على صينية بإضاءة دافئة تناسب الجلسات والمناسبات.",
    descEn:
      "A group of candles on a tray with warm light for gatherings and occasions.",
    image: "images/img8.png",
  },
];
