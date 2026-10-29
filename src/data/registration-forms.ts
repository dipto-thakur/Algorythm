import { events } from "@/data/events";
import type { Field } from "@/lib/registration/fields";

const semesters = Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

/** Leader + second participant. Pass a showIf to make the whole set conditional. */
const pair = (showIf?: Field["showIf"]): Field[] => [
  { name: "leaderName", type: "text", label: "Team leader's name", required: true, prefill: "name", showIf },
  { name: "leaderWhatsapp", type: "tel", label: "Team leader's WhatsApp no.", required: true, prefill: "whatsapp", showIf },
  { name: "leaderContact", type: "tel", label: "Team leader's contact no.", prefill: "calling", showIf },
  { name: "partnerName", type: "text", label: "Second participant's name", required: true, showIf },
  { name: "partnerWhatsapp", type: "tel", label: "Second participant's WhatsApp no.", required: true, showIf },
  { name: "partnerContact", type: "tel", label: "Second participant's contact no.", showIf },
];

export const commonFields: Field[] = [
  { name: "name", type: "text", label: "Name", required: true, autoComplete: "name" },
  { name: "email", type: "email", label: "Email", help: "Optional." },
  { name: "college", type: "text", label: "College name", required: true, max: 120, autoComplete: "organization" },
  { name: "department", type: "text", label: "Department", required: true },
  { name: "semester", type: "radio", label: "Semester", required: true, options: semesters },
  { name: "calling", type: "tel", label: "Calling no.", required: true, autoComplete: "tel-national" },
  { name: "whatsapp", type: "tel", label: "WhatsApp no.", required: true },
  {
    name: "events",
    type: "checkbox",
    label: "Which events are you planning to participate in?",
    help: "Multiple allowed.",
    required: true,
    options: events.map((e) => ({ value: e.slug, label: e.name, hint: e.kind })),
  },
  { name: "query", type: "textarea", label: "Any query related to the events?" },
];

export const eventForms: Record<string, { intro?: string; fields: Field[] }> = {
  codesclash: {
    fields: [
      { name: "teamName", type: "text", label: "Team name", required: true, max: 60 },
      {
        name: "teamSize",
        type: "radio",
        label: "Team size",
        required: true,
        help: "It is suggested to participate with a team, but if you don't have one you can still join solo.",
        options: [1, 2, 3, 4].map((n) => ({ value: String(n), label: String(n) })),
      },
      { name: "leaderName", type: "text", label: "Team leader's name", required: true, prefill: "name" },
      { name: "leaderWhatsapp", type: "tel", label: "Team leader's WhatsApp no.", required: true, prefill: "whatsapp" },
      { name: "leaderContact", type: "tel", label: "Team leader's contact no.", prefill: "calling" },
      {
        name: "interests",
        type: "checkbox",
        label: "Your fields of interest",
        options: ["Frontend", "Backend", "Full-Stack", "AI/ML"].map((v) => ({ value: v, label: v })),
      },
      {
        name: "eventType",
        type: "radio",
        label: "Your preferred event type",
        options: [
          { value: "beginner", label: "Beginner Friendly + AI Restricted" },
          { value: "intermediate", label: "Intermediate Problems + Limited AI" },
          { value: "real", label: "Real Problems + Complete AI Access" },
        ],
      },
      {
        name: "laptop",
        type: "radio",
        label: "Comfortable with carrying your laptops?",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
    ],
  },
  canvaclash: { fields: [] },
  technovate: {
    fields: [
      {
        name: "format",
        type: "radio",
        label: "Team size preference",
        required: true,
        options: [
          { value: "solo", label: "Solo" },
          { value: "duo", label: "Duo" },
        ],
      },
      ...pair({ field: "format", equals: "duo" }),
    ],
  },
  quizstack: {
    intro: "QuizStack is played in pairs. Add both participants' details.",
    fields: pair(),
  },
  nabasrijan: {
    fields: [
      {
        name: "acts",
        type: "checkbox",
        label: "What would you like to present?",
        help: "You can select more than one.",
        required: true,
        layout: "chips",
        options: [
          { value: "singing", label: "Singing" },
          { value: "dancing", label: "Dancing" },
          { value: "poetry", label: "Poetry Recitation" },
          { value: "story", label: "Story Narration" },
          { value: "drawing", label: "Drawing" },
          { value: "instrumental", label: "Instrumental Music" },
          { value: "other", label: "Other" },
        ],
      },
      { name: "actsOther", type: "text", label: "Other (please specify)", required: true, max: 80, showIf: { field: "acts", equals: "other" } },
      {
        name: "group",
        type: "radio",
        label: "Do you want to participate in groups?",
        required: true,
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
        ],
      },
      {
        name: "groupSize",
        type: "radio",
        label: "Number of members",
        help: "Maximum 3.",
        required: true,
        options: [2, 3].map((n) => ({ value: String(n), label: String(n) })),
        showIf: { field: "group", equals: "yes" },
      },
      { name: "leaderName", type: "text", label: "Team leader's name", required: true, prefill: "name", showIf: { field: "group", equals: "yes" } },
      { name: "leaderWhatsapp", type: "tel", label: "Team leader's WhatsApp no.", required: true, prefill: "whatsapp", showIf: { field: "group", equals: "yes" } },
      { name: "leaderContact", type: "tel", label: "Team leader's contact no.", prefill: "calling", showIf: { field: "group", equals: "yes" } },
    ],
  },
};