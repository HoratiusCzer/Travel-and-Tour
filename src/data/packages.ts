export interface ItineraryStop {
  day: string;
  place: string;
  description: string;
}

export interface TourPackage {
  id: string;
  title: string;
  destinationSlug: string;
  days: number;
  price: number;
  groupSize: string;
  perks: string[];
  itinerary: ItineraryStop[];
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
    itinerary: [
      { day: "Day 1", place: "Lucerne", description: "Arrive in Zurich, ride to Lucerne and settle into your lakeside chalet with an evening stroll across the Chapel Bridge." },
      { day: "Day 2", place: "Interlaken", description: "Rail past turquoise lakes to the heart of the Bernese Oberland, with time for a lake cruise." },
      { day: "Days 3–4", place: "Grindelwald", description: "Guided ridge hikes beneath the Eiger, with a panoramic railway day above the clouds." },
      { day: "Day 5", place: "Glacier Express", description: "Board the slow train through Alpine valleys and over high bridges on the way to Zermatt." },
      { day: "Days 6–7", place: "Zermatt", description: "Wake to Matterhorn views, walk car-free lanes and enjoy a farewell fondue before heading home." },
    ],
  },
  {
    id: "lagoon-retreat",
    title: "Lagoon Retreat",
    destinationSlug: "maldives",
    days: 6,
    price: 3190,
    groupSize: "Private couples",
    perks: ["Overwater villa", "Half-board dining", "Snorkel gear"],
    itinerary: [
      { day: "Day 1", place: "Malé", description: "Land in the Maldives and take a scenic seaplane flight to your island." },
      { day: "Day 2", place: "Overwater villa", description: "Settle into your villa, swim from the deck and dine on the water at sunset." },
      { day: "Day 3", place: "House reef", description: "Snorkel straight off the beach among reef fish and turtles with gear provided." },
      { day: "Day 4", place: "Sandbank picnic", description: "A boat takes you to a sandbar for a private picnic in the middle of the lagoon." },
      { day: "Days 5–6", place: "Sunset cruise", description: "Slow down with a spa session and a golden-hour cruise before your seaplane back to Malé." },
    ],
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
    itinerary: [
      { day: "Day 1", place: "Shinjuku", description: "Arrive, check in to your central hotel and wander the neon alleys with a local food guide." },
      { day: "Day 2", place: "Asakusa", description: "Visit Senso-ji at its quietest and browse the old shopfronts of Nakamise street." },
      { day: "Day 3", place: "Shibuya & Harajuku", description: "Cross the famous scramble, then slip into Meiji Shrine for a calm contrast." },
      { day: "Day 4", place: "Tsukiji market", description: "Taste your way through the outer market with a guide who knows every stall." },
      { day: "Day 5", place: "Kyoto day trip", description: "Ride the bullet train to Kyoto for torii gates and lantern-lit lanes, returning by evening." },
      { day: "Days 6–8", place: "Akihabara & Ginza", description: "Arcades, tea houses and one last great dinner before your departure." },
    ],
  },
  {
    id: "northern-lights-loop",
    title: "Northern Lights Loop",
    destinationSlug: "iceland",
    days: 9,
    price: 3350,
    groupSize: "Up to 8 guests",
    perks: ["4x4 transfers", "Spa passes", "Aurora photo coaching"],
    itinerary: [
      { day: "Day 1", place: "Reykjavik", description: "Arrive, soak in the harbour town and meet your guide over a warm Icelandic dinner." },
      { day: "Day 2", place: "Golden Circle", description: "Walk between tectonic plates at Thingvellir and watch Geysir erupt." },
      { day: "Day 3", place: "South coast", description: "Stand behind Seljalandsfoss and feel the spray at Skogafoss by 4x4." },
      { day: "Day 4", place: "Vik", description: "Black sand beaches, basalt columns and cliffs full of puffins in season." },
      { day: "Days 5–6", place: "Glacier lagoon", description: "Float among icebergs at Jokulsarlon and photograph them at dawn." },
      { day: "Days 7–8", place: "Aurora hunt", description: "Chase clear skies at night with photo coaching to capture the northern lights." },
      { day: "Day 9", place: "Blue Lagoon", description: "A final spa soak in milky blue water before your flight home." },
    ],
  },
  {
    id: "taj-sunrise-weekend",
    title: "Taj Sunrise Weekend",
    destinationSlug: "agra",
    days: 3,
    price: 640,
    groupSize: "Up to 14 guests",
    perks: ["Sunrise entry", "Expert historian", "Heritage hotel"],
    itinerary: [
      { day: "Day 1", place: "Agra Fort", description: "Arrive and explore the red sandstone fort with an expert historian." },
      { day: "Day 2", place: "Taj Mahal sunrise", description: "Early entry as the marble turns from pink to gold, before the crowds arrive." },
      { day: "Day 2", place: "Mehtab Bagh", description: "Cross the river for the classic sunset view back towards the Taj." },
      { day: "Day 3", place: "Fatehpur Sikri", description: "Wander the abandoned Mughal capital before your journey onward." },
    ],
  },
  {
    id: "aegean-romance",
    title: "Aegean Romance",
    destinationSlug: "santorini",
    days: 5,
    price: 1890,
    groupSize: "Private couples",
    perks: ["Caldera-view suite", "Sailing day", "Wine tasting"],
    itinerary: [
      { day: "Day 1", place: "Fira", description: "Arrive on the caldera rim and settle into your suite with a view over the sea." },
      { day: "Day 2", place: "Oia", description: "Whitewashed lanes by day and the island’s most famous sunset by evening." },
      { day: "Day 3", place: "Caldera sailing", description: "A full day aboard a sailing boat, with swim stops at hot springs and quiet coves." },
      { day: "Day 4", place: "Vineyard tasting", description: "Taste volcanic-soil wines among low-trained vines with a local grower." },
      { day: "Day 5", place: "Akrotiri", description: "Walk through a Bronze Age town preserved by ash, then head for your flight." },
    ],
  },
];
