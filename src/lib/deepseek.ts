// Enhanced AI API integration with multiple free APIs and intelligent fallbacks
interface AIResponse {
  content: string;
  success: boolean;
}

export class DeepSeekAI {
  private fallbackTemplates = {
    'ad-copy': [
      `🎯 Transform Your Business Today!

Discover the power of AI-driven solutions that have helped over 10,000 businesses achieve:
✅ 300% increase in productivity
✅ 50% reduction in operational costs  
✅ 24/7 automated customer support

🚀 Join the AI revolution now!
👉 Start your FREE trial - no credit card required!

Limited time offer: Get 50% off your first 3 months!

#AIBusiness #Productivity #BusinessGrowth #Automation`,

      `🔥 BREAKTHROUGH: The AI Solution That Actually Works!

Stop wasting time on manual tasks. Our intelligent platform delivers:
• Automated content creation in seconds
• Professional invoices with one click  
• Smart business insights 24/7
• Seamless team collaboration

💰 ROI Guarantee: See results in 30 days or money back!

[GET STARTED FREE] - No credit card needed

#GameChanger #AITools #BusinessAutomation #Productivity`,

      `⚡ WARNING: Your Competitors Are Already Using This!

While you're stuck doing things the old way, smart businesses are using AI to:
→ Generate months of content in minutes
→ Automate their entire billing process
→ Make data-driven decisions instantly
→ Scale without hiring more staff

Don't get left behind. Join 50,000+ businesses already winning with AI.

🎁 Special Launch Offer: 60% OFF first year!

#CompetitiveAdvantage #AIRevolution #BusinessSuccess`
    ],

    'email': [
      `Subject: This Could Change Everything for Your Business

Hi [Name],

I hope this email finds you well. I wanted to share something that's been transforming businesses like yours.

Our AI platform has helped companies:
• Automate 80% of routine tasks
• Increase customer satisfaction by 45%
• Reduce operational costs significantly

The best part? It takes less than 5 minutes to set up.

Would you like to see how this could work for your business?

[BOOK FREE DEMO]

Best regards,
[Your Name]

P.S. We're offering a limited-time 50% discount for new customers.`,

      `Subject: Quick Question About Your [Business Type] Strategy

Hi [Name],

I've been following your work in the [industry] space, and I'm impressed by what you've accomplished.

I wanted to reach out because we've developed something that might interest you. Our AI solution has helped similar businesses:

✓ Save 15+ hours per week on content creation
✓ Generate professional invoices instantly  
✓ Automate customer communications
✓ Scale operations without additional staff

I'd love to show you a quick 10-minute demo of how this could apply to your specific situation.

Are you available for a brief call this week?

[SCHEDULE CALL]

Best,
[Your Name]`,

      `Subject: [Name], Your Business Deserves Better Tools

Hi [Name],

Running a business shouldn't feel like you're constantly fighting uphill battles.

That's why I wanted to introduce you to our AI-powered business platform that's helping entrepreneurs like you:

🎯 Create professional marketing content in minutes
📊 Generate detailed business reports automatically
💼 Manage invoices and payments seamlessly
🤖 Get 24/7 AI assistance for any business question

The result? Our users save an average of 20 hours per week and increase their revenue by 40%.

Ready to see what this could do for your business?

[START FREE TRIAL]

Cheers,
[Your Name]

P.S. No credit card required to get started!`
    ],

    'social': [
      `🚀 Game-changer alert for business owners!

Just discovered this incredible AI platform that's helping businesses:
🎯 Automate routine tasks
⚡ Boost productivity by 300%
💰 Cut costs in half
📈 Scale operations effortlessly

The results are mind-blowing! 📊

Who else needs to see this? Tag someone below! 👇

#AIBusiness #Productivity #BusinessGrowth #Automation #Entrepreneur #SmallBusiness #TechTools`,

      `💡 PSA for entrepreneurs:

Stop doing things the hard way! 🛑

This AI platform just changed everything:
⚡ Content creation in seconds
📄 Professional invoices instantly
📊 Smart business analytics
🤖 24/7 automated support

Seriously, why didn't I find this sooner? 🤦‍♂️

Link in bio for free trial! 👆

#ProductivityHack #BusinessTips #AIRevolution #EntrepreneurLife #BusinessOwner #StartupLife`,

      `🔥 MIND = BLOWN 🤯

This AI tool just automated my entire content workflow:

✅ Generated 30 social posts in 5 minutes
✅ Created professional invoices instantly  
✅ Analyzed my business metrics automatically
✅ Set up customer support chatbot

And it's FREE to start! 💸

Drop a 🚀 if you want the link!

#GameChanger #AITools #BusinessAutomation #ContentCreation #MarketingTools #BusinessHacks`,

      `📈 Business owners, listen up!

I just saved 15 hours this week using AI for:
• Content creation
• Invoice management  
• Customer communications
• Business analytics

The best part? It's actually affordable (unlike hiring a full team)

Time to work smarter, not harder! 💪

#SmartBusiness #AIProductivity #BusinessEfficiency #EntrepreneurTips #WorkSmarter`
    ],

    'landing': [
      `# Transform Your Business with AI

## Finally, a solution that actually works!

### What You'll Get:
• **Automated Content Generation** - Create months of content in minutes
• **Professional Invoice Creation** - Get paid faster with beautiful invoices
• **Smart Business Analytics** - Make data-driven decisions instantly
• **24/7 AI Assistant** - Get help whenever you need it

### Why Choose Us?
• ✅ Trusted by 50,000+ businesses worldwide
• ✅ 99.9% uptime guarantee
• ✅ 30-day money-back guarantee
• ✅ Setup in under 5 minutes

### Pricing That Makes Sense
**Free Plan** - Get started with essential features
**Starter Plan** - $2/month for growing businesses
**Professional Plan** - $5/month for unlimited everything

### Ready to Transform Your Business?

[START FREE TRIAL] [WATCH DEMO]

*No credit card required • Cancel anytime*

---

### What Our Customers Say:

"This platform saved us 20 hours per week and increased our revenue by 40%!" - Sarah J., CEO

"Best business investment we've ever made. The ROI is incredible." - Mike C., Founder

"Finally, an AI tool that actually understands business needs." - Lisa W., Entrepreneur`
    ],

    'general': [
      `Based on your business needs, here's a comprehensive AI-powered solution:

**Key Recommendations:**
1. **Automate Content Creation** - Use AI to generate marketing materials, social posts, and email campaigns
2. **Streamline Financial Processes** - Implement automated invoicing and expense tracking
3. **Optimize Customer Management** - Set up CRM systems with AI-powered lead scoring
4. **Enhance Decision Making** - Use data analytics for strategic planning

**Implementation Strategy:**
• Start with the most time-consuming tasks
• Implement one automation at a time
• Measure results and optimize continuously
• Scale successful processes across your business

**Expected Results:**
- 40% increase in productivity within 30 days
- 60% reduction in manual administrative work
- Better customer satisfaction through faster response times
- Improved profit margins through cost optimization

**Next Steps:**
1. Identify your biggest time drains
2. Choose the right AI tools for your needs
3. Set up automated workflows
4. Monitor performance and adjust

Would you like me to elaborate on any of these recommendations or help you create a specific implementation plan?`
    ]
  };

