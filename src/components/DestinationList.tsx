"use client";

import type { Destination } from '@/lib/types';
import DestinationCard from './DestinationCard';

interface DestinationListProps {
  destinations: Destination[];
  onViewItinerary: (destination: Destination) => void;
}

export default function DestinationList({ destinations, onViewItinerary }: DestinationListProps) {
  if (destinations.length === 0) {
    return <p className="text-center text-muted-foreground">No destinations found. Try adjusting your search criteria.</p>;
  }

  // Sort by average flight price in ascending order (cheapest first)
  // The prompt asked for "descending order of flight ticket price" but also "lowest flight ticket prices", 
  // typically users want to see cheapest first. If most expensive first is truly desired, change `a.averageFlightPrice - b.averageFlightPrice` to `b.averageFlightPrice - a.averageFlightPrice`.
  // Based on "lowest flight ticket prices", sorting ascending.
  const sortedDestinations = [...destinations].sort((a, b) => a.averageFlightPrice - b.averageFlightPrice);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedDestinations.map((dest) => (
        <DestinationCard
          key={dest.country}
          destination={dest}
          onViewItinerary={onViewItinerary}
        />
      ))}
    </div>
  );
}
