
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
  budget: z.number().describe('The budget for the trip in USD. All monetary outputs should also be in USD.'),
  numberOfTravelers: z.number().describe('The number of travelers.'),
});
export type SuggestDestinationsInput = z.infer<typeof SuggestDestinationsInputSchema>;

const DetailedExpensesSchema = z.object({
  food: z.number().optional().describe('Estimated cost for food in USD.'),
  stay: z.number().optional().describe('Estimated cost for accommodation/stay in USD.'),
  sightseeing: z.number().optional().describe('Estimated cost for sightseeing and activities in USD.'),
  shopping: z.number().optional().describe('Estimated budget for shopping in USD.'),
  transport: z.number().optional().describe('Estimated cost for local transportation in USD.'),
}).describe('Detailed breakdown of estimated on-ground expenses in USD.');

const DestinationSchema = z.object({
  country: z.string().describe('The suggested country.'),
  averageFlightPrice: z.number().describe('Average flight price in USD, per person.'),
  estimatedExpenses: z
    .number()
    .describe('Total estimated *on-ground* expenses for the trip in USD (e.g., accommodation, food, activities; excluding flights). This should be for the specified number of travelers and duration.'),
  visaRequirements: z
    .string()
    .describe('Visa requirements for the nationality (e.g., "Visa required", "Visa not required for stays up to 90 days", "e-Visa available").'),
  itinerary: z
    .string()
    .describe('Recommended day-by-day itinerary, formatted as a well-formed HTML table. The table should have columns: "Day", "Morning Activity", "Afternoon Activity", "Evening Activity", and "Notes". Use basic HTML tags (<table>, <thead>, <tbody>, <tr>, <th>, <td>). Do not include CSS styles.'),
  detailedExpenses: DetailedExpensesSchema.optional().describe('Optional: Detailed breakdown of estimated on-ground expenses in USD. The sum of these details should ideally match the `estimatedExpenses` field.'),
  isPremiumOption: z.boolean().optional().describe('Indicates if this suggestion is a premium/higher-budget option (approx. 25-50% above stated budget).'),
});

const SuggestDestinationsOutputSchema = z.object({
  destinations: z.array(DestinationSchema),
  disclaimer: z.string().optional().describe('Optional: Disclaimer regarding data accuracy or estimations (e.g., "All prices are estimates in USD and subject to change. Visa information is AI-generated and should be verified with official sources.").'),
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
Budget: {{{budget}}} USD (Treat this budget as USD. All monetary values in your response MUST be in USD.)
Number of Travelers: {{{numberOfTravelers}}}

For the primary (non-premium) suggestions:
- Aim to provide a diverse set of 3-5 suggestions, ideally covering different continents if feasible within budget and other constraints.
- Prioritize destinations known for their unique attractions, positive traveler reviews, and overall appeal for the given criteria. Consider both popular hotspots and hidden gems.
- **Crucially, do NOT strictly filter out primary suggestions if a visa might be required for the given nationality. Instead, accurately report the visa requirements (e.g., "Visa required", "Visa not required for stays up to 90 days", "e-Visa available").**
- Return these primary destinations sorted by average flight price (ascending).
- Set 'isPremiumOption' to false for these primary suggestions.

For each destination (both primary and premium):
1. Provide a 'country' name.
2. Provide 'averageFlightPrice' in USD (numeric, per person).
3. Provide 'estimatedExpenses' which is the total estimated *on-ground* expenses for the trip in USD (numeric, e.g., accommodation, food, activities; excluding flights). This should cover the specified number of travelers and the duration implied by the travel dates.
4. Provide 'visaRequirements' as a string, clearly indicating if a visa is needed or not, and any key details (e.g., "Visa required, apply at embassy", "Visa not required for tourist stays up to 30 days.", "e-Visa available online.").
5. Create a recommended day-by-day 'itinerary', formatted as a well-formed HTML table. The table should have columns: "Day", "Morning Activity", "Afternoon Activity", "Evening Activity", and "Notes". Use basic HTML tags like <table>, <thead>, <tbody>, <tr>, <th>, and <td>. Do not include any CSS styles within the HTML.
6. If possible, provide a 'detailedExpenses' object with numeric estimates in USD for 'food', 'stay' (accommodation), 'sightseeing', 'shopping', and 'transport' (local). These are on-ground costs.
   **VERY IMPORTANT**: If 'detailedExpenses' is provided, ensure its sum accurately reflects the 'estimatedExpenses' (on-ground costs). If they cannot be perfectly aligned, prioritize the accuracy of 'estimatedExpenses' as the overall on-ground cost, and make the sum of detailedExpenses match it.
7. Set 'isPremiumOption' to false for primary suggestions and true for premium suggestions. This field MUST always be present for every destination.

Additionally, provide 1-2 'Premium' or 'Splurge' destination options. These should be for travelers willing to spend roughly 25-50% more than their stated 'budget' (which is in USD) for a significantly enhanced experience or luxury. For these premium options:
- Follow points 1-7 above (all monetary values in USD).
- Set 'isPremiumOption' to true.
- These premium options should be listed AFTER the primary suggestions in the final output array.

**CRITICAL**: For every destination object in the \`destinations\` array, you MUST provide all the required fields as defined: \`country\`, \`averageFlightPrice\`, \`estimatedExpenses\`, \`visaRequirements\`, and \`itinerary\`. The field \`isPremiumOption\` must also always be provided. The \`detailedExpenses\` field is optional but preferred if data is available.

If estimations are highly variable or based on limited data (e.g., flight and accommodation prices are highly dynamic), OR if visa information is generalized, provide a brief 'disclaimer' string such as "All prices are estimates in USD and subject to change. Visa information is AI-generated and should be verified with official sources."

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
