# WorkTales

**Stories from the jobs we all know — and never forget.**

WorkTales generates short, emotional, and engaging fictional workplace stories perfect for voiceover delivery on TikTok, YouTube Shorts, and Instagram Reels.

## 🧾 What it does

Generate compelling workplace stories that feel authentic and relatable. Whether it's a janitor finding something strange, a nurse dealing with an unforgettable patient, or a barista facing a surreal customer request — every tale could be true.

## 🔥 Features

- **🌐 Bilingual Support**: English 🇺🇸 and French 🇫🇷 story generation
- **50+ Professions**: Choose from a curated list of jobs with storytelling potential
- **Story Validation**: Generate 2 sample stories, approve the ones you like
- **Bulk Generation**: Once validated, generate 10, 20, or 50 stories in your preferred style
- **Tone Control**: Spooky, Emotional, Wholesome, Weird, Ironic, Mysterious, Heartwarming, Dramatic
- **Custom Requests**: Add specific story ideas or scenarios
- **Voiceover Ready**: 150-250 words, optimized for 60-90 second delivery

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **AI**: OpenAI GPT-4
- **Database**: Supabase (optional)
- **Deployment**: Vercel-ready

## 🚀 Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:paarad/28-worktales.git
   cd 28-worktales
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # OpenAI API Key (required)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Supabase Configuration (optional - for saving stories)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

1. **Choose your language** 🇺🇸 English or 🇫🇷 Français
2. **Choose a profession** from the dropdown (50+ options available)
3. **Select a tone** for your stories (Spooky, Emotional, etc.)
4. **Add custom ideas** (optional) to guide the story generation
5. **Generate 2 sample stories** to validate the style
6. **Approve or reject** each story to train the AI
7. **Generate bulk stories** (10, 20, or 50) once you're satisfied

## 🌐 Languages Supported

### 🇺🇸 English
- Natural storytelling for TikTok/YouTube Shorts
- Optimized for English-speaking social media audiences
- Perfect for American/UK content creators

### 🇫🇷 Français
- Histoires naturelles pour TikTok/YouTube Shorts
- Optimisé pour les audiences francophones
- Parfait pour les créateurs de contenu français

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
3. **Deploy**: Automatic deployment on every push to main

### Environment Variables for Production
```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

### Build for Production
```bash
npm run build
npm start
```

## 🎯 Perfect For

- Content creators looking for storytime material
- TikTok and YouTube Shorts creators
- Social media managers needing engaging content
- Bilingual content creators (English/French)
- Anyone who loves workplace fiction

## 💡 Example Stories

**English - Janitor + Spooky tone:**
> "I've been cleaning this office building for three years, and I thought I knew every corner. But last Tuesday, while mopping the third floor, I noticed something odd. The elevator button for the fourth floor was glowing, even though this building only has three floors..."

**Français - Barista + Touchant tone:**
> "Elle venait chaque matin à 7h23, commandait toujours la même chose : un café moyen, deux sucres, pas de crème. Elle ne disait jamais grand-chose à part 'merci'. Puis un jour, elle a laissé un mot avec son paiement : 'Votre sourire m'a aidée à traverser la pire année de ma vie. Merci d'être gentille avec une inconnue.'"

## 🏗️ Database Schema

WorkTales includes a complete Supabase schema with:
- **Story storage and management**
- **User preferences tracking**
- **Story collections and exports**
- **Row-level security (RLS)**
- **Analytics and insights**

See `supabase-schema.sql` for the complete database setup.

## 📈 Performance

- **⚡ Fast builds**: Next.js 15 with Turbopack
- **🎯 Optimized**: Static generation where possible
- **📱 Responsive**: Mobile-first design
- **♿ Accessible**: WCAG compliant components

## 🏷️ Tagline

*"What happens at work... becomes a WorkTale."*  
*"Ce qui arrive au travail... devient un WorkTale."*

---

**Built with ❤️ for content creators worldwide** 🌍
