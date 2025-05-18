// Re-exporting from AI flows directly is preferred, but if common structures are needed:

export interface DetailedExpenses {
  food?: number;
  stay?: number;
  sightseeing?: number;
  shopping?: number;
  transport?: number;
}

export interface Destination {
  country: string;
  averageFlightPrice: number;
  estimatedExpenses: number;
  visaRequirements: string;
  itinerary: string; // This is the basic itinerary from suggestDestinations
  detailedExpenses?: DetailedExpenses;
  isPremiumOption?: boolean;
}

export interface SuggestedDestinationsOutput {
  destinations: Destination[];
  disclaimer?: string;
}

// Input type for suggestDestinations AI flow
export interface SuggestDestinationsFormInput {
  travelDates: string; // YYYY-MM-DD to YYYY-MM-DD
  nationality: string;
  budget: number;
  numberOfTravelers: number;
}
