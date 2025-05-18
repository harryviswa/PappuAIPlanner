
"use client";

import type { Destination } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import DestinationCard from './DestinationCard'; 
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Layers, ListChecks, MapPin, DollarSign } from 'lucide-react';

interface MultiCountryModalProps {
  isOpen: boolean;
  onClose: () => void;
  allSuggestedDestinations: Destination[];
  maxSelectableCountries?: number;
  travelDates?: string;
  numberOfTravelers?: number;
}

export default function MultiCountryModal({
  isOpen,
  onClose,
  allSuggestedDestinations,
  maxSelectableCountries = 4, 
  travelDates,
  numberOfTravelers,
}: MultiCountryModalProps) {
  const [selectedCountries, setSelectedCountries] = useState<Destination[]>([]);
  const [viewingItineraries, setViewingItineraries] = useState(false);

  const handleSelectCountry = (destination: Destination, isSelected: boolean) => {
    setSelectedCountries(prev => {
      if (isSelected) {
        if (prev.length < maxSelectableCountries) {
          return [...prev, destination];
        }
        return prev; 
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

  const handleModalClose = () => {
    setSelectedCountries([]);
    setViewingItineraries(false);
    onClose();
  };
  
  const sortedAllDestinations = useMemo(() => 
    [...allSuggestedDestinations].sort((a, b) => a.averageFlightPrice - b.averageFlightPrice), 
    [allSuggestedDestinations]
  );

  const totalTripCostForSelected = useMemo(() => {
    return selectedCountries.reduce((sum, dest) => sum + dest.estimatedExpenses + dest.averageFlightPrice, 0);
  }, [selectedCountries]);

  // Basic styling for table elements if not covered by prose
  const tableStyles = `
    .itinerary-table-multi table { table-layout: auto; width: 100%; border-collapse: collapse; }
    .itinerary-table-multi th, .itinerary-table-multi td { border: 1px solid hsl(var(--border)); padding: 0.5rem; text-align: left; }
    .itinerary-table-multi th { background-color: hsl(var(--muted)); }
  `;

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col">
        {!viewingItineraries ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Layers className="h-6 w-6 text-primary" /> Plan Multi-Country Trip
              </DialogTitle>
              <DialogDescription>
                Select {selectedCountries.length > 0 ? `${selectedCountries.length} of up to` : 'up to'} {maxSelectableCountries} countries from your suggestions to combine.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-2 -mr-2 max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                {sortedAllDestinations.map(dest => (
                  <DestinationCard
                    key={dest.country}
                    destination={dest}
                    onViewItinerary={() => { /* No direct itinerary view here, handled by modal flow */ }}
                    onSelectForMultiCountry={handleSelectCountry}
                    isSelectedForMultiCountry={selectedCountries.some(sc => sc.country === dest.country)}
                    isMultiCountryMode={true}
                    travelDates={travelDates} 
                    numberOfTravelers={numberOfTravelers}
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
              <div className="flex justify-between items-center">
                <DialogDescription>
                  Review the itineraries for your {selectedCountries.length} selected countries.
                  (For {numberOfTravelers || 1} traveler{numberOfTravelers === 1 ? '' : 's'})
                </DialogDescription>
                {selectedCountries.length > 0 && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1 p-2 border rounded-md bg-secondary/50">
                    <DollarSign className="h-4 w-4 text-primary"/>
                    <span>Overall Trip Est: </span>
                    <span className="font-bold text-primary">${totalTripCostForSelected.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-2 -mr-2 max-h-[60vh]">
              <style>{tableStyles}</style>
              <Accordion type="multiple" className="w-full">
                {selectedCountries.map(dest => (
                  <AccordionItem value={dest.country} key={dest.country}>
                    <AccordionTrigger className="hover:no-underline">
                      <span className="flex items-center gap-2 text-lg"><MapPin className="h-5 w-5 text-primary" />{dest.country}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div 
                        className="prose prose-sm max-w-none dark:prose-invert p-2 itinerary-table-multi"
                        dangerouslySetInnerHTML={{ __html: dest.itinerary || "<p>No detailed itinerary provided.</p>" }}
                      />
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
