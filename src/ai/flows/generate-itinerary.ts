
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
  itinerary: z.string().describe('A detailed day-by-day itinerary for the travel destination, formatted as a well-formed HTML table. The table should have columns: "Day", "Morning Activity", "Afternoon Activity", "Evening Activity", and "Notes". Use basic HTML tags (<table>, <thead>, <tbody>, <tr>, <th>, <td>). Do not include CSS styles.'),
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

Format the itinerary as a well-formed HTML table.
The table should have columns: "Day", "Morning Activity", "Afternoon Activity", "Evening Activity", and "Notes".
Use only basic HTML tags like <table>, <thead>, <tbody>, <tr>, <th>, and <td>.
Do not include any CSS styles or attributes like <style> tags or inline styles.
Ensure the HTML is valid.
For example:
<table>
  <thead>
    <tr>
      <th>Day</th>
      <th>Morning Activity</th>
      <th>Afternoon Activity</th>
      <th>Evening Activity</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Day 1</td>
      <td>Explore the city center.</td>
      <td>Lunch at a local cafe.</td>
      <td>Visit the museum.</td>
      <td>Museum tickets can be bought online.</td>
    </tr>
    <tr>
      <td>Day 2</td>
      <td>Hike to the viewpoint.</td>
      <td>Picnic lunch.</td>
      <td>Relax by the lake.</td>
      <td>Wear comfortable shoes for the hike.</td>
    </tr>
  </tbody>
</table>
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
