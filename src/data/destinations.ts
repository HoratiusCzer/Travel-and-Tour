export type Category = "Mountains" | "Beaches" | "Cities" | "Culture";

export interface Destination {
  slug: string;
  name: string;
  country: string;
  category: Category;
  image: string;
  tagline: string;
  description: string;
  bestSeason: string;
  idealStay: string;
  rating: number;
  highlights: string[];
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=75`;

export const categories: Category[] = ["Mountains", "Beaches", "Cities", "Culture"];

export const destinations: Destination[] = [
  {
    slug: "swiss-alps",
    name: "Swiss Alps",
    country: "Switzerland",
    category: "Mountains",
    image: img("1506905925346-21bda4d32df4"),
    tagline: "Glacier trains, alpine meadows and cheese-scented chalets.",
    description:
      "Ride panoramic railways above the clouds, hike between wildflower pastures and end each day beside a crackling fire. The Alps reward slow travellers with big views and quiet villages.",
    bestSeason: "June – September",
    idealStay: "6–8 days",
    rating: 4.9,
    highlights: ["Scenic glacier rail line", "Lakeside village stays", "Guided ridge hikes"],
  },
  {
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    category: "Beaches",
    image: img("1507525428034-b723cf961d3e"),
    tagline: "Turquoise lagoons and overwater villas for a true reset.",
    description:
      "Wake up above a glassy lagoon, snorkel with reef turtles before breakfast and watch the sky turn tangerine from a private deck. Pure, unhurried island time.",
    bestSeason: "November – April",
    idealStay: "5–7 days",
    rating: 4.8,
    highlights: ["Overwater villa stay", "House-reef snorkelling", "Sunset dhoni cruise"],
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    category: "Cities",
    image: img("1502602898657-3e91760cbb34"),
    tagline: "Boulevards, bakeries and museums worth getting lost in.",
    description:
      "Trace the Seine at golden hour, linger in neighbourhood cafés and spend an afternoon among masterpieces. Paris is best explored on foot with no fixed plan.",
    bestSeason: "April – June, September",
    idealStay: "4–5 days",
    rating: 4.7,
    highlights: ["Private museum hour", "Montmartre food walk", "Seine evening cruise"],
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    country: "Japan",
    category: "Cities",
    image: img("1480796927426-f609979314bd"),
    tagline: "Neon alleys, ramen counters and temple gardens, side by side.",
    description:
      "A city of delightful contrasts: serene shrines tucked behind skyscrapers, tiny bars hidden up stairwells and some of the most punctual trains on Earth. Come hungry.",
    bestSeason: "March – May, October – November",
    idealStay: "6–9 days",
    rating: 4.9,
    highlights: ["Market-to-table food crawl", "Shrine and garden mornings", "Day trip to Hakone"],
  },
  {
    slug: "iceland",
    name: "Iceland",
    country: "Iceland",
    category: "Mountains",
    image: img("1531366936337-7c912a4589a7"),
    tagline: "Aurora skies, black-sand beaches and steaming hot springs.",
    description:
      "Drive a ring road of waterfalls, lava fields and glacier lagoons, then soak in geothermal water under a sky full of northern lights.",
    bestSeason: "September – March for aurora",
    idealStay: "7–10 days",
    rating: 4.8,
    highlights: ["Northern lights hunt", "Glacier lagoon boat", "Geothermal spa evenings"],
  },
  {
    slug: "agra",
    name: "Agra",
    country: "India",
    category: "Culture",
    image: img("1548013146-72479768bada"),
    tagline: "Marble, sunrise and a monument to love.",
    description:
      "See the Taj Mahal glow pink at dawn, wander the ramparts of Agra Fort and taste Mughal-era recipes still cooked the old way in the bazaar lanes.",
    bestSeason: "October – March",
    idealStay: "2–3 days",
    rating: 4.6,
    highlights: ["Sunrise at the Taj", "Fort and bazaar walk", "Mughal cooking class"],
  },
  {
    slug: "venice",
    name: "Venice",
    country: "Italy",
    category: "Culture",
    image: img("1523906834658-6e24ef2386f9"),
    tagline: "A city built on water, best seen at first light.",
    description:
      "Slip down quiet canals before the crowds wake, sip a spritz in a hidden campo and island-hop to glass-blowing studios and rainbow-painted lace villages.",
    bestSeason: "April – June, September – October",
    idealStay: "3–4 days",
    rating: 4.7,
    highlights: ["Dawn gondola ride", "Murano and Burano trip", "Cicchetti bar crawl"],
  },
  {
    slug: "santorini",
    name: "Santorini",
    country: "Greece",
    category: "Beaches",
    image: img("1533105079780-92b9be482077"),
    tagline: "Whitewashed cliffs above a deep blue caldera.",
    description:
      "Stay on the clifftop, swim from volcanic beaches and toast the famous sunset with local Assyrtiko. Santorini is romance with a sea view.",
    bestSeason: "May – October",
    idealStay: "4–6 days",
    rating: 4.7,
    highlights: ["Caldera sailing trip", "Cliffside sunset dinner", "Winery tasting tour"],
  },
  {
    slug: "cinque-terre",
    name: "Cinque Terre",
    country: "Italy",
    category: "Culture",
    image: img("1516483638261-f4dbaf036963"),
    tagline: "Five pastel villages hugging a rugged coast.",
    description:
      "Hike the coastal footpaths from village to village, swim off the rocks and finish with fresh anchovies and a glass of crisp white wine.",
    bestSeason: "May – June, September",
    idealStay: "3–4 days",
    rating: 4.6,
    highlights: ["Village-to-village trail", "Seafood by the harbour", "Sunset boat tour"],
  },
];

export function getDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}
