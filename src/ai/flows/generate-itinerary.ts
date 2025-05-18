
// This file is machine-generated - edit with care!

'use server';
/**
 * @fileOverview An AI agent to generate a travel itinerary based on destination and travel dates.
 *
 * - generateItinerary - A function that handles the itinerary generation process.
 * - GenerateItineraryInput - The input type for the generateItinerary function.
 * - GenerateItineraryOutput - The return type for the generateItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateItineraryInputSchema = z.object({
  destination: z.string().describe('The desired travel destination.'),
  travelDates: z.string().describe('The travel dates, potentially a range (e.g., "YYYY-MM-DD to YYYY-MM-DD").'),
  interests: z.string().optional().describe('Optional: A comma-separated list of interests, e.g., history, food, adventure.'),
});
export type GenerateItineraryInput = z.infer<typeof GenerateItineraryInputSchema>;

const GenerateItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A detailed day-by-day itinerary for the travel destination.'),
});
export type GenerateItineraryOutput = z.infer<typeof GenerateItineraryOutputSchema>;

export async function generateItinerary(input: GenerateItineraryInput): Promise<GenerateItineraryOutput> {
  return generateItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateItineraryPrompt',
  input: {schema: GenerateItineraryInputSchema},
  output: {schema: GenerateItineraryOutputSchema},
  prompt: `You are an expert travel planner. Given the destination and travel dates, create a detailed day-by-day itinerary.

Destination: {{{destination}}}
Travel Dates: {{{travelDates}}}

{{#if interests}}
Interests: {{{interests}}}
Consider these interests when creating the itinerary.
{{/if}}

Format the itinerary in markdown, with each day as a heading, and activities as bullet points. Include estimated times for each activity.
`,
});

const generateItineraryFlow = ai.defineFlow(
  {
    name: 'generateItineraryFlow',
    inputSchema: GenerateItineraryInputSchema,
    outputSchema: GenerateItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

