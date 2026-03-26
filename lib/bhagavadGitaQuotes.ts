/** Short English renderings for sidebar reflection; chapter.verse for attribution. */
export type GitaQuote = {
  text: string;
  ref: string;
};

export const BHAGAVAD_GITA_QUOTES: GitaQuote[] = [
  {
    text: "You have the right to act, but not to the fruits of action. Never consider yourself the cause of results, and stay unattached to inaction.",
    ref: "Bhagavad Gita 2.47",
  },
  {
    text: "Heat and cold, pleasure and pain, gain and loss come and go—they are fleeting. Endure them calmly, one who seeks steadiness.",
    ref: "Bhagavad Gita 2.14",
  },
  {
    text: "Lift yourself by yourself; do not let yourself sink. For the self is its own ally, and the self is its own enemy.",
    ref: "Bhagavad Gita 6.5",
  },
  {
    text: "The imperishable is not born when the body is born, nor does it die when the body dies.",
    ref: "Bhagavad Gita 2.20",
  },
  {
    text: "Perform action, fixed in yoga, with an even mind in success and failure. Evenness of mind is called yoga.",
    ref: "Bhagavad Gita 2.48",
  },
  {
    text: "One who acts, offering actions to the Supreme, abandoning attachment, is not stained by sin, as a lotus leaf is untouched by water.",
    ref: "Bhagavad Gita 5.10",
  },
  {
    text: "When meditation is mastered, the mind becomes still, like a lamp in a windless place.",
    ref: "Bhagavad Gita 6.19",
  },
  {
    text: "Better is one’s own duty, though imperfect, than another’s duty well performed. Doing work natural to oneself, one incurs no stain.",
    ref: "Bhagavad Gita 18.47",
  },
  {
    text: "From whatever cause the restless, unsteady mind wanders away, from there one should restrain it and bring it back under the self’s control.",
    ref: "Bhagavad Gita 6.26",
  },
  {
    text: "He who is the same to friend and foe, and in honor and dishonor, who is the same in heat and cold, in pleasure and pain—he is dear to Me.",
    ref: "Bhagavad Gita 12.18",
  },
  {
    text: "Whatever you do, whatever you eat, whatever you offer or give away, whatever austerity you practice—do that as an offering.",
    ref: "Bhagavad Gita 9.27",
  },
  {
    text: "There is no loss in this path, and no decline. Even a little of this dharma protects one from great fear.",
    ref: "Bhagavad Gita 2.40",
  },
];

export function gitaQuoteForDay(quotes: GitaQuote[], now = Date.now()): GitaQuote {
  const day = Math.floor(now / 86_400_000);
  return quotes[day % quotes.length]!;
}
