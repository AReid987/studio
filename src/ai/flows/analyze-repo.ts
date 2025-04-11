// 'use server';

/**
 * @fileOverview Analyzes a repository and suggests relevant sections for a README file.
 *
 * - analyzeRepo - Analyzes the repository and suggests sections for the README.
 * - AnalyzeRepoInput - The input type for the analyzeRepo function.
 * - AnalyzeRepoOutput - The return type for the analyzeRepo function.
 */

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeRepoInputSchema = z.object({
  repoPath: z.string().describe('The path to the repository to analyze.'),
});
export type AnalyzeRepoInput = z.infer<typeof AnalyzeRepoInputSchema>;

const AnalyzeRepoOutputSchema = z.object({
  suggestedSections: z
    .array(z.string())
    .describe('An array of suggested sections for the README file.'),
});
export type AnalyzeRepoOutput = z.infer<typeof AnalyzeRepoOutputSchema>;

export async function analyzeRepo(input: AnalyzeRepoInput): Promise<AnalyzeRepoOutput> {
  return analyzeRepoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeRepoPrompt',
  input: {
    schema: z.object({
      repoPath: z.string().describe('The path to the repository to analyze.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedSections: z
        .array(z.string())
        .describe('An array of suggested sections for the README file.'),
    }),
  },
  prompt: `You are an AI assistant helping to generate a README file for a repository.
  Analyze the repository at the following path: {{{repoPath}}}
  Based on the contents of the repository, suggest relevant sections for the README file.
  Return the sections as a JSON array of strings.
  Consider sections such as "Introduction", "Installation", "Usage", "Contributing", "License", etc.
  Only return the JSON, do not include any other text.`,
});

const analyzeRepoFlow = ai.defineFlow<
  typeof AnalyzeRepoInputSchema,
  typeof AnalyzeRepoOutputSchema
>({
  name: 'analyzeRepoFlow',
  inputSchema: AnalyzeRepoInputSchema,
  outputSchema: AnalyzeRepoOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

