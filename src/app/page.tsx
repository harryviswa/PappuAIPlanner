
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { SuggestDestinationsFormInput, Destination, SuggestedDestinationsOutput as AISuggestedDestinationsOutput } from '@/lib/types';
import { suggestDestinations } from '@/ai/flows/suggest-destinations';
import DestinationForm from '@/components/DestinationForm';
import DestinationList from '@/components/DestinationList';
import ItineraryModal from '@/components/ItineraryModal';
import MultiCountryModal from '@/components/MultiCountryModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TrendingDestinations from '@/components/TrendingDestinations';
import { Terminal, Layers, Info, Star, Lightbulb, ShieldCheck, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { travelFacts } from '@/lib/travel-facts';

export default function HomePage() {
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState<string | null>(null);
  const [displayedFact, setDisplayedFact] = useState<string | null>(null);

  const [selectedItineraryDest, setSelectedItineraryDest] = useState<Destination | null>(null);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  
  const [isMultiCountryModalOpen, setIsMultiCountryModalOpen] = useState(false);
  const [formTravelDates, setFormTravelDates] = useState<string | undefined>();
  const [formNumberOfTravelers, setFormNumberOfTravelers] = useState<number | undefined>();

  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      const randomIndex = Math.floor(Math.random() * travelFacts.length);
      setDisplayedFact(travelFacts[randomIndex]);
    } else {
      setDisplayedFact(null); // Clear fact when not loading
    }
  }, [isLoading]);

  const handleFormSubmit = async (data: SuggestDestinationsFormInput) => {
    setIsLoading(true);
    setError(null);
    setAllDestinations([]);
    setDisclaimer(null);
    setFormTravelDates(data.travelDates); 
    setFormNumberOfTravelers(data.numberOfTravelers);

    try {
      const result = await suggestDestinations(data) as AISuggestedDestinationsOutput; 
      if (result && result.destinations) {
        setAllDestinations(result.destinations);
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

  const { primaryVisaNotRequired, primaryVisaRequired, premiumSuggestions } = useMemo(() => {
    const pVNR: Destination[] = [];
    const pVR: Destination[] = [];
    const premium: Destination[] = [];

    allDestinations.forEach(dest => {
      if (dest.isPremiumOption) {
        premium.push(dest);
      } else {
        // Heuristic for visa: if "required" is in the string, or if "not required" is NOT in the string.
        const visaRequirementText = dest.visaRequirements.toLowerCase();
        const visaNeeded = visaRequirementText.includes('required') || 
                           !visaRequirementText.includes('not required');
        if (visaNeeded) {
          pVR.push(dest);
        } else {
          pVNR.push(dest);
        }
      }
    });
    // Sort each list by flight price
    pVNR.sort((a,b) => a.averageFlightPrice - b.averageFlightPrice);
    pVR.sort((a,b) => a.averageFlightPrice - b.averageFlightPrice);
    premium.sort((a,b) => a.averageFlightPrice - b.averageFlightPrice);
    return { primaryVisaNotRequired: pVNR, primaryVisaRequired: pVR, premiumSuggestions: premium };
  }, [allDestinations]);

  const totalPrimarySuggestions = primaryVisaNotRequired.length + primaryVisaRequired.length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-12">
        <TrendingDestinations />
      </div>
      
      <div className="mb-12">
        <DestinationForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      </div>

      {isLoading && (
        <div className="text-center py-10">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-lg text-muted-foreground">Finding your perfect trip...</p>
          {displayedFact && (
            <div className="mt-6 max-w-md mx-auto p-4 bg-accent/10 border border-accent/30 rounded-lg shadow-sm">
              <div className="flex items-center text-accent mb-2">
                <Lightbulb className="h-5 w-5 mr-2" />
                <h3 className="font-semibold text-sm">Did you know?</h3>
              </div>
              <p className="text-sm text-accent-foreground/80">{displayedFact}</p>
            </div>
          )}
        </div>
      )}

      {error && !isLoading && (
         <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Search Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
      )}
      
      <div className="space-y-12">
        {!isLoading && !error && allDestinations.length > 0 && (
          <>
            {disclaimer && (
              <Alert className="bg-accent/10 border-accent/30 text-accent-foreground max-w-3xl mx-auto">
                <Info className="h-4 w-4 text-accent" />
                <AlertTitle>Please Note</AlertTitle>
                <AlertDescription>{disclaimer}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-3xl font-semibold text-center sm:text-left">Suggested Destinations</h2>
                {totalPrimarySuggestions > 1 && ( 
                  <Button onClick={handleOpenMultiCountryModal} variant="outline">
                    <Layers className="mr-2 h-4 w-4" />
                    Plan Multi-Country Trip
                  </Button>
                )}
            </div>

            {primaryVisaNotRequired.length > 0 && (
              <section className="space-y-6">
                <h3 className="text-2xl font-medium text-center sm:text-left flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                  Visa Likely Not Required
                </h3>
                <DestinationList 
                  destinations={primaryVisaNotRequired} 
                  onViewItinerary={handleViewItinerary}
                  travelDates={formTravelDates}
                  numberOfTravelers={formNumberOfTravelers}
                />
              </section>
            )}

            {primaryVisaRequired.length > 0 && (
              <section className="space-y-6 pt-8 mt-8 border-t">
                <h3 className="text-2xl font-medium text-center sm:text-left flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-amber-600" />
                  Visa Likely Required
                </h3>
                <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-700 max-w-3xl">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertTitle>Verify Visa Information</AlertTitle>
                  <AlertDescription>
                    The visa information provided is based on AI suggestions and general knowledge. Always verify specific visa requirements with official government sources or consulates before making travel plans.
                  </AlertDescription>
                </Alert>
                <DestinationList 
                  destinations={primaryVisaRequired} 
                  onViewItinerary={handleViewItinerary}
                  travelDates={formTravelDates}
                  numberOfTravelers={formNumberOfTravelers}
                />
              </section>
            )}
            
            {(primaryVisaNotRequired.length === 0 && primaryVisaRequired.length === 0 && premiumSuggestions.length === 0 && allDestinations.length > 0) && (
              !(premiumSuggestions.length > 0) && <p className="text-center text-muted-foreground">No primary destinations matched your criteria.</p>
            )}


            {premiumSuggestions.length > 0 && (
              <section className="space-y-6 pt-8 mt-8 border-t">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h2 className="text-3xl font-semibold text-center sm:text-left flex items-center gap-2">
                    <Star className="h-7 w-7 text-yellow-500" /> 
                    Premium & Splurge Options
                  </h2>
                </div>
                <DestinationList 
                  destinations={premiumSuggestions} 
                  onViewItinerary={handleViewItinerary}
                  travelDates={formTravelDates}
                  numberOfTravelers={formNumberOfTravelers}
                />
              </section>
            )}
          </>
        )}
      </div>
      
      {!isLoading && !error && allDestinations.length === 0 && formTravelDates && ( 
        <p className="text-center text-xl text-muted-foreground py-10">No destinations matched your criteria. Please try different options.</p>
      )}

      <ItineraryModal
        isOpen={isItineraryModalOpen}
        onClose={() => setIsItineraryModalOpen(false)}
        destination={selectedItineraryDest}
        travelDates={formTravelDates}
      />

      {/* Pass all destinations (primary + premium) to multi-country modal, as it allows mixing */}
      {allDestinations.length > 0 && ( 
        <MultiCountryModal
          isOpen={isMultiCountryModalOpen}
          onClose={() => setIsMultiCountryModalOpen(false)}
          allSuggestedDestinations={allDestinations} 
          travelDates={formTravelDates}
          numberOfTravelers={formNumberOfTravelers}
        />
      )}
    </div>
  );
}
