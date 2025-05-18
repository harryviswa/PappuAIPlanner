import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-destinations.ts';
import '@/ai/flows/check-visa-requirements.ts';
import '@/ai/flows/generate-itinerary.ts';