
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Eye } from 'lucide-react';

interface TrendingPlace {
  name: string;
  description: string;
  image: string | import('next/dist/shared/lib/get-img-props').StaticImport;
  dataAiHint: string;
  mockTripCost: string;
  mockMinDays: string;
  mockPlacesToVisit: string[];
}

interface TrendingPlaceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: TrendingPlace | null;
}

export default function TrendingPlaceDetailModal({ isOpen, onClose, place }: TrendingPlaceDetailModalProps) {
  if (!place) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            {place.name}
          </DialogTitle>
          <DialogDescription>
            {place.description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
            <h3 className="text-lg font-semibold mt-4 mb-2 flex items-center gap-2">
                <Eye className="h-5 w-5 text-muted-foreground"/>
                Suggested Places to Visit
            </h3>
          {place.mockPlacesToVisit.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {place.mockPlacesToVisit.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No specific places suggested for this destination.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