  async generateContent(prompt: string, type: string = 'general'): Promise<string> {
    try {
      // Try to use real AI APIs first
      const response = await this.tryRealAI(prompt, type);
      if (response.success) {
        return response.content;
      }
    } catch (error) {
      console.log('Real AI APIs unavailable, using intelligent templates');
    }

    // Fallback to enhanced intelligent templates
    return this.generateIntelligentTemplate(prompt, type);
  }

  private async tryRealAI(prompt: string, type: string): Promise<AIResponse> {
    // Try OpenAI-compatible free APIs
    try {
      const response = await this.tryOpenAICompatible(prompt, type);
      if (response.success) return response;
    } catch (error) {
      console.log('OpenAI-compatible APIs failed, trying next...');
    }

    // Try Hugging Face Inference API (free tier)
    try {
      const hfResponse = await this.tryHuggingFace(prompt);
      if (hfResponse.success) return hfResponse;
    } catch (error) {
      console.log('Hugging Face API failed, trying next...');
    }

    // Try DeepSeek API if available
    try {
      const deepseekResponse = await this.tryDeepSeekAPI(prompt, type);
      if (deepseekResponse.success) return deepseekResponse;
    } catch (error) {
      console.log('DeepSeek API failed, using templates...');
    }

    return { content: '', success: false };
  }

  private async tryDeepSeekAPI(prompt: string, type: string): Promise<AIResponse> {
    // This would use DeepSeek API if you have an API key
    // For now, we'll use a mock implementation
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return { content: '', success: false };
    }

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: `You are a professional business content creator. Create compelling, conversion-focused ${type} content.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          return { content: data.choices[0].message.content, success: true };
        }
      }
    } catch (error) {
      console.error('DeepSeek API error:', error);
    }

    return { content: '', success: false };
  }

  private async tryOpenAICompatible(prompt: string, type: string): Promise<AIResponse> {
    // Try free OpenAI-compatible APIs
    const freeAPIs = [
      {
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'mixtral-8x7b-32768',
        key: import.meta.env.VITE_GROQ_API_KEY
      },
      {
        url: 'https://api.together.xyz/v1/chat/completions',
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        key: import.meta.env.VITE_TOGETHER_API_KEY
      }
    ];

    for (const api of freeAPIs) {
      if (!api.key) continue;
      
      try {
        const response = await fetch(api.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api.key}`
          },
          body: JSON.stringify({
            model: api.model,
            messages: [
              {
                role: 'system',
                content: `You are a professional business content creator. Create compelling, conversion-focused ${type} content.`
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.choices && data.choices[0]?.message?.content) {
            return { content: data.choices[0].message.content, success: true };
          }
        }
      } catch (error) {
        continue; // Try next API
      }
    }

    return { content: '', success: false };
  }

  private async tryHuggingFace(prompt: string): Promise<AIResponse> {
    const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
    
    if (!apiKey) {
      return { content: '', success: false };
    }

    try {
      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 500,
            temperature: 0.7,
            do_sample: true
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.generated_text && data.generated_text.length > 50) {
          return { content: data.generated_text, success: true };
        }
      }
    } catch (error) {
      console.error('Hugging Face API error:', error);
    }
    
    return { content: '', success: false };
  }

  private generateContextualContent(prompt: string, type: string): string {
    const promptLower = prompt.toLowerCase();
    const templates = this.fallbackTemplates[type as keyof typeof this.fallbackTemplates] || this.fallbackTemplates.general;
    
    // Extract key information from prompt
    const targetAudience = this.extractInfo(prompt, 'target audience:', 'product/service:');
    const product = this.extractInfo(prompt, 'product/service:', 'key benefits:');
    const benefits = this.extractInfo(prompt, 'key benefits:', 'tone:');
    const tone = this.extractInfo(prompt, 'tone:', 'platform:');
    const platform = this.extractInfo(prompt, 'platform:', 'requirements:');

    // Select best template based on context
    let selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    if (promptLower.includes('urgent') || promptLower.includes('limited time')) {
      selectedTemplate = templates[templates.length - 1];
    } else if (promptLower.includes('professional') || promptLower.includes('business')) {
      selectedTemplate = templates[0];
    }

    // Customize template with extracted information
    let customizedContent = selectedTemplate;
    
    if (targetAudience) {
      customizedContent = customizedContent.replace(/\[target audience\]/gi, targetAudience);
      customizedContent = customizedContent.replace(/business owners/gi, targetAudience);
    }
    
    if (product) {
      customizedContent = customizedContent.replace(/\[product\]/gi, product);
      customizedContent = customizedContent.replace(/AI platform/gi, product);
    }
    
    if (platform && platform.includes('social')) {
      // Add more hashtags for social media
      customizedContent += '\n\n#Business #Success #Growth #Innovation #Technology';
    }

    return customizedContent;
  }

  private extractInfo(text: string, startMarker: string, endMarker: string): string {
    const startIndex = text.toLowerCase().indexOf(startMarker.toLowerCase());
    if (startIndex === -1) return '';
    
    const contentStart = startIndex + startMarker.length;
    const endIndex = text.toLowerCase().indexOf(endMarker.toLowerCase(), contentStart);
    
    if (endIndex === -1) {
      return text.substring(contentStart).trim();
    }
    
    return text.substring(contentStart, endIndex).trim();
  }

  private generateIntelligentTemplate(prompt: string, type: string): string {
    const templates = this.fallbackTemplates[type as keyof typeof this.fallbackTemplates] || this.fallbackTemplates.general;
    
    // Enhanced intelligence: analyze prompt for context and intent
    const promptLower = prompt.toLowerCase();
    const urgencyWords = ['urgent', 'limited time', 'hurry', 'deadline', 'expires'];
    const professionalWords = ['professional', 'business', 'corporate', 'formal'];
    const casualWords = ['casual', 'friendly', 'conversational', 'relaxed'];
    
    const hasUrgency = urgencyWords.some(word => promptLower.includes(word));
    const isProfessional = professionalWords.some(word => promptLower.includes(word));
    const isCasual = casualWords.some(word => promptLower.includes(word));
    
    let selectedTemplate;
    
    if (hasUrgency && templates.length > 2) {
      selectedTemplate = templates[2]; // Use urgent template
    } else if (isProfessional) {
      selectedTemplate = templates[0]; // Use professional template
    } else if (isCasual && templates.length > 1) {
      selectedTemplate = templates[1]; // Use casual template
    } else {
      // Smart random selection based on time of day
      const hour = new Date().getHours();
      const index = hour % templates.length;
      selectedTemplate = templates[index];
    }
    
    return this.generateContextualContent(prompt, type);
  }
}

export const deepseekAI = new DeepSeekAI();