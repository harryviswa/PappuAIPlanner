
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

const DetailedExpensesSchema = z.object({
  food: z.number().optional().describe('Estimated cost for food in USD.'),
  stay: z.number().optional().describe('Estimated cost for accommodation/stay in USD.'),
  sightseeing: z.number().optional().describe('Estimated cost for sightseeing and activities in USD.'),
  shopping: z.number().optional().describe('Estimated budget for shopping in USD.'),
  transport: z.number().optional().describe('Estimated cost for local transportation in USD.'),
}).describe('Detailed breakdown of estimated expenses.');

const DestinationSchema = z.object({
  country: z.string().describe('The suggested country.'),
  averageFlightPrice: z.number().describe('Average flight price in USD.'),
  estimatedExpenses: z
    .number()
    .describe('Total estimated expenses for the trip in USD.'),
  visaRequirements: z
    .string()
    .describe('Visa requirements for the nationality.'),
  itinerary: z.string().describe('Recommended day-by-day itinerary in Markdown format (headings for days, bullet points for activities).'),
  detailedExpenses: DetailedExpensesSchema.optional().describe('Optional: Detailed breakdown of estimated expenses.'),
});

const SuggestDestinationsOutputSchema = z.object({
  destinations: z.array(DestinationSchema),
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
  prompt: `Suggest the best travel destinations based on the following criteria:

Travel Dates: {{{travelDates}}}
Nationality: {{{nationality}}}
Budget: {{{budget}}} USD
Number of Travelers: {{{numberOfTravelers}}}

Consider visa requirements for the traveler's nationality. Return destinations with the lowest possible flight tickets in descending order.
For each destination:
1. Provide a 'country' name.
2. Provide 'averageFlightPrice' in USD (numeric).
3. Provide 'estimatedExpenses' which is the total estimated cost for the trip in USD (numeric).
4. Provide 'visaRequirements' as a string.
5. Create a recommended day-by-day 'itinerary' in Markdown format (headings for days, bullet points for activities) based on the travel dates given.
6. If possible, provide a 'detailedExpenses' object with numeric estimates in USD for 'food', 'stay' (accommodation), 'sightseeing', 'shopping', and 'transport' (local). If a specific category isn't applicable or calculable, it can be omitted or set to 0 within the detailedExpenses object. If no breakdown is possible, the detailedExpenses field itself can be omitted.

Format output as JSON.`,
});

const suggestDestinationsFlow = ai.defineFlow(
  {
    name: 'suggestDestinationsFlow',
    inputSchema: SuggestDestinationsInputSchema,
    outputSchema: SuggestDestinationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure detailedExpenses is at least an empty object if not provided by AI, to prevent undefined errors downstream
    // This is now handled by schema optionality and UI checks
    return output!;
  }
);
