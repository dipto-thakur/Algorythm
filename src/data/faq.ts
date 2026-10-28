import type { FaqItem } from "@/types/site";

// Answers were not part of the design export; `null` renders a neutral placeholder.
export const faq: FaqItem[] = [
  { id: "fee", question: "Is there any entry fee?", answer: null },
  { id: "signup", question: "Okay, you've convinced me. How do I sign up?", answer: null },
];
