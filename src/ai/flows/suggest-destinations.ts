
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
    .describe('Visa requirements for the nationality (e.g., "Visa required", "Visa not required for stays up to 90 days", "e-Visa available").'),
  itinerary: z.string().describe('Recommended day-by-day itinerary in Markdown format (headings for days, bullet points for activities).'),
  detailedExpenses: DetailedExpensesSchema.optional().describe('Optional: Detailed breakdown of estimated expenses.'),
  isPremiumOption: z.boolean().optional().describe('Indicates if this suggestion is a premium/higher-budget option (approx. 25-50% above stated budget).'),
});

const SuggestDestinationsOutputSchema = z.object({
  destinations: z.array(DestinationSchema),
  disclaimer: z.string().optional().describe('Optional: Disclaimer regarding data accuracy or estimations (e.g., "All prices are estimates and subject to change. Visa information is AI-generated and should be verified with official sources.").'),
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

For the primary (non-premium) suggestions:
- Aim to provide a diverse set of 3-5 suggestions, ideally covering different continents if feasible within budget and other constraints.
- Prioritize destinations known for their unique attractions, positive traveler reviews, and overall appeal for the given criteria. Consider both popular hotspots and hidden gems.
- **Crucially, do NOT strictly filter out primary suggestions if a visa might be required for the given nationality. Instead, accurately report the visa requirements (e.g., "Visa required", "Visa not required for stays up to 90 days", "e-Visa available").**
- Return these primary destinations sorted by average flight price (ascending).
- Set 'isPremiumOption' to false for these primary suggestions.

For each destination (both primary and premium):
1. Provide a 'country' name.
2. Provide 'averageFlightPrice' in USD (numeric).
3. Provide 'estimatedExpenses' which is the total estimated cost for the trip in USD (numeric).
4. Provide 'visaRequirements' as a string, clearly indicating if a visa is needed or not, and any key details (e.g., "Visa required, apply at embassy", "Visa not required for tourist stays up to 30 days.", "e-Visa available online.").
5. Create a recommended day-by-day 'itinerary' in Markdown format (headings for days, bullet points for activities) based on the travel dates given.
6. If possible, provide a 'detailedExpenses' object with numeric estimates in USD for 'food', 'stay' (accommodation), 'sightseeing', 'shopping', and 'transport' (local). If a specific category isn't applicable or calculable, it can be omitted or set to 0 within the detailedExpenses object.
   **VERY IMPORTANT**: Ensure the 'estimatedExpenses' value accurately reflects the sum of all components in 'detailedExpenses' if the breakdown is provided. If they cannot be perfectly aligned, prioritize the accuracy of 'estimatedExpenses' as the overall trip cost.

Additionally, provide 1-2 'Premium' or 'Splurge' destination options. These should be for travelers willing to spend roughly 25-50% more than their stated 'budget' for a significantly enhanced experience or luxury. For these premium options:
- Follow points 1-6 above.
- Set 'isPremiumOption' to true.
- These premium options should be listed AFTER the primary suggestions in the final output array.

If estimations are highly variable or based on limited data (e.g., flight and accommodation prices are highly dynamic), OR if visa information is generalized, provide a brief 'disclaimer' string such as "All prices are estimates and subject to change. Visa information is AI-generated and should be verified with official sources."

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
    return output!;
  }
);
