
"use client";

import type { Destination } from '@/lib/types';
import DestinationCard from './DestinationCard';

interface DestinationListProps {
  destinations: Destination[];
  onViewItinerary: (destination: Destination) => void;
  travelDates?: string; // "YYYY-MM-DD to YYYY-MM-DD"
}

export default function DestinationList({ destinations, onViewItinerary, travelDates }: DestinationListProps) {
  if (destinations.length === 0) {
    return <p className="text-center text-muted-foreground">No destinations found. Try adjusting your search criteria.</p>;
  }

  // Sort by average flight price in ascending order (cheapest first)
  const sortedDestinations = [...destinations].sort((a, b) => a.averageFlightPrice - b.averageFlightPrice);


  return (
    <div className="space-y-8"> {/* Changed from grid to space-y for single column layout */}
      {sortedDestinations.map((dest) => (
        <DestinationCard
          key={dest.country}
          destination={dest}
          onViewItinerary={onViewItinerary}
          travelDates={travelDates}
        />
      ))}
    </div>
  );
}
