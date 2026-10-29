export interface Testimonial {
  name: string;
  trip: string;
  quote: string;
  initials: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Maya Fernandez",
    trip: "Alpine Escape",
    quote:
      "Every detail was handled, yet it never felt scripted. Our guide knew a ridge trail that no guidebook mentions, and it was the best day of the trip.",
    initials: "MF",
  },
  {
    name: "Daniel Okoye",
    trip: "Neon & Temples",
    quote:
      "I came for the food and left with a notebook full of tiny bars and hidden shrines. Tokyo felt friendly instead of overwhelming.",
    initials: "DO",
  },
  {
    name: "Sofia & Liam",
    trip: "Lagoon Retreat",
    quote:
      "Our honeymoon was calm, beautiful and wonderfully organised. The team even surprised us with a private sunset dinner on the sand.",
    initials: "SL",
  },
];
