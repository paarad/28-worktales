"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { jobs, tones, languages, jobTranslations, toneTranslations, type Tone, type Language } from "@/lib/jobs";

interface Story {
  id: string;
  content: string;
  job: string;
  tone: Tone;
}

export default function Home() {
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<Tone>("Emotional");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [customStory, setCustomStory] = useState("");
  const [generatedStories, setGeneratedStories] = useState<Story[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [approvedStories, setApprovedStories] = useState<Story[]>([]);
  const [mode, setMode] = useState<"validate" | "generate">("validate");

  const getJobDisplayName = (job: string) => {
    return selectedLanguage === "fr" ? jobTranslations[job] || job : job;
  };

  const getToneDisplayName = (tone: string) => {
    return selectedLanguage === "fr" ? toneTranslations[tone] || tone : tone;
  };

  const getLocalizedText = (en: string, fr: string) => {
    return selectedLanguage === "fr" ? fr : en;
  };

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
          language: selectedLanguage,
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
          language: selectedLanguage,
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
          <p className="text-lg text-gray-600">
            {getLocalizedText(
              "Stories from the jobs we all know — and never forget.",
              "Des histoires du travail qu'on connaît tous — et qu'on n'oublie jamais."
            )}
          </p>
        </div>

        {/* Job Selection */}
        <Card>
          <CardHeader>
            <CardTitle>
              {getLocalizedText("Choose Your Profession", "Choisissez votre métier")}
            </CardTitle>
            <CardDescription>
              {getLocalizedText(
                "Select a job to generate workplace stories for. Each story will be ready for voiceover and social media.",
                "Sélectionnez un métier pour générer des histoires de travail. Chaque histoire sera prête pour la narration et les réseaux sociaux."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Language Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {getLocalizedText("Language", "Langue")}
                </label>
                <Select value={selectedLanguage} onValueChange={(value: Language) => setSelectedLanguage(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {getLocalizedText("Job/Profession", "Métier/Profession")}
                </label>
                <Select value={selectedJob} onValueChange={setSelectedJob}>
                  <SelectTrigger>
                    <SelectValue placeholder={getLocalizedText("Select a profession...", "Sélectionnez un métier...")} />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job} value={job}>
                        {getJobDisplayName(job)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tone Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  {getLocalizedText("Story Tone", "Ton de l'histoire")}
                </label>
                <Select value={selectedTone} onValueChange={(value: Tone) => setSelectedTone(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone} value={tone}>
                        {getToneDisplayName(tone)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {getLocalizedText("Custom Story Idea (Optional)", "Idée d'histoire personnalisée (Optionnel)")}
              </label>
              <Textarea
                placeholder={getLocalizedText(
                  "Describe a specific story you'd like to see... (e.g., 'Barista during night shift finds something strange in the coffee beans')",
                  "Décrivez une histoire spécifique que vous aimeriez voir... (ex: 'Barista de nuit trouve quelque chose d'étrange dans les grains de café')"
                )}
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
              {isGenerating 
                ? getLocalizedText("Generating Stories...", "Génération d'histoires...")
                : getLocalizedText("Generate 2 Sample Stories", "Générer 2 histoires d'exemple")
              }
            </Button>
          </CardContent>
        </Card>

        {/* Generated Stories for Validation */}
        {generatedStories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {getLocalizedText("Review Generated Stories", "Examiner les histoires générées")}
              </CardTitle>
              <CardDescription>
                {getLocalizedText(
                  "Choose which stories match what you're looking for. This helps the AI understand your preferences.",
                  "Choisissez quelles histoires correspondent à ce que vous recherchez. Cela aide l'IA à comprendre vos préférences."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedStories.map((story) => (
                <div key={story.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{getJobDisplayName(story.job)}</Badge>
                    <Badge variant="outline">{getToneDisplayName(story.tone)}</Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{story.content}</p>
                  <div className="flex gap-2">
                    <Button onClick={() => approveStory(story.id)} size="sm">
                      ✓ {getLocalizedText("Keep This Story", "Garder cette histoire")}
                    </Button>
                    <Button 
                      onClick={() => rejectStory(story.id)} 
                      variant="outline" 
                      size="sm"
                    >
                      ✗ {getLocalizedText("Not What I Want", "Pas ce que je veux")}
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
              <CardTitle>
                {getLocalizedText(`Approved Stories (${approvedStories.length})`, `Histoires approuvées (${approvedStories.length})`)}
              </CardTitle>
              <CardDescription>
                {getLocalizedText(
                  "These stories match your preferences. Ready to generate more in bulk?",
                  "Ces histoires correspondent à vos préférences. Prêt à en générer plus en lot ?"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button 
                  onClick={() => generateBulkStories(10)} 
                  disabled={isGenerating}
                  variant="outline"
                >
                  {getLocalizedText("Generate 10 More", "Générer 10 de plus")}
                </Button>
                <Button 
                  onClick={() => generateBulkStories(20)} 
                  disabled={isGenerating}
                  variant="outline"
                >
                  {getLocalizedText("Generate 20 More", "Générer 20 de plus")}
                </Button>
                <Button 
                  onClick={() => generateBulkStories(50)} 
                  disabled={isGenerating}
                >
                  {getLocalizedText("Generate 50 More", "Générer 50 de plus")}
                </Button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {approvedStories.map((story, index) => (
                  <div key={story.id} className="border rounded-lg p-3 bg-green-50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <Badge variant="secondary">{getJobDisplayName(story.job)}</Badge>
                      <Badge variant="outline">{getToneDisplayName(story.tone)}</Badge>
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
          <p>
            {getLocalizedText(
              "What happens at work... becomes a WorkTale.",
              "Ce qui arrive au travail... devient un WorkTale."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
