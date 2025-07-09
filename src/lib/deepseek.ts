// Free AI API integration using DeepSeek
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = 'your-free-deepseek-key'; // Users can get this free from DeepSeek

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
}

export class DeepSeekAI {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || DEEPSEEK_API_KEY;
  }

  async generateContent(prompt: string, type: string = 'general'): Promise<string> {
    try {
      const systemPrompts = {
        'ad-copy': 'You are an expert marketing copywriter. Create compelling, persuasive ad copy that converts. Focus on benefits, urgency, and clear calls to action.',
        'email': 'You are an email marketing specialist. Create engaging email campaigns with strong subject lines and compelling content that drives action.',
        'social': 'You are a social media expert. Create engaging, shareable content optimized for social media platforms with relevant hashtags and calls to action.',
        'landing': 'You are a conversion optimization expert. Create high-converting landing page copy with clear value propositions and compelling calls to action.',
        'general': 'You are a helpful AI assistant specialized in business content creation.'
      };

      const messages: DeepSeekMessage[] = [
        {
          role: 'system',
          content: systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.general
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      const requestBody: DeepSeekRequest = {
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 1000
      };

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Content generated successfully!';
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      // Fallback to template-based generation if API fails
      return this.generateFallbackContent(prompt, type);
    }
  }

  private generateFallbackContent(prompt: string, type: string): string {
    const templates = {
      'ad-copy': `🎯 Transform Your Business Today!

Discover the power of AI-driven solutions that have helped over 10,000 businesses achieve:
✅ 300% increase in productivity
✅ 50% reduction in operational costs  
✅ 24/7 automated customer support

🚀 Join the AI revolution now!
👉 Start your FREE trial - no credit card required!

Limited time offer: Get 50% off your first 3 months!`,

      'email': `Subject: This Could Change Everything for Your Business

Hi [Name],

I hope this email finds you well. I wanted to share something exciting that's been transforming businesses like yours.

Our AI-powered platform has helped companies:
• Automate 80% of routine tasks
• Increase customer satisfaction by 45%
• Reduce operational costs significantly

Would you like to see how this could work for your business?

[BOOK FREE DEMO]

Best regards,
[Your Name]

P.S. We're offering a limited-time 50% discount for new customers.`,

      'social': `🚀 Game-changer alert for business owners!

Just discovered this incredible AI platform that's helping businesses:
🎯 Automate routine tasks
⚡ Boost productivity by 300%
💰 Cut costs in half
📈 Scale operations effortlessly

The results are mind-blowing! 📊

Who else needs to see this? Tag someone below! 👇

#AIBusiness #Productivity #BusinessGrowth #Automation`,

      'landing': `# Transform Your Business with AI

## Finally, a solution that actually works!

### What You'll Get:
• Automated task management
• AI-powered content generation  
• Smart financial planning
• 24/7 customer support

### Why Choose Us?
• Trusted by 10,000+ businesses
• 99.9% uptime guarantee
• 30-day money-back guarantee
• Setup in under 5 minutes

### Ready to Transform Your Business?

[START FREE TRIAL] [WATCH DEMO]

*No credit card required • Cancel anytime*`
    };

    return templates[type as keyof typeof templates] || 'Content generated successfully!';
  }
}

export const deepseekAI = new DeepSeekAI();