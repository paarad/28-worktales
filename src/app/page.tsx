"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { jobs, tones, type Tone } from "@/lib/jobs";

interface Story {
  id: string;
  content: string;
  job: string;
  tone: Tone;
}

export default function Home() {
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<Tone>("Emotional");
  const [customStory, setCustomStory] = useState("");
  const [generatedStories, setGeneratedStories] = useState<Story[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [approvedStories, setApprovedStories] = useState<Story[]>([]);
  const [mode, setMode] = useState<"validate" | "generate">("validate");

  const generateStories = async () => {
    if (!selectedJob) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: selectedJob,
          tone: selectedTone,
          count: 2, // Always generate 2 for validation
          customStory: customStory.trim() || undefined
        }),
      });

      const data = await response.json();
      if (data.stories) {
        setGeneratedStories(data.stories);
      }
    } catch (error) {
      console.error("Error generating stories:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const approveStory = (storyId: string) => {
    const story = generatedStories.find(s => s.id === storyId);
    if (story) {
      setApprovedStories([...approvedStories, story]);
      setGeneratedStories(generatedStories.filter(s => s.id !== storyId));
    }
  };

  const rejectStory = (storyId: string) => {
    setGeneratedStories(generatedStories.filter(s => s.id !== storyId));
  };

  const generateBulkStories = async (count: number) => {
    if (!selectedJob || approvedStories.length === 0) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: selectedJob,
          tone: selectedTone,
          count,
          approvedExamples: approvedStories.map(s => s.content)
        }),
      });

      const data = await response.json();
      if (data.stories) {
        setApprovedStories([...approvedStories, ...data.stories]);
      }
    } catch (error) {
      console.error("Error generating bulk stories:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">WorkTales</h1>
          <p className="text-lg text-gray-600">Stories from the jobs we all know — and never forget.</p>
        </div>

        {/* Job Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Profession</CardTitle>
            <CardDescription>
              Select a job to generate workplace stories for. Each story will be ready for voiceover and social media.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Job/Profession</label>
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a profession..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job} value={job}>
                        {job}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Story Tone</label>
                <Select value={selectedTone} onValueChange={(value: Tone) => setSelectedTone(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {tone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Custom Story Idea (Optional)
              </label>
              <Textarea
                placeholder="Describe a specific story you'd like to see... (e.g., 'Barista during night shift finds something strange in the coffee beans')"
                value={customStory}
                onChange={(e) => setCustomStory(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={generateStories} 
              disabled={!selectedJob || isGenerating}
              className="w-full"
            >
              {isGenerating ? "Generating Stories..." : "Generate 2 Sample Stories"}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Stories for Validation */}
        {generatedStories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Generated Stories</CardTitle>
              <CardDescription>
                Choose which stories match what you're looking for. This helps the AI understand your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedStories.map((story) => (
                <div key={story.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{story.job}</Badge>
                    <Badge variant="outline">{story.tone}</Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{story.content}</p>
                  <div className="flex gap-2">
                    <Button onClick={() => approveStory(story.id)} size="sm">
                      ✓ Keep This Story
                    </Button>
                    <Button 
                      onClick={() => rejectStory(story.id)} 
                      variant="outline" 
                      size="sm"
                    >
                      ✗ Not What I Want
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Approved Stories */}
        {approvedStories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Approved Stories ({approvedStories.length})</CardTitle>
              <CardDescription>
                These stories match your preferences. Ready to generate more in bulk?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button 
                  onClick={() => generateBulkStories(10)} 
                  disabled={isGenerating}
                  variant="outline"
                >
                  Generate 10 More
                </Button>
                <Button 
                  onClick={() => generateBulkStories(20)} 
                  disabled={isGenerating}
                  variant="outline"
                >
                  Generate 20 More
                </Button>
                <Button 
                  onClick={() => generateBulkStories(50)} 
                  disabled={isGenerating}
                >
                  Generate 50 More
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {approvedStories.map((story, index) => (
                  <div key={story.id} className="border rounded-lg p-3 bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <Badge variant="secondary">{story.job}</Badge>
                      <Badge variant="outline">{story.tone}</Badge>
                    </div>
                    <p className="text-sm text-gray-700">{story.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>What happens at work... becomes a WorkTale.</p>
        </div>
      </div>
    </div>
  );
}
