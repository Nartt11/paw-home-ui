import { Pet } from "./pet.type";

export interface HeroContent {
  emergencyCases: number;
  titleHighlight: string;
  description: string;
  searchPlaceholder: string;
}

export interface StatItemConfig {
  value: number;
  suffix?: string;
  label: string;
  color: string;
}

export interface HowItWorksStep {
  step: string;
  icon: string;
  title: string;
  desc: string;
  color: string;
}

export interface RescueMapStat {
  val: string;
  label: string;
  color: string;
}

export interface StoryItem {
  name: string;
  img: string;
  text: string;
  stars: number;
  loc: string;
}

export interface EventItem {
  date: string;
  month: string;
  name: string;
  location: string;
  desc: string;
  img: string;
}

export interface PublicPet {
  id: string;
  name: string;
  image: string;
  vaccinated?: boolean;
  sterilized?: boolean;
  type: "dog" | "cat" | string;
  gender: "male" | "female" | string;
  age: string;
  status: "available" | string;
  location: string;
  weight: string;
  color: string;
  featured?: boolean;
}

export interface PublicPageData {
  hero: HeroContent;
  stats: StatItemConfig[];
  howItWorksSteps: HowItWorksStep[];
  rescueMapStats: RescueMapStat[];
  stories: StoryItem[];
  events: EventItem[];
  pets: Pet[];
}
