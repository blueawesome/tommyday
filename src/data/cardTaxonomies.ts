export type CardOccasion =
  | "birthday"
  | "thank-you"
  | "friendship"
  | "thinking-of-you"
  | "congratulations"
  | "encouragement"
  | "love"
  | "anniversary"
  | "sympathy"
  | "get-well"
  | "new-home"
  | "holiday"
  | "christmas"
  | "halloween"
  | "valentine"
  | "mothers-day"
  | "fathers-day"
  | "graduation"
  | "blank"
  | "just-because"
  | "party-host";

export type CardTone =
  | "weird"
  | "funny"
  | "sweet"
  | "absurd"
  | "gentle"
  | "dark"
  | "romantic"
  | "deadpan"
  | "unhinged"
  | "sincere-ish";

export type CardSeason =
  | "evergreen"
  | "spring"
  | "summer"
  | "fall"
  | "winter"
  | "holiday";

export type CardProductLine = "tommy-day-art" | "collage-goblin";

export type CardTaxonomyTerm = {
  slug: string;
  label: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  heroEyebrow?: string;
  heroHeading?: string;
  heroCopy?: string;
  sortOrder?: number;
};

export const cardOccasions = {
  birthday: {
    slug: "birthday",
    label: "Birthday",
    heroHeading: "Weird birthday cards for people who deserve better mail.",
    heroCopy:
      "Hand-cut analog collage cards for birthdays, belated birthdays, and people who are hard to shop for.",
    seoTitle: "Weird Birthday Cards | Tommy Day Art",
    seoDescription:
      "Shop weird, funny, hand-cut analog collage birthday cards printed from original collage artwork.",
    sortOrder: 10,
  },
  "thank-you": {
    slug: "thank-you",
    label: "Thank You",
    heroHeading: "Strange little thank-you cards.",
    heroCopy:
      "Cards for saying thanks without sounding like a beige candle.",
    seoTitle: "Funny Thank You Cards | Tommy Day Art",
    seoDescription:
      "Shop funny, strange thank-you cards made from Tommy Day's analog collage artwork.",
    sortOrder: 20,
  },
  friendship: {
    slug: "friendship",
    label: "Friendship",
    heroHeading: "Cards for strange friends and treasured weirdos.",
    heroCopy:
      "Friendship cards, just-because cards, and small paper transmissions for people who get it.",
    seoTitle: "Weird Friendship Cards | Tommy Day Art",
    seoDescription:
      "Shop weird friendship cards and just-because cards printed from original analog collage art.",
    sortOrder: 30,
  },
  "thinking-of-you": {
    slug: "thinking-of-you",
    label: "Thinking of You",
    heroHeading: "Thinking-of-you cards with a little static in the signal.",
    heroCopy:
      "Send a small paper flare to someone you miss, appreciate, or cannot quite explain.",
    seoTitle: "Thinking of You Cards | Tommy Day Art",
    seoDescription:
      "Shop strange and tender thinking-of-you greeting cards by Tommy Day.",
    sortOrder: 40,
  },
  congratulations: {
    slug: "congratulations",
    label: "Congratulations",
    heroHeading: "Congratulations cards for odd little victories.",
    heroCopy:
      "Cards for good news, improbable wins, and people who made it through something.",
    seoTitle: "Congratulations Cards | Tommy Day Art",
    seoDescription:
      "Shop offbeat congratulations cards made from hand-cut analog collage artwork.",
    sortOrder: 50,
  },
  encouragement: {
    slug: "encouragement",
    label: "Encouragement",
    heroHeading: "Encouragement cards for people doing their best.",
    heroCopy:
      "Small paper signals for hard weeks, fresh starts, and people who could use a strange little boost.",
    sortOrder: 55,
  },
  blank: {
    slug: "blank",
    label: "Blank",
    heroHeading: "Blank art cards for whatever needs saying.",
    heroCopy:
      "Useful for birthdays, thank-yous, notes, apologies, invitations, and correspondence emergencies.",
    seoTitle: "Blank Art Cards | Tommy Day Art",
    seoDescription:
      "Shop blank-inside art greeting cards printed from original analog collage artwork.",
    sortOrder: 60,
  },
  "just-because": {
    slug: "just-because",
    label: "Just Because",
    sortOrder: 70,
  },
  "party-host": {
    slug: "party-host",
    label: "Party / Host",
    sortOrder: 80,
  },
} satisfies Partial<Record<CardOccasion, CardTaxonomyTerm>>;

export const cardTones = {
  weird: { slug: "weird", label: "Weird", sortOrder: 10 },
  funny: { slug: "funny", label: "Funny", sortOrder: 20 },
  absurd: { slug: "absurd", label: "Absurd", sortOrder: 30 },
  deadpan: { slug: "deadpan", label: "Deadpan", sortOrder: 40 },
  gentle: { slug: "gentle", label: "Gentle", sortOrder: 50 },
  "sincere-ish": { slug: "sincere-ish", label: "Sincere-ish", sortOrder: 60 },
} satisfies Partial<Record<CardTone, CardTaxonomyTerm>>;

export const coreOccasionSlugs = [
  "birthday",
  "thank-you",
  "friendship",
  "thinking-of-you",
  "congratulations",
  "encouragement",
  "blank",
  "just-because",
  "party-host",
] as const satisfies CardOccasion[];

export function getSortedCardOccasions() {
  return Object.values(cardOccasions).sort(
    (a, b) => (a.sortOrder || 999) - (b.sortOrder || 999)
  );
}

export function getSortedCardTones() {
  return Object.values(cardTones).sort(
    (a, b) => (a.sortOrder || 999) - (b.sortOrder || 999)
  );
}
