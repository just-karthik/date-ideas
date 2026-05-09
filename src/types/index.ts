export interface DateIdea {
  id: string;
  activity: string;
  emoji: string;
  description: string;
  category: string;
  subcategory: string;
  location: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  pricing: string;
  timings: string;
  booking_link: string;
  google_maps_link: string;
  instagram: string;
  tags: string[];
  is_popular: boolean;
  is_new: boolean;
}

export type TabType = 'home' | 'saved' | 'plan';
