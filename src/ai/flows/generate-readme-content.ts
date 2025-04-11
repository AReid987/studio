'use server';
/**
 * @fileOverview Generates README content based on user input and AI analysis.
 *
 * - generateReadmeContent - A function that generates README content.
 * - GenerateReadmeContentInput - The input type for the generateReadmeContent function.
 * - GenerateReadmeContentOutput - The return type for the generateReadmeContent function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateReadmeContentInputSchema = z.object({
  repoDescription: z.string().describe('The description of the repository.'),
  aiAnalysis: z.string().describe('The AI analysis of the repository.'),
  userInput: z.string().describe('User input for customizing the README content.'),
});
export type GenerateReadmeContentInput = z.infer<typeof GenerateReadmeContentInputSchema>;

const GenerateReadmeContentOutputSchema = z.object({
  readmeContent: z.string().describe('The generated README content.'),
});
export type GenerateReadmeContentOutput = z.infer<typeof GenerateReadmeContentOutputSchema>;

export async function generateReadmeContent(input: GenerateReadmeContentInput): Promise<GenerateReadmeContentOutput> {
  return generateReadmeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReadmeContentPrompt',
  input: {
    schema: z.object({
      repoDescription: z.string().describe('The description of the repository.'),
      aiAnalysis: z.string().describe('The AI analysis of the repository.'),
      userInput: z.string().describe('User input for customizing the README content.'),
    }),
  },
  output: {
    schema: z.object({
      readmeContent: z.string().describe('The generated README content.'),
    }),
  },
  prompt: `You are an AI expert in generating README.md files for new repos.

  Based on the following repo description, AI analysis, and user input, generate the README content.

  Repo Description: {{{repoDescription}}}
  AI Analysis: {{{aiAnalysis}}}
  User Input: {{{userInput}}}

  Make sure to include relevant sections such as project description, installation instructions, usage, and contribution guidelines. Output the complete README.md content.`, 
});

const generateReadmeContentFlow = ai.defineFlow<
  typeof GenerateReadmeContentInputSchema,
  typeof GenerateReadmeContentOutputSchema
>(
  {
    name: 'generateReadmeContentFlow',
    inputSchema: GenerateReadmeContentInputSchema,
    outputSchema: GenerateReadmeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
