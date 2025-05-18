
"use client";

import Image from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TrendingUp, DollarSign, CalendarDays, Eye } from 'lucide-react';
import { useState } from 'react';
import TrendingPlaceDetailModal from './TrendingPlaceDetailModal';

interface TrendingPlace {
  name: string;
  description: string;
  image: string | StaticImport;
  dataAiHint: string;
  mockTripCost: string; 
  mockMinDays: string;  
  mockPlacesToVisit: string[];
}

const trendingPlaces: TrendingPlace[] = [
  {
    name: "Kyoto, Japan",
    description: "Ancient temples, serene gardens, and vibrant culture.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Kyoto temple",
    mockTripCost: "$1800 - $2800",
    mockMinDays: "7-10 Days",
    mockPlacesToVisit: ["Kinkaku-ji (Golden Pavilion)", "Fushimi Inari-taisha Shrine", "Arashiyama Bamboo Grove", "Gion District"]
  },
  {
    name: "Paris, France",
    description: "The city of lights, iconic landmarks, and art.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Paris landmark",
    mockTripCost: "$1500 - $2500",
    mockMinDays: "5-7 Days",
    mockPlacesToVisit: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre", "Musée d'Orsay"]
  },
  {
    name: "Rome, Italy",
    description: "Historic ruins, Vatican City, and delicious cuisine.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Rome colosseum",
    mockTripCost: "$1400 - $2300",
    mockMinDays: "4-6 Days",
    mockPlacesToVisit: ["Colosseum", "Roman Forum", "Trevi Fountain", "Vatican City (St. Peter's Basilica, Vatican Museums)", "Pantheon"]
  },
  {
    name: "Bali, Indonesia",
    description: "Lush rice paddies, spiritual retreats, and stunning beaches.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Bali beach",
    mockTripCost: "$1200 - $2000",
    mockMinDays: "7-14 Days",
    mockPlacesToVisit: ["Ubud (Monkey Forest, Rice Terraces)", "Tanah Lot Temple", "Seminyak Beaches", "Nusa Penida Island"]
  },
  {
    name: "New York, USA",
    description: "Iconic skyline, Broadway shows, and diverse neighborhoods.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "NewYork skyline",
    mockTripCost: "$1600 - $3000",
    mockMinDays: "5-7 Days",
    mockPlacesToVisit: ["Statue of Liberty & Ellis Island", "Times Square", "Central Park", "Empire State Building", "Broadway"]
  },
  {
    name: "Santorini, Greece",
    description: "Whitewashed villages, blue-domed churches, and sunsets.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Santorini island",
    mockTripCost: "$2000 - $3500",
    mockMinDays: "4-6 Days",
    mockPlacesToVisit: ["Oia (for sunsets)", "Fira", "Red Beach", "Akrotiri Archaeological Site", "Boat tour to volcano"]
  }
];

export default function TrendingDestinations() {
  const [selectedPlace, setSelectedPlace] = useState<TrendingPlace | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (place: TrendingPlace) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center">
        <TrendingUp className="mr-2 h-6 w-6"/>
        Trending This Month
      </h2>
      <ScrollArea className="whitespace-nowrap rounded-lg border shadow-sm bg-card">
        <div className="flex w-max space-x-4 p-4">
          {trendingPlaces.map((place) => (
            <Card 
              key={place.name} 
              className="w-[300px] sm:w-[320px] shrink-0 overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer flex flex-col"
              onClick={() => handleCardClick(place)}
            >
              <CardHeader className="p-0 relative h-48 w-full">
                <Image
                  src={place.image}
                  alt={place.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-md"
                  data-ai-hint={place.dataAiHint}
                />
              </CardHeader>
              <CardContent className="p-4 flex flex-col flex-grow">
                <CardTitle className="text-xl truncate">{place.name}</CardTitle>
                <CardDescription className="text-sm mt-1 h-10 overflow-hidden text-ellipsis">
                  {place.description}
                </CardDescription>
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary/80" />
                    <span>Est. Trip Cost: {place.mockTripCost}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary/80" />
                    <span>Min. Stay: {place.mockMinDays}</span>
                  </div>
                </div>
                <div className="mt-auto pt-3">
                  <p className="text-xs text-accent hover:underline flex items-center gap-1">
                    <Eye className="h-3 w-3" /> View Suggested Places
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {selectedPlace && (
        <TrendingPlaceDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          place={selectedPlace}
        />
      )}
    </div>
  );
}
