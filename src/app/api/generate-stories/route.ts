import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { type Tone } from "@/lib/jobs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Story {
  id: string;
  content: string;
  job: string;
  tone: Tone;
}

export async function POST(request: NextRequest) {
  try {
    const { job, tone, count, customStory, approvedExamples } = await request.json();

    if (!job || !tone) {
      return NextResponse.json(
        { error: "Job and tone are required" },
        { status: 400 }
      );
    }

    let prompt = `Generate ${count} short fictional workplace stories about a ${job}. 

REQUIREMENTS:
- Each story must be 150-250 words
- Written for voiceover delivery (natural speaking style)
- ${tone} tone
- Feel plausible but engaging
- Ready for TikTok/YouTube Shorts format
- Include a subtle twist or memorable moment
- Written in narrative voice, not summary

STYLE GUIDELINES:
- Start with engaging hook
- Use conversational language
- Include sensory details
- Build to a satisfying conclusion
- Perfect for 60-90 second voiceover

TARGET AUDIENCE: People who love workplace storytime content on social media.

FORMAT: Return only the story text, no titles or extra formatting.`;

    if (customStory) {
      prompt += `\n\nCUSTOM REQUEST: ${customStory}`;
    }

    if (approvedExamples && approvedExamples.length > 0) {
      prompt += `\n\nAPPROVED EXAMPLES (match this style and quality):\n${approvedExamples.slice(0, 3).map((ex: string, i: number) => `Example ${i + 1}: ${ex}`).join('\n\n')}`;
    }

    prompt += `\n\nGenerate ${count} unique stories about a ${job} with ${tone.toLowerCase()} tone:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a master storyteller specializing in workplace fiction for social media. Your stories are engaging, relatable, and perfect for voiceover content. You understand what makes content go viral on TikTok and YouTube Shorts."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: count * 300, // Roughly 300 tokens per story
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    // Split the response into individual stories
    const storyTexts = responseText
      .split(/(?:\n\n|\n---|\n\*\*Story \d+\*\*|\d+\.|Story \d+:)/)
      .map(text => text.trim())
      .filter(text => text.length > 50); // Filter out very short fragments

    const stories: Story[] = storyTexts.slice(0, count).map((content, index) => ({
      id: `${Date.now()}-${index}`,
      content: content.replace(/^\d+\.\s*/, '').trim(), // Remove numbering
      job,
      tone,
    }));

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Error generating stories:", error);
    return NextResponse.json(
      { error: "Failed to generate stories" },
      { status: 500 }
    );
  }
} 