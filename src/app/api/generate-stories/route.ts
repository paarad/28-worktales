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
    const { job, tone, language = "en", count, customStory, approvedExamples } = await request.json();

    if (!job || !tone) {
      return NextResponse.json(
        { error: "Job and tone are required" },
        { status: 400 }
      );
    }

    const isFrench = language === "fr";

    // Base prompt in the selected language
    let prompt = isFrench ? 
      `Génère ${count} courtes histoires fictives de travail sur un(e) ${job}. 

EXIGENCES:
- Chaque histoire doit faire 150-250 mots
- Écrite pour être narrée (style parlé naturel)
- Ton ${tone.toLowerCase()}
- Doit sembler plausible mais engageante
- Optimisée pour TikTok/YouTube Shorts (60-90 secondes)
- Inclure un rebondissement subtil ou un moment mémorable
- Écrite à la voix narrative, pas un résumé

GUIDELINES DE STYLE:
- Commencer par un accroche engageante
- Utiliser un langage conversationnel
- Inclure des détails sensoriels
- Construire vers une conclusion satisfaisante
- Parfait pour une narration de 60-90 secondes

PUBLIC CIBLE: Personnes qui aiment le contenu storytime sur les réseaux sociaux.

FORMAT: Retourner seulement le texte de l'histoire, sans titre ni formatage supplémentaire.`
    :
      `Generate ${count} short fictional workplace stories about a ${job}. 

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
      prompt += isFrench ? 
        `\n\nDEMANDE PERSONNALISÉE: ${customStory}` :
        `\n\nCUSTOM REQUEST: ${customStory}`;
    }

    if (approvedExamples && approvedExamples.length > 0) {
      prompt += isFrench ?
        `\n\nEXEMPLES APPROUVÉS (correspondre à ce style et cette qualité):\n${approvedExamples.slice(0, 3).map((ex: string, i: number) => `Exemple ${i + 1}: ${ex}`).join('\n\n')}` :
        `\n\nAPPROVED EXAMPLES (match this style and quality):\n${approvedExamples.slice(0, 3).map((ex: string, i: number) => `Example ${i + 1}: ${ex}`).join('\n\n')}`;
    }

    prompt += isFrench ?
      `\n\nGénère ${count} histoires uniques sur un(e) ${job} avec un ton ${tone.toLowerCase()}:` :
      `\n\nGenerate ${count} unique stories about a ${job} with ${tone.toLowerCase()} tone:`;

    const systemPrompt = isFrench ?
      "Tu es un maître conteur spécialisé dans la fiction de travail pour les réseaux sociaux. Tes histoires sont engageantes, relatables et parfaites pour le contenu de narration. Tu comprends ce qui rend le contenu viral sur TikTok et YouTube Shorts. Écris en français naturel et fluide." :
      "You are a master storyteller specializing in workplace fiction for social media. Your stories are engaging, relatable, and perfect for voiceover content. You understand what makes content go viral on TikTok and YouTube Shorts.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemPrompt
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
      .split(/(?:\n\n|\n---|\n\*\*Story \d+\*\*|\d+\.|Story \d+:|Histoire \d+:|\n\*\*Histoire \d+\*\*)/)
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