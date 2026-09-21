export type Book = {
  id: string;
  title: string;
  titleEn?: string;
  author: string;
  translator?: string;
  description: string;
  pageCount: number;
  language: string;
  coverPalette: [string, string];
  category: string;
  price?: number;
  coverUrl?: string;
  published?: boolean;
  progress?: number;
  lastRead?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "فعال" | "غیرفعال";
  assignedBookIds: string[];
  role: "user" | "admin";
};

export const mockBooks: Book[] = [
  {
    id: "b1",
    title: "شب‌های روشن",
    titleEn: "White Nights",
    author: "فیودور داستایوفسکی",
    translator: "سروش حبیبی",
    description:
      "روایتی شاعرانه از تنهایی و عشقی گذرا در خیابان‌های سن‌پترزبورگ؛ داستایوفسکی جوان در این نوول کوتاه، درونی‌ترین لایه‌های احساس آدمی را کاویده است.",
    pageCount: 168,
    language: "فارسی",
    coverPalette: ["#1f3a2e", "#0f2419"],
    category: "ادبیات کلاسیک",
    progress: 62,
    lastRead: "دیروز",
  },
  {
    id: "b2",
    title: "بوف کور",
    author: "صادق هدایت",
    description:
      "شاهکار مدرنیستی ادبیات فارسی؛ روایتی تاریک و رؤیاگون از ذهنی که میان واقعیت و کابوس در نوسان است.",
    pageCount: 124,
    language: "فارسی",
    coverPalette: ["#3d2418", "#1a0f08"],
    category: "ادبیات معاصر",
    progress: 100,
    lastRead: "هفته گذشته",
  },
  {
    id: "b3",
    title: "صد سال تنهایی",
    titleEn: "Cien años de soledad",
    author: "گابریل گارسیا مارکز",
    translator: "بهمن فرزانه",
    description:
      "حماسه‌ای از خانواده بوئندیا در دهکده خیالی ماکوندو؛ اثری بنیادین در سبک رئالیسم جادویی.",
    pageCount: 464,
    language: "فارسی",
    coverPalette: ["#5a3a1a", "#2a1a08"],
    category: "رئالیسم جادویی",
    progress: 24,
    lastRead: "امروز",
  },
  {
    id: "b4",
    title: "کیمیاگر",
    author: "پائولو کوئیلو",
    translator: "آرش حجازی",
    description:
      "سفر چوپانی جوان به‌سوی گنجی که در دوردست‌ها انتظارش را می‌کشد؛ روایتی از افسانه شخصی هر انسان.",
    pageCount: 208,
    language: "فارسی",
    coverPalette: ["#4a3418", "#241708"],
    category: "داستان معنوی",
    progress: 0,
  },
  {
    id: "b5",
    title: "ملت عشق",
    author: "الیف شافاک",
    translator: "ارسلان فصیحی",
    description:
      "دو روایت موازی؛ زندگی زنی امروزی و داستان دیدار شمس و مولانا. اثری درباره عشق در معنای عرفانی و انسانی.",
    pageCount: 512,
    language: "فارسی",
    coverPalette: ["#2e1f3d", "#150c1c"],
    category: "ادبیات معاصر",
    progress: 45,
    lastRead: "۳ روز پیش",
  },
  {
    id: "b6",
    title: "سووشون",
    author: "سیمین دانشور",
    description:
      "نخستین رمان بلند فارسی به قلم زنی ایرانی؛ روایتی از شیراز در روزهای اشغال و زنی که در برابر تاریخ می‌ایستد.",
    pageCount: 296,
    language: "فارسی",
    coverPalette: ["#1a2e3d", "#0a1520"],
    category: "ادبیات معاصر",
    progress: 12,
  },
  {
    id: "b7",
    title: "چشم‌هایش",
    author: "بزرگ علوی",
    description:
      "رمانی درباره عشق، هنر و سیاست در ایرانِ رضاشاهی؛ راوی به‌دنبال زنی می‌گردد که چشمانش تنها نشانه بازمانده اوست.",
    pageCount: 224,
    language: "فارسی",
    coverPalette: ["#2a1f3d", "#120c1e"],
    category: "ادبیات معاصر",
  },
  {
    id: "b8",
    title: "قلعه حیوانات",
    titleEn: "Animal Farm",
    author: "جرج اورول",
    translator: "امیرشاهی",
    description:
      "تمثیلی گزنده از انقلاب و قدرت؛ حیواناتی که در آرزوی برابری، خود به ستمگر بدل می‌شوند.",
    pageCount: 152,
    language: "فارسی",
    coverPalette: ["#3d1f1a", "#1c0d08"],
    category: "ادبیات کلاسیک",
    progress: 78,
    lastRead: "۲ روز پیش",
  },
];

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "آرمان مهدوی",
    email: "arman.mahdavi@example.com",
    status: "فعال",
    role: "user",
    assignedBookIds: ["b1", "b2", "b3", "b5", "b8"],
  },
  {
    id: "u2",
    name: "نگار حسینی",
    email: "negar.hosseini@example.com",
    status: "فعال",
    role: "user",
    assignedBookIds: ["b3", "b4", "b6"],
  },
  {
    id: "u3",
    name: "کاوه رستمی",
    email: "kaveh.rostami@example.com",
    status: "غیرفعال",
    role: "user",
    assignedBookIds: ["b1"],
  },
  {
    id: "u4",
    name: "شیرین کریمی",
    email: "shirin.karimi@example.com",
    status: "فعال",
    role: "user",
    assignedBookIds: [],
  },
  {
    id: "u5",
    name: "مدیر سیستم",
    email: "admin@maktumbook.ir",
    status: "فعال",
    role: "admin",
    assignedBookIds: mockBooks.map((b) => b.id),
  },
];

// Current signed-in mock user
export const currentUser: User = mockUsers[0];

export function getAssignedBooks(userId: string): Book[] {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return [];
  return mockBooks.filter((b) => user.assignedBookIds.includes(b.id));
}

export function getBookById(id: string): Book | undefined {
  return mockBooks.find((b) => b.id === id);
}
