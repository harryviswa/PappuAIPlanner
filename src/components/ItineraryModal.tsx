
"use client";

import type { Destination } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, CalendarDays } from 'lucide-react';

interface ItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Destination | null;
  travelDates?: string; // Formatted string: "YYYY-MM-DD to YYYY-MM-DD"
}

export default function ItineraryModal({ isOpen, onClose, destination, travelDates }: ItineraryModalProps) {
  if (!destination) return null;

  // Basic styling for table elements if not covered by prose
  const tableStyles = `
    .itinerary-table table { table-layout: auto; width: 100%; border-collapse: collapse; }
    .itinerary-table th, .itinerary-table td { border: 1px solid hsl(var(--border)); padding: 0.5rem; text-align: left; }
    .itinerary-table th { background-color: hsl(var(--muted)); }
  `;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Itinerary for {destination.country}
          </DialogTitle>
          {travelDates && (
             <DialogDescription className="flex items-center gap-1 text-sm">
                <CalendarDays className="h-4 w-4" /> For travel dates: {travelDates}
            </DialogDescription>
          )}
        </DialogHeader>
        <ScrollArea className="flex-grow pr-2 -mr-2">
          <style>{tableStyles}</style>
          <div 
            className="prose prose-sm max-w-none dark:prose-invert p-1 itinerary-table"
            dangerouslySetInnerHTML={{ __html: destination.itinerary || "<p>No detailed itinerary provided for this destination.</p>" }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
