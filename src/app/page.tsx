"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { generateReadmeContent } from "@/ai/flows/generate-readme-content";
import { analyzeRepo } from "@/ai/flows/analyze-repo";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const [repoDescription, setRepoDescription] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [userInput, setUserInput] = useState("");
  const [readmeContent, setReadmeContent] = useState("");

  const handleGenerateReadme = async () => {
    if (!repoDescription) {
      toast({
        title: "Error",
        description: "Repo Description is required.",
      });
      return;
    }

    try {
      const readme = await generateReadmeContent({
        repoDescription: repoDescription,
        aiAnalysis: aiAnalysis,
        userInput: userInput,
      });
      setReadmeContent(readme.readmeContent);
      toast({
        title: "Success",
        description: "README.md generated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate README.md.",
      });
      console.error("Error generating README:", error);
    }
  };

  const handleAnalyzeRepo = async () => {
    if (!repoDescription) {
      toast({
        title: "Error",
        description: "Repo Description is required.",
      });
      return;
    }
    try {
      const analysis = await analyzeRepo({
        repoPath: repoDescription,
      });
      setAiAnalysis(analysis.suggestedSections.join(", "));
      toast({
        title: "Success",
        description: "Repo analyzed successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze repo.",
      });
      console.error("Error analyzing repo:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-300">
      <Toaster />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-3xl mx-auto my-10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              RepoMDGen
            </CardTitle>
            <CardDescription className="text-gray-700">
              Generate top-of-the-line README.md files for your new repos!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="repoDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Repo Description:
              </label>
              <Textarea
                id="repoDescription"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                rows={3}
                value={repoDescription}
                onChange={(e) => setRepoDescription(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="aiAnalysis"
                className="block text-sm font-medium text-gray-700"
              >
                AI Analysis:
              </label>
              <Input
                type="text"
                id="aiAnalysis"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                value={aiAnalysis}
                onChange={(e) => setAiAnalysis(e.target.value)}
                placeholder="AI-suggested sections will appear here"
                readOnly
              />
            </div>
            <div>
              <label
                htmlFor="userInput"
                className="block text-sm font-medium text-gray-700"
              >
                User Input:
              </label>
              <Textarea
                id="userInput"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                rows={3}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Customize your README content here"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              className="bg-teal-500 text-white hover:bg-teal-700"
              onClick={handleAnalyzeRepo}
            >
              Analyze Repo
            </Button>
            <Button
              className="bg-teal-500 text-white hover:bg-teal-700"
              onClick={handleGenerateReadme}
            >
              Generate README
            </Button>
          </CardFooter>
        </Card>

        {readmeContent && (
          <Card className="w-full max-w-3xl mx-auto my-10">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">
                Generated README Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="readmeContent"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                rows={10}
                value={readmeContent}
                onChange={(e) => setReadmeContent(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button className="bg-teal-500 text-white hover:bg-teal-700">
                Save README
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
