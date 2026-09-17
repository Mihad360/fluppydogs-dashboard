import type { AppCopy, Brand, ContactSubmission, Game, Post } from "@/types/admin";

export const INIT_BRANDS: Brand[] = [
  {
    id: "playhouse-kids",
    name: "Playhouse Kids",
    logo: "/brands/playhouse-kids.svg",
    accent: "#A855F7",
    accent2: "#FF6B9D",
    bgTint: "#FAF0FF",
  },
  {
    id: "squadies",
    name: "Squadies",
    logo: "/brands/squadies.svg",
    accent: "#0EA5E9",
    accent2: "#FFD600",
    bgTint: "#EFF8FF",
  },
  {
    id: "hugga-bunch",
    name: "Hugga Bunch",
    logo: "/brands/hugga-bunch.svg",
    accent: "#E91E8C",
    accent2: "#00BCD4",
    bgTint: "#FFF0F8",
  },
  {
    id: "news",
    name: "News",
    logo: "/brands/news.svg",
    accent: "#00BCD4",
    accent2: "#FF6B6B",
    bgTint: "#F0FFFE",
  },
];

export const PUNKIES_LOGO = "/brands/app-logo.png";
export const DEFAULT_BRAND_LOGO = "/brands/default.svg";

export const INIT_POSTS: Post[] = [
  {
    id: "p1",
    brandId: "playhouse-kids",
    title: "Meet the Playhouse Kids — Series 2 Revealed!",
    body: "Six brand-new characters join the crew.",
    date: "Aug 17, 2026",
    published: true,
  },
  {
    id: "p2",
    brandId: "squadies",
    title: 'Squadies Episode 4 — "The Toy Store Showdown"',
    body: "Episode 4 of the animated series is LIVE on YouTube!",
    date: "Aug 17, 2026",
    published: true,
  },
  {
    id: "p3",
    brandId: "hugga-bunch",
    title: "Hugga Bunch Plush Drop — Pre-Orders Open Friday",
    body: "Pre-order Friday at 10 AM EST. Ships in 6 weeks.",
    date: "Aug 16, 2026",
    published: true,
  },
  {
    id: "p4",
    brandId: "news",
    title: "Punkies Playhouse Pop-Up Shop — Houston TX 🎉",
    body: "One-day pop-up event on August 30th!",
    date: "Aug 15, 2026",
    published: true,
  },
  {
    id: "p5",
    brandId: "playhouse-kids",
    title: "Playhouse Kids Colouring Book — Free Download",
    body: "20-page printable colouring book, free this week.",
    date: "Aug 14, 2026",
    published: true,
  },
  {
    id: "p6",
    brandId: "squadies",
    title: "Squadies Action Figures — Series 1 Back in Stock",
    body: "Limited restock — strictly while stock lasts.",
    date: "Aug 13, 2026",
    published: false,
  },
];

export const INIT_SUBMISSIONS: ContactSubmission[] = [
  {
    id: "s1",
    name: "Sarah K.",
    email: "sarah.k@example.com",
    message:
      "Hi! When does the hugga bunch plush drop ship? I would love to get one for my niece.",
    date: "Aug 17, 2026",
    unread: true,
    color: "#A855F7",
  },
  {
    id: "s2",
    name: "David M.",
    email: "davidm@example.com",
    message: "Love the Squadies! Can I get a signed poster?",
    date: "Aug 17, 2026",
    unread: true,
    color: "#0EA5E9",
  },
  {
    id: "s3",
    name: "Priya L.",
    email: "priya_l@example.com",
    message: "My order arrived damaged, please help. I can provide pictures.",
    date: "Aug 16, 2026",
    unread: false,
    color: "#E91E8C",
  },
  {
    id: "s4",
    name: "Jordan T.",
    email: "jordan.t@example.com",
    message: "Is the Houston pop-up free for kids?",
    date: "Aug 15, 2026",
    unread: false,
    color: "#00BCD4",
  },
  {
    id: "s5",
    name: "Alex R.",
    email: "alex.r99@example.com",
    message:
      "Got my order! The colours are amazing. Thank you for the quick reply!",
    date: "Aug 14, 2026",
    unread: false,
    color: "#FF6B6B",
  },
];

export const INIT_GAMES: Game[] = [
  {
    id: "g1",
    name: "Squadies Rescue Mission",
    emoji: "🦸",
    url: "https://example.com/games/squadies-rescue",
  },
  {
    id: "g2",
    name: "Hugga Bunch Hug Dash",
    emoji: "🤗",
    url: "https://example.com/games/hugga-dash",
  },
  {
    id: "g3",
    name: "Playhouse Kids Dress Up",
    emoji: "👗",
    url: "https://example.com/games/dress-up",
  },
];

export const INIT_APP_COPY: AppCopy = {
  privacy: `Last updated: August 17, 2026

Punkies Playhouse LLC ("we", "us", or "our") operates the Punkies Playhouse Alerts mobile application. This page informs you of our policies regarding the collection, use and disclosure of personal data when you use our Service.

We do not collect personally identifiable information. The app is a one-way broadcast service. Push notifications are delivered via your device's operating system.`,
  terms: `By downloading or using the Punkies Playhouse Alerts app, you agree to these terms. The app is a read-only broadcast service. We reserve the right to update or modify these terms at any time.

All content, logos, and characters are the intellectual property of Punkies Playhouse LLC. Unauthorized reproduction is prohibited.`,
  about: `Punkies Playhouse Alerts is the official notification app for Punkies Playhouse LLC.

Stay up to date with new product drops, events, games, and announcements from Playhouse Kids, Squadies, Hugga Bunch, and more.

Built with ❤️ by DEFai.`,
};

export function formatAdminDate(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
