export type Category = "scienza" | "arte" | "natura" | "musei";

export const CATEGORY_LABELS: Record<Category, string> = {
  scienza: "Scienza e tecnologia",
  arte: "Arte e creatività",
  natura: "Natura e avventura",
  musei: "Musei e cultura",
};

export const CATEGORY_SLUGS = Object.keys(CATEGORY_LABELS) as Category[];
