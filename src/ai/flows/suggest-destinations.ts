
'use server';

/**
 * @fileOverview Suggests the best travel destinations based on user inputs.
 *
 * - suggestDestinations - A function that suggests travel destinations.
 * - SuggestDestinationsInput - The input type for the suggestDestinations function.
 * - SuggestDestinationsOutput - The return type for the suggestDestinations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDestinationsInputSchema = z.object({
  travelDates: z
    .string()
    .describe('The travel dates, potentially a range (e.g., "YYYY-MM-DD to YYYY-MM-DD").'),
  nationality: z.string().describe('The traveler\'s nationality.'),
  budget: z.number().describe('The budget for the trip in USD.'),
  numberOfTravelers: z.number().describe('The number of travelers.'),
});
export type SuggestDestinationsInput = z.infer<typeof SuggestDestinationsInputSchema>;

const SuggestDestinationsOutputSchema = z.object({
  destinations: z.array(
    z.object({
      country: z.string().describe('The suggested country.'),
      averageFlightPrice: z.number().describe('Average flight price in USD.'),
      estimatedExpenses: z
        .number()
        .describe('Estimated expenses for the trip in USD.'),
      visaRequirements: z
        .string()
        .describe('Visa requirements for the nationality.'),
      itinerary: z.string().describe('Recommended day-by-day itinerary in Markdown format (headings for days, bullet points for activities).'),
    })
  ),
  disclaimer: z.string().optional().describe('Disclaimer regarding data accuracy.'),
});
export type SuggestDestinationsOutput = z.infer<typeof SuggestDestinationsOutputSchema>;

export async function suggestDestinations(
  input: SuggestDestinationsInput
): Promise<SuggestDestinationsOutput> {
  return suggestDestinationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDestinationsPrompt',
  input: {schema: SuggestDestinationsInputSchema},
  output: {schema: SuggestDestinationsOutputSchema},
  prompt: `Suggest the best travel destinations based on the following criteria:\n\nTravel Dates: {{{travelDates}}}\nNationality: {{{nationality}}}\nBudget: {{{budget}}} USD\nNumber of Travelers: {{{numberOfTravelers}}}\n\nConsider visa requirements for the traveler's nationality. Return destinations with the lowest possible flight tickets in descending order. Also, create a recommended day-by-day itinerary in Markdown format (headings for days, bullet points for activities) based on the travel dates given. Format output as JSON.`,
});

const suggestDestinationsFlow = ai.defineFlow(
  {
    name: 'suggestDestinationsFlow',
    inputSchema: SuggestDestinationsInputSchema,
    outputSchema: SuggestDestinationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

