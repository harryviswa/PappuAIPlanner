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
  travelDates?: string; // Original travel dates from form
}

export default function ItineraryModal({ isOpen, onClose, destination, travelDates }: ItineraryModalProps) {
  if (!destination) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Itinerary for {destination.country}
          </DialogTitle>
          {travelDates && (
             <DialogDescription className="flex items-center gap-1 text-sm">
                <CalendarDays className="h-4 w-4" /> Based on travel around: {new Date(travelDates).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </DialogDescription>
          )}
        </DialogHeader>
        <ScrollArea className="flex-grow pr-2">
          <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap p-1 bg-muted/30 rounded-md">
            {destination.itinerary || "No detailed itinerary provided for this destination."}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
