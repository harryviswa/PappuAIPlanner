"use client";

import type { SuggestDestinationsFormInput } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Users, DollarSign, Flag, Search } from 'lucide-react';
import * as React from 'react';

const formSchema = z.object({
  travelDates: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), {
    message: "Travel date must be in YYYY-MM-DD format.",
  }),
  nationality: z.string().min(2, { message: "Nationality must be at least 2 characters." }),
  budget: z.coerce.number().positive({ message: "Budget must be a positive number." }),
  numberOfTravelers: z.coerce.number().int().min(1, { message: "Must be at least 1 traveler." }),
});

type DestinationFormValues = z.infer<typeof formSchema>;

interface DestinationFormProps {
  onSubmit: (data: SuggestDestinationsFormInput) => void;
  isLoading: boolean;
}

export default function DestinationForm({ onSubmit, isLoading }: DestinationFormProps) {
  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travelDates: '',
      nationality: '',
      budget: 1000,
      numberOfTravelers: 1,
    },
  });

  const handleFormSubmit: SubmitHandler<DestinationFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
          <Search className="h-7 w-7" />
          Find Your Next Adventure
        </CardTitle>
        <CardDescription>
          Tell us your preferences, and we&apos;ll suggest the perfect destinations.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="travelDates"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mb-1">Travel Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : '')}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1"><Flag className="h-4 w-4 text-muted-foreground"/>Nationality</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., American, Indian" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-muted-foreground"/>Budget (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfTravelers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Users className="h-4 w-4 text-muted-foreground"/>Number of Travelers</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Suggest Destinations
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
