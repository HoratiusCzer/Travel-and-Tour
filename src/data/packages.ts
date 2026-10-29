export interface TourPackage {
  id: string;
  title: string;
  destinationSlug: string;
  days: number;
  price: number;
  groupSize: string;
  perks: string[];
  popular?: boolean;
}

export const packages: TourPackage[] = [
  {
    id: "alpine-escape",
    title: "Alpine Escape",
    destinationSlug: "swiss-alps",
    days: 7,
    price: 2450,
    groupSize: "Up to 12 guests",
    perks: ["Boutique chalet stays", "Rail pass included", "Daily breakfast"],
  },
  {
    id: "lagoon-retreat",
    title: "Lagoon Retreat",
    destinationSlug: "maldives",
    days: 6,
    price: 3190,
    groupSize: "Private couples",
    perks: ["Overwater villa", "Half-board dining", "Snorkel gear"],
    popular: true,
  },
  {
    id: "neon-and-temples",
    title: "Neon & Temples",
    destinationSlug: "tokyo",
    days: 8,
    price: 2780,
    groupSize: "Up to 10 guests",
    perks: ["Local food guide", "Bullet train day trip", "Central hotel"],
  },
  {
    id: "northern-lights-loop",
    title: "Northern Lights Loop",
    destinationSlug: "iceland",
    days: 9,
    price: 3350,
    groupSize: "Up to 8 guests",
    perks: ["4x4 transfers", "Spa passes", "Aurora photo coaching"],
  },
  {
    id: "taj-sunrise-weekend",
    title: "Taj Sunrise Weekend",
    destinationSlug: "agra",
    days: 3,
    price: 640,
    groupSize: "Up to 14 guests",
    perks: ["Sunrise entry", "Expert historian", "Heritage hotel"],
  },
  {
    id: "aegean-romance",
    title: "Aegean Romance",
    destinationSlug: "santorini",
    days: 5,
    price: 1890,
    groupSize: "Private couples",
    perks: ["Caldera-view suite", "Sailing day", "Wine tasting"],
  },
];
