
"use client";

import type { Destination } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { MapPin, Plane, CreditCard, ListChecks, CheckSquare, XSquare, Ticket, Info, Utensils, BedDouble, Camera, ShoppingBag, CarFront, Star, PiggyBank } from 'lucide-react';
import Image from 'next/image';

interface DestinationCardProps {
  destination: Destination;
  onViewItinerary: (destination: Destination) => void;
  onSelectForMultiCountry?: (destination: Destination, selected: boolean) => void;
  isSelectedForMultiCountry?: boolean;
  isMultiCountryMode?: boolean;
  travelDates?: string; 
  numberOfTravelers?: number;
}

export default function DestinationCard({
  destination,
  onViewItinerary,
  onSelectForMultiCountry,
  isSelectedForMultiCountry,
  isMultiCountryMode = false,
  travelDates,
  numberOfTravelers,
}: DestinationCardProps) {
  const visaSeemsRequired = destination.visaRequirements.toLowerCase().includes('required') || 
                           !destination.visaRequirements.toLowerCase().includes('not required');

  const getGoogleFlightsUrl = () => {
    const baseUrl = 'https://www.google.com/travel/flights';
    let searchQuery = `flights to ${destination.country}`;

    if (travelDates) {
      const dates = travelDates.split(' to ');
      if (dates.length === 2) {
        const departureDate = dates[0]; // Should be YYYY-MM-DD
        const returnDate = dates[1];   // Should be YYYY-MM-DD
        if (departureDate && returnDate) {
            searchQuery += ` from ${departureDate} to ${returnDate}`;
        }
      }
    }

    if (numberOfTravelers && numberOfTravelers > 0) {
      searchQuery += ` for ${numberOfTravelers} adult${numberOfTravelers > 1 ? 's' : ''}`;
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('q', searchQuery);
    
    queryParams.append('hl', 'en');
    queryParams.append('curr', 'USD');

    return `${baseUrl}?${queryParams.toString()}`;
  };
  
  const googleFlightsUrl = getGoogleFlightsUrl();

  const hasDetailedExpenses = destination.detailedExpenses && Object.values(destination.detailedExpenses).some(val => val !== undefined && val > 0);

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row h-full w-full">
      <div className="relative w-full md:w-1/3 h-64 md:h-auto">
        <Image
          src={`https://placehold.co/600x400.png?text=${encodeURIComponent(destination.country)}`}
          alt={`Image of ${destination.country}`}
          layout="fill"
          objectFit="cover"
          data-ai-hint={`travel landmark ${destination.country.toLowerCase()}`}
        />
         {destination.isPremiumOption && (
          <Badge variant="default" className="absolute top-2 right-2 text-sm px-3 py-1 flex items-center gap-1 z-10 bg-primary text-primary-foreground border-primary/80">
            <Star className="h-4 w-4" /> Premium
          </Badge>
        )}
      </div>
      <div className="w-full md:w-2/3 flex flex-col">
        <CardHeader className="pb-3">
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
          <CardDescription className="text-sm pt-1">
            Explore the wonders of {destination.country}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm flex-grow pt-0">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-muted-foreground"><Plane className="h-4 w-4" /> Avg. Flight:</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg font-semibold px-3 py-1">
                ${destination.averageFlightPrice.toLocaleString()}
              </Badge>
              <Button asChild variant="outline" size="sm" className="h-auto px-2 py-1 text-xs">
                <a href={googleFlightsUrl} target="_blank" rel="noopener noreferrer">
                  <Ticket className="mr-1 h-3 w-3" /> Book
                </a>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t mt-2 pt-3">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-6 w-6 text-primary" />
              <span className="text-muted-foreground font-medium">Total Est. Expenses:</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              ${destination.estimatedExpenses.toLocaleString()}
            </span>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="link" className="flex items-center justify-start w-full p-0 text-xs text-muted-foreground hover:text-primary h-auto disabled:opacity-100 disabled:cursor-default" disabled={!hasDetailedExpenses}>
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> View Expense Breakdown
                  {hasDetailedExpenses && <Info className="ml-1 h-3 w-3" />}
                </span>
              </Button>
            </PopoverTrigger>
            {hasDetailedExpenses && destination.detailedExpenses && (
              <PopoverContent className="w-80 z-50">
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <h4 className="font-medium leading-none text-base">Expense Breakdown</h4>
                    <p className="text-xs text-muted-foreground">
                      Overall Est. (from AI): ${destination.estimatedExpenses.toLocaleString()} (USD)
                    </p>
                  </div>
                  <div className="grid gap-2 text-xs">
                    {destination.detailedExpenses.food !== undefined && destination.detailedExpenses.food > 0 && (
                      <div className="grid grid-cols-2 items-center gap-2">
                        <span className="flex items-center"><Utensils className="mr-2 h-4 w-4 text-muted-foreground" /> Food:</span>
                        <span className="text-right font-semibold">${destination.detailedExpenses.food.toLocaleString()}</span>
                      </div>
                    )}
                    {destination.detailedExpenses.stay !== undefined && destination.detailedExpenses.stay > 0 && (
                      <div className="grid grid-cols-2 items-center gap-2">
                        <span className="flex items-center"><BedDouble className="mr-2 h-4 w-4 text-muted-foreground" /> Stay:</span>
                        <span className="text-right font-semibold">${destination.detailedExpenses.stay.toLocaleString()}</span>
                      </div>
                    )}
                    {destination.detailedExpenses.sightseeing !== undefined && destination.detailedExpenses.sightseeing > 0 && (
                      <div className="grid grid-cols-2 items-center gap-2">
                        <span className="flex items-center"><Camera className="mr-2 h-4 w-4 text-muted-foreground" /> Sightseeing:</span>
                        <span className="text-right font-semibold">${destination.detailedExpenses.sightseeing.toLocaleString()}</span>
                      </div>
                    )}
                    {destination.detailedExpenses.shopping !== undefined && destination.detailedExpenses.shopping > 0 && (
                      <div className="grid grid-cols-2 items-center gap-2">
                        <span className="flex items-center"><ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" /> Shopping:</span>
                        <span className="text-right font-semibold">${destination.detailedExpenses.shopping.toLocaleString()}</span>
                      </div>
                    )}
                    {destination.detailedExpenses.transport !== undefined && destination.detailedExpenses.transport > 0 && (
                      <div className="grid grid-cols-2 items-center gap-2">
                        <span className="flex items-center"><CarFront className="mr-2 h-4 w-4 text-muted-foreground" /> Transport:</span>
                        <span className="text-right font-semibold">${destination.detailedExpenses.transport.toLocaleString()}</span>
                      </div>
                    )}
                    <hr className="my-1"/>
                    <div className="grid grid-cols-2 items-center gap-2 font-bold">
                        <span className="flex items-center">Sum of Breakdown:</span>
                        <span className="text-right">
                          ${(
                            (destination.detailedExpenses.food || 0) +
                            (destination.detailedExpenses.stay || 0) +
                            (destination.detailedExpenses.sightseeing || 0) +
                            (destination.detailedExpenses.shopping || 0) +
                            (destination.detailedExpenses.transport || 0)
                          ).toLocaleString()}
                        </span>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            )}
          </Popover>

          <div className="flex items-start gap-1 pt-1">
            {visaSeemsRequired ? <XSquare className="h-4 w-4 mt-0.5 text-destructive shrink-0" /> : <CheckSquare className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />}
            <span className="text-muted-foreground">Visa:</span>
            <p className="ml-1 flex-1 text-xs">{destination.visaRequirements}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-2 items-stretch mt-auto p-4">
          <Button onClick={() => onViewItinerary(destination)} variant="default" className="flex-1 w-full">
            <ListChecks className="mr-2 h-4 w-4" />
            View Itinerary
          </Button>
          {isMultiCountryMode && onSelectForMultiCountry && (
            <Button
              onClick={() => onSelectForMultiCountry(destination, !isSelectedForMultiCountry)}
              variant={isSelectedForMultiCountry ? "secondary" : "outline"}
              className="w-full flex-1"
            >
              {isSelectedForMultiCountry ? <CheckSquare className="mr-2 h-4 w-4" /> : <XSquare className="mr-2 h-4 w-4" />}
              {isSelectedForMultiCountry ? 'Selected' : 'Select'}
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}

