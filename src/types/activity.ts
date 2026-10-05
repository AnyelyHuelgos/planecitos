export type Age = 2 | 3 | 4 | 5;
export type Duration = 5 | 15 | 30;
export type Category = "crear" | "moverse" | "aprender" | "tranquilo" | "juntos" | "solo";
export type Location = "casa" | "afuera" | "cualquier";
export type Material = "papel" | "colores" | "carton" | "plastilina" | "cinta" | "nada";

export interface Activity {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  minAge: Age;
  maxAge: Age;
  duration: Duration;
  category: Category;
  location: Location;
  materials: string[];
  materialTags: Material[];
  adultHelp: boolean;
  preparation: string;
  steps: string[];
  tip: string;
  premium: boolean;
  image: string | null;
}

export interface SelectorFilters {
  age?: Age;
  duration?: Duration;
  category?: Category;
  materials?: Material[];
}

export interface ChildProfile {
  name: string;
  age: Age;
}

export interface UserAccount {
  name: string;
  email: string;
  premium: boolean;
}
