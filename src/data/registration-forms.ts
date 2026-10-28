import { events } from "@/data/events";
import type { Field } from "@/lib/registration/fields";

const semesters = Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

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
  technovate: { fields: [] },
  quizstack: { fields: [] },
  nabasrijan: { fields: [] },
};