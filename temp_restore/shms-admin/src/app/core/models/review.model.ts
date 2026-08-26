// Rating & Review TypeScript interfaces

export interface Rating {
  name: string;     // Provider name
  rating: number;   // e.g. 4.8
  count: number;    // Total reviews count
}

export interface Review {
  customer: string;
  provider: string;
  stars: number;    // 1–5
  text: string;
}
