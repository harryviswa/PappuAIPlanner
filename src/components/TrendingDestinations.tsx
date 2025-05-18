
"use client";

import Image from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TrendingPlace {
  name: string;
  description: string;
  image: string | StaticImport;
  dataAiHint: string;
}

const trendingPlaces: TrendingPlace[] = [
  {
    name: "Kyoto, Japan",
    description: "Ancient temples, serene gardens, and vibrant culture.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Kyoto Japan temple"
  },
  {
    name: "Paris, France",
    description: "The city of lights, iconic landmarks, and art.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Paris France eiffel tower"
  },
  {
    name: "Rome, Italy",
    description: "Historic ruins, Vatican City, and delicious cuisine.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Rome Italy colosseum"
  },
  {
    name: "Bali, Indonesia",
    description: "Lush rice paddies, spiritual retreats, and stunning beaches.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Bali Indonesia beach"
  },
  {
    name: "New York, USA",
    description: "Iconic skyline, Broadway shows, and diverse neighborhoods.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "New York USA skyline"
  },
  {
    name: "Santorini, Greece",
    description: "Whitewashed villages, blue-domed churches, and sunsets.",
    image: "https://placehold.co/400x300.png",
    dataAiHint: "Santorini Greece island"
  }
];

export default function TrendingDestinations() {
  return (
    <div className="w-full lg:w-1/3 lg:max-w-lg mt-8 lg:mt-0">
      <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6"><path d="m3.5 2 2.1 4.1c.1.2.2.4.2.6V17a2 2 0 0 0 .9 1.7l2.1 1.1a2 2 0 0 0 2.1 0l2.1-1.1A2 2 0 0 0 14 17V6.7c0-.2.1-.4.2-.6L18.5 2"/><path d="M10 12h4"/><path d="M12 10v4"/><path d="M4.5 5h13"/></svg>
        Trending This Month
      </h2>
      <ScrollArea className="whitespace-nowrap rounded-lg border shadow-sm bg-card">
        <div className="flex w-max space-x-4 p-4">
          {trendingPlaces.map((place) => (
            <Card 
              key={place.name} 
              className="w-[280px] sm:w-[300px] shrink-0 overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1"
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
              <CardContent className="p-4">
                <CardTitle className="text-xl truncate">{place.name}</CardTitle>
                <CardDescription className="text-sm mt-1 h-10 overflow-hidden text-ellipsis">
                  {place.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
