
"use client";

import type { Destination } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plane, CreditCard, ListChecks, CheckSquare, XSquare, Ticket, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface DestinationCardProps {
  destination: Destination;
  onViewItinerary: (destination: Destination) => void;
  onSelectForMultiCountry?: (destination: Destination, selected: boolean) => void;
  isSelectedForMultiCountry?: boolean;
  isMultiCountryMode?: boolean;
  travelDates?: string; // Expected format: "YYYY-MM-DD to YYYY-MM-DD"
}

export default function DestinationCard({
  destination,
  onViewItinerary,
  onSelectForMultiCountry,
  isSelectedForMultiCountry,
  isMultiCountryMode = false,
  travelDates,
}: DestinationCardProps) {
  const visaSeemsRequired = destination.visaRequirements.toLowerCase().includes('required') || 
                           !destination.visaRequirements.toLowerCase().includes('not required');

  const getGoogleFlightsUrl = () => {
    let url = `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(destination.country)}`;
    if (travelDates) {
      const dates = travelDates.split(' to ');
      if (dates.length === 2) {
        const departureDate = dates[0];
        const returnDate = dates[1];
        // Google Flights uses d=YYYY-MM-DD/YYYY-MM-DD for round trips in its URL structure
        // Or for one way, d=YYYY-MM-DD
        // For simplicity, we'll add to the query parameter.
        // A more specific way: &d=${departureDate}/${returnDate}
        // However, adding to q is more general:
        url += `%20${departureDate}%20-%20${returnDate}`;
      }
    }
    return url;
  };
  
  const googleFlightsUrl = getGoogleFlightsUrl();

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative w-full h-48">
        <Image
          src={`https://placehold.co/600x400.png?text=${encodeURIComponent(destination.country)}`}
          alt={`Image of ${destination.country}`}
          layout="fill"
          objectFit="cover"
          data-ai-hint="travel landmark"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.country)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
            title={`View ${destination.country} on Google Maps`}
          >
            <MapPin className="h-6 w-6" />
            {destination.country}
          </a>
        </CardTitle>
        <CardDescription className="text-sm">
          Explore the wonders of {destination.country}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm flex-grow">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-muted-foreground"><Plane className="h-4 w-4" /> Avg. Flight:</span>
          <Badge variant="secondary">${destination.averageFlightPrice.toLocaleString()}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-muted-foreground"><CreditCard className="h-4 w-4" /> Est. Expenses:</span>
          <Badge variant="secondary">${destination.estimatedExpenses.toLocaleString()}</Badge>
        </div>
        <div className="flex items-start gap-1">
          {visaSeemsRequired ? <XSquare className="h-4 w-4 mt-0.5 text-destructive shrink-0" /> : <CheckSquare className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />}
          <span className="text-muted-foreground">Visa:</span>
          <p className="ml-1 flex-1">{destination.visaRequirements}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4 items-stretch">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => onViewItinerary(destination)} variant="outline" className="flex-1">
            <ListChecks className="mr-2 h-4 w-4" />
            View Itinerary
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <a href={googleFlightsUrl} target="_blank" rel="noopener noreferrer">
              <Ticket className="mr-2 h-4 w-4" />
              Book Flights
            </a>
          </Button>
        </div>
        {isMultiCountryMode && onSelectForMultiCountry && (
          <Button
            onClick={() => onSelectForMultiCountry(destination, !isSelectedForMultiCountry)}
            variant={isSelectedForMultiCountry ? "default" : "secondary"}
            className="w-full"
          >
            {isSelectedForMultiCountry ? <CheckSquare className="mr-2 h-4 w-4" /> : <XSquare className="mr-2 h-4 w-4" />}
            {isSelectedForMultiCountry ? 'Selected' : 'Select'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
