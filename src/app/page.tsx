"use client";

import { useState } from 'react';
import type { SuggestDestinationsFormInput, Destination, SuggestedDestinationsOutput as AISuggestedDestinationsOutput } from '@/lib/types'; // Assuming AISuggestedDestinationsOutput is the direct type from AI flow
import { suggestDestinations } from '@/ai/flows/suggest-destinations'; // Assuming this is the correct path
import DestinationForm from '@/components/DestinationForm';
import DestinationList from '@/components/DestinationList';
import ItineraryModal from '@/components/ItineraryModal';
import MultiCountryModal from '@/components/MultiCountryModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Directly use the output type from the AI flow if it matches SuggestedDestinationsOutput
// For this example, assuming AISuggestedDestinationsOutput is { destinations: Destination[], disclaimer?: string }

export default function HomePage() {
  const [suggestedDestinations, setSuggestedDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);

  const [selectedItineraryDest, setSelectedItineraryDest] = useState<Destination | null>(null);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  
  const [isMultiCountryModalOpen, setIsMultiCountryModalOpen] = useState(false);
  const [formTravelDates, setFormTravelDates] = useState<string | undefined>();


  const { toast } = useToast();

  const handleFormSubmit = async (data: SuggestDestinationsFormInput) => {
    setIsLoading(true);
    setError(null);
    setSuggestedDestinations([]);
    setDisclaimer(null);
    setFormTravelDates(data.travelDates); // Store for itinerary modal context

    try {
      // Type assertion if the AI flow output matches our expected structure
      const result = await suggestDestinations(data) as AISuggestedDestinationsOutput; 
      if (result && result.destinations) {
        setSuggestedDestinations(result.destinations);
        if (result.disclaimer) {
          setDisclaimer(result.disclaimer);
        }
        if (result.destinations.length === 0) {
          toast({
            title: "No Destinations Found",
            description: "Try broadening your search criteria.",
            variant: "default",
          });
        }
      } else {
        setError("Received unexpected data from the suggestion service.");
        toast({
          title: "Error",
          description: "Received unexpected data. Please try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Error fetching suggestions:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while fetching suggestions.";
      setError(errorMessage);
      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewItinerary = (destination: Destination) => {
    setSelectedItineraryDest(destination);
    setIsItineraryModalOpen(true);
  };

  const handleOpenMultiCountryModal = () => {
    setIsMultiCountryModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <DestinationForm onSubmit={handleFormSubmit} isLoading={isLoading} />

      {isLoading && (
        <div className="text-center py-10">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-lg text-muted-foreground">Finding your perfect trip...</p>
        </div>
      )}

      {error && (
         <Alert variant="destructive" className="max-w-2xl mx-auto">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Search Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}

      {!isLoading && !error && suggestedDestinations.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-semibold text-center sm:text-left">Suggested Destinations</h2>
            {suggestedDestinations.length > 1 && (
              <Button onClick={handleOpenMultiCountryModal} variant="outline">
                <Layers className="mr-2 h-4 w-4" />
                Plan Multi-Country Trip
              </Button>
            )}
          </div>
          {disclaimer && (
            <Alert className="bg-accent/20 border-accent/50 text-accent-foreground max-w-3xl mx-auto">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Please Note</AlertTitle>
              <AlertDescription>{disclaimer}</AlertDescription>
            </Alert>
          )}
          <DestinationList destinations={suggestedDestinations} onViewItinerary={handleViewItinerary} />
        </section>
      )}
      
      {!isLoading && !error && suggestedDestinations.length === 0 && formTravelDates /* only show if search was attempted */ && (
        <p className="text-center text-xl text-muted-foreground py-10">No destinations matched your criteria. Please try different options.</p>
      )}


      <ItineraryModal
        isOpen={isItineraryModalOpen}
        onClose={() => setIsItineraryModalOpen(false)}
        destination={selectedItineraryDest}
        travelDates={formTravelDates}
      />

      {suggestedDestinations.length > 0 && (
        <MultiCountryModal
          isOpen={isMultiCountryModalOpen}
          onClose={() => setIsMultiCountryModalOpen(false)}
          allSuggestedDestinations={suggestedDestinations}
          travelDates={formTravelDates}
        />
      )}
    </div>
  );
}
