export interface Testimonial {
  /** Stable identifier. Doubles as the React key and as a permalink-ready
   *  handle if testimonials ever get their own route or CMS sync. Once it
   *  ships, never rename one — it is referenced from analytics and any future
   *  persisted record. Use lowercase kebab-case of the person's name. */
  slug: string;
  /** Display name of the person giving the quote. */
  name: string;
  /** Their role/title, e.g. "Founder" or "Head of Product". */
  role: string;
  /** Their company. Omit for solo founders or people who prefer no attribution. */
  company?: string;
  /** The quote itself. Keep it verbatim — paraphrased testimonials read as
   *  fabricated, which costs more trust than an imperfect quote earns. */
  quote: string;
  /** Optional portrait path in /public. Leave it out when there is no photo —
   *  the card falls back to a tinted monogram. Assigning an unrelated stock
   *  portrait is worse than showing no face at all. */
  image?: string;
}

/*
 * Real client testimonials. Add entries below; the section renders nothing and
 * the footer's Testimonials link hides itself while this array is empty, so an
 * empty list never ships a bare heading to production.
 *
 * Placeholder portraits in /public/images/ (generic person glyphs, safe to use
 * until real photos exist): julia.svg, andrij.svg, marta.svg, filip.svg,
 * oksana.svg, roman.svg.
 */
export const testimonials: Testimonial[] = [
  {
    slug: "harshit-yadav",
    name: "Harshit Yadav",
    role: "Co-Founder",
    company: "Kikout",
    quote:
      "Skédio did an excellent job designing the logo for Kikout. They understood our vision and translated it into a bold, distinctive, and memorable identity. The process was smooth, collaborative, and professional, and we’re really happy with the final result.",
  },
  {
    slug: "charliie-mayers",
    name: "Charliie Mayers",
    role: "Fiverr Client",
    quote:
      "Working with Aakash was a great experience. The team communicated clearly, kept us updated throughout the process, and was always open to feedback and collaboration. They took the time to understand our requirements and research the subject thoroughly before developing the design. The final result exceeded our expectations, and the entire process was smooth, professional, and well-managed.",
  },
  {
    slug: "kisan-jaswandiya",
    name: "Kisan Jaswandiya",
    role: "Founder",
    company: "Edios Video Production Studio",
    quote:
      "Working with Skédio on our logo was a great experience. We had a clear concept in mind around the red recording dot, along with the idea of incorporating a play button to represent video production. Skédio understood our vision and translated these ideas into a clean, bold, and meaningful logo using the right combination of red and black.",
  },
];

export function getTestimonialBySlug(slug: string): Testimonial | undefined {
  return testimonials.find((t) => t.slug === slug);
}
