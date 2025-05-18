"use client";

import type { Destination } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import DestinationCard from './DestinationCard'; // Re-using for selection UI
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Layers, ListChecks, MapPin } from 'lucide-react';

interface MultiCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  allSuggestedDestinations: Destination[];
  maxSelectableCountries?: number;
  travelDates?: string;
}

export default function MultiCountryModal({
  isOpen,
  onClose,
  allSuggestedDestinations,
  maxSelectableCountries = 4, // As per "2-4 countries"
  travelDates,
}: MultiCountryModalProps) {
  const [selectedCountries, setSelectedCountries] = useState<Destination[]>([]);
  const [viewingItineraries, setViewingItineraries] = useState(false);

  const handleSelectCountry = (destination: Destination, isSelected: boolean) => {
    setSelectedCountries(prev => {
      if (isSelected) {
        if (prev.length < maxSelectableCountries) {
          return [...prev, destination];
        }
        return prev; // Max limit reached
      } else {
        return prev.filter(d => d.country !== destination.country);
      }
    });
  };

  const handleViewItineraries = () => {
    if (selectedCountries.length > 0) {
      setViewingItineraries(true);
    }
  };
  
  const handleBackToSelection = () => {
    setViewingItineraries(false);
  };

  // Reset state on close
  const handleModalClose = () => {
    setSelectedCountries([]);
    setViewingItineraries(false);
    onClose();
  };
  
  const sortedAllDestinations = useMemo(() => 
    [...allSuggestedDestinations].sort((a, b) => a.averageFlightPrice - b.averageFlightPrice), 
    [allSuggestedDestinations]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        {!viewingItineraries ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Layers className="h-6 w-6 text-primary" /> Plan Multi-Country Trip
              </DialogTitle>
              <DialogDescription>
                Select up to {maxSelectableCountries} countries from your suggestions to combine.
                ({selectedCountries.length}/{maxSelectableCountries} selected)
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-2 -mr-2 max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                {sortedAllDestinations.map(dest => (
                  <DestinationCard
                    key={dest.country}
                    destination={dest}
                    onViewItinerary={() => { /* No direct itinerary view here */ }}
                    onSelectForMultiCountry={handleSelectCountry}
                    isSelectedForMultiCountry={selectedCountries.some(sc => sc.country === dest.country)}
                    isMultiCountryMode={true}
                  />
                ))}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={handleViewItineraries} disabled={selectedCountries.length < 2 || selectedCountries.length > maxSelectableCountries}>
                <ListChecks className="mr-2 h-4 w-4" />
                View Itineraries for Selected ({selectedCountries.length})
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <ListChecks className="h-6 w-6 text-primary" /> Combined Itineraries
              </DialogTitle>
              <DialogDescription>
                Review the itineraries for your selected countries.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-2 -mr-2 max-h-[60vh]">
              <Accordion type="multiple" className="w-full">
                {selectedCountries.map(dest => (
                  <AccordionItem value={dest.country} key={dest.country}>
                    <AccordionTrigger className="hover:no-underline">
                      <span className="flex items-center gap-2 text-lg"><MapPin className="h-5 w-5 text-primary" />{dest.country}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap p-2 bg-muted/30 rounded-md">
                        {dest.itinerary || "No detailed itinerary provided."}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={handleBackToSelection} variant="outline">Back to Selection</Button>
              <Button onClick={handleModalClose}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
