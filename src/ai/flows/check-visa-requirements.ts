'use server';

/**
 * @fileOverview Checks visa requirements based on nationality and destination.
 *
 * - checkVisaRequirements - A function that checks visa requirements.
 * - CheckVisaRequirementsInput - The input type for the checkVisaRequirements function.
 * - CheckVisaRequirementsOutput - The return type for the checkVisaRequirements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckVisaRequirementsInputSchema = z.object({
  nationality: z
    .string()
    .describe('The nationality of the traveler.'),
  destination: z.string().describe('The destination country.'),
});
export type CheckVisaRequirementsInput = z.infer<typeof CheckVisaRequirementsInputSchema>;

const CheckVisaRequirementsOutputSchema = z.object({
  visaRequired: z
    .boolean()
    .describe('Whether a visa is required for the given nationality and destination.'),
  visaDetails: z
    .string()
    .describe('Details about the visa requirements, if any.'),
});
export type CheckVisaRequirementsOutput = z.infer<typeof CheckVisaRequirementsOutputSchema>;

export async function checkVisaRequirements(
  input: CheckVisaRequirementsInput
): Promise<CheckVisaRequirementsOutput> {
  return checkVisaRequirementsFlow(input);
}

const checkVisaRequirementsPrompt = ai.definePrompt({
  name: 'checkVisaRequirementsPrompt',
  input: {schema: CheckVisaRequirementsInputSchema},
  output: {schema: CheckVisaRequirementsOutputSchema},
  prompt: `You are an expert travel agent specializing in visa requirements.

  Determine whether a visa is required for a traveler of the following nationality to visit the following destination.

  Nationality: {{{nationality}}}
  Destination: {{{destination}}}

  Provide details about the visa requirements, including the type of visa needed, the application process, and any other relevant information.
  If no visa is required, clearly state that.
  `,
});

const checkVisaRequirementsFlow = ai.defineFlow(
  {
    name: 'checkVisaRequirementsFlow',
    inputSchema: CheckVisaRequirementsInputSchema,
    outputSchema: CheckVisaRequirementsOutputSchema,
  },
  async input => {
    const {output} = await checkVisaRequirementsPrompt(input);
    return output!;
  }
);
