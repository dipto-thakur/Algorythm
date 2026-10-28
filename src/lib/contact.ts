export const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

export const waHref = (n: string, msg?: string | null) =>
  `https://wa.me/${n.replace(/\D/g, "")}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;