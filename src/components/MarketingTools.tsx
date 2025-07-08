import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  FileText, 
  Mail, 
  PenTool, 
  Share2, 
  Target,
  Zap,
  Copy,
  Download
} from 'lucide-react';
import { database } from '../lib/database';

const MarketingTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('ad-copy');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    targetAudience: '',
    product: '',
    benefits: '',
    tone: 'professional',
    platform: 'general'
  });
  const [savedCampaigns, setSavedCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const { data, error } = await database.getCampaigns();
    if (!error && data) {
      setSavedCampaigns(data);
    }
  };
  const tools = [
    { id: 'ad-copy', name: 'Ad Copy Generator', icon: PenTool, description: 'Create compelling advertisements' },
    { id: 'email', name: 'Email Campaigns', icon: Mail, description: 'Design effective email marketing' },
    { id: 'social', name: 'Social Media', icon: Share2, description: 'Generate social media content' },
    { id: 'landing', name: 'Landing Pages', icon: FileText, description: 'Create high-converting pages' },
  ];

  const handleGenerate = () => {
    if (!formData.targetAudience || !formData.product) {
      alert('Please fill in target audience and product/service fields');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI content generation with realistic delay
    setTimeout(() => {
      const contentTemplates = {
        'ad-copy': [
          `🎯 Attention ${formData.targetAudience}!\n\nTired of struggling with ${formData.product}? Our revolutionary solution has helped over 10,000 businesses like yours achieve:\n\n${formData.benefits.split(',').map(b => `✅ ${b.trim()}`).join('\n')}\n\n🚀 Join the success stories today!\n\n👉 Start your FREE trial now - no credit card required!\n\n#${formData.product.replace(/\s+/g, '')} #BusinessGrowth #Success`,
          
          `Transform Your Business with ${formData.product}!\n\n${formData.targetAudience}, imagine if you could:\n${formData.benefits.split(',').map(b => `• ${b.trim()}`).join('\n')}\n\nOur proven system makes it possible. Join 10,000+ satisfied customers who've already transformed their operations.\n\n🎁 Limited Time: Get 50% off your first month!\n\nClick to claim your discount before it expires!`,
          
          `BREAKTHROUGH: ${formData.product} That Actually Works!\n\nDear ${formData.targetAudience},\n\nStop wasting time and money on solutions that don't deliver. Our ${formData.product} is different:\n\n${formData.benefits.split(',').map(b => `→ ${b.trim()}`).join('\n')}\n\nProven results. Real testimonials. Money-back guarantee.\n\nReady to see the difference? Start your free trial today!`
        ],
        
        'email': [
          `Subject: ${formData.targetAudience} - This Changes Everything!\n\nHi [First Name],\n\nI hope this email finds you well. As someone in the ${formData.targetAudience.toLowerCase()} space, I thought you'd be interested in something that's been creating quite a buzz.\n\nOur ${formData.product} has been helping businesses like yours achieve:\n${formData.benefits.split(',').map(b => `• ${b.trim()}`).join('\n')}\n\nThe results speak for themselves:\n• 300% average ROI within 90 days\n• 10,000+ satisfied customers\n• 99.9% uptime guarantee\n\nWould you like to see how this could work for your business?\n\n[BOOK FREE DEMO]\n\nBest regards,\n[Your Name]\n\nP.S. We're offering a limited-time 50% discount for new customers. Don't miss out!`,
          
          `Subject: Quick Question About Your ${formData.product} Strategy\n\nHi [First Name],\n\nI've been following your work in the ${formData.targetAudience.toLowerCase()} industry, and I'm impressed by what you've accomplished.\n\nI wanted to reach out because we've developed something that might interest you. Our ${formData.product} solution has helped similar businesses:\n\n${formData.benefits.split(',').map(b => `✓ ${b.trim()}`).join('\n')}\n\nI'd love to show you a quick 10-minute demo of how this could apply to your specific situation.\n\nAre you available for a brief call this week?\n\n[SCHEDULE CALL]\n\nBest,\n[Your Name]`
        ],
        
        'social': [
          `🚀 Game-changer alert for ${formData.targetAudience}!\n\nJust discovered this incredible ${formData.product} that's helping businesses:\n${formData.benefits.split(',').map(b => `🎯 ${b.trim()}`).join('\n')}\n\nThe results are mind-blowing! 📈\n\nWho else needs to see this? Tag someone below! 👇\n\n#${formData.product.replace(/\s+/g, '')} #BusinessGrowth #GameChanger #${formData.targetAudience.replace(/\s+/g, '')}`,
          
          `💡 PSA for ${formData.targetAudience}:\n\nStop doing things the hard way! 🛑\n\nThis ${formData.product} just changed everything:\n${formData.benefits.split(',').map(b => `⚡ ${b.trim()}`).join('\n')}\n\nSeriously, why didn't I find this sooner? 🤦‍♂️\n\nLink in bio for free trial! 👆\n\n#ProductivityHack #BusinessTips #${formData.targetAudience.replace(/\s+/g, '')}`
        ],
        
        'landing': [
          `# The Ultimate ${formData.product} for ${formData.targetAudience}\n\n## Finally, a solution that actually works!\n\n### What You'll Get:\n${formData.benefits.split(',').map(b => `• ${b.trim()}`).join('\n')}\n\n### Why Choose Us?\n• Trusted by 10,000+ businesses\n• 99.9% uptime guarantee\n• 24/7 customer support\n• 30-day money-back guarantee\n\n### Ready to Transform Your Business?\n\n[START FREE TRIAL] [WATCH DEMO]\n\n*No credit card required • Setup in under 5 minutes*\n\n---\n\n### What Our Customers Say:\n\n"This ${formData.product} transformed our entire operation. We saw results within the first week!" - Sarah J., CEO\n\n"Best investment we've made for our business. The ROI is incredible." - Mike C., Founder`,
          
          `# Stop Struggling with ${formData.product}\n\n## Join 10,000+ ${formData.targetAudience} Who've Already Made the Switch\n\n### The Problem:\nYou're spending too much time on tasks that should be automated. Your current solution isn't delivering the results you need.\n\n### The Solution:\nOur ${formData.product} delivers:\n${formData.benefits.split(',').map(b => `✅ ${b.trim()}`).join('\n')}\n\n### Proof It Works:\n• 300% average ROI\n• 95% customer satisfaction\n• 50% reduction in manual work\n\n### Special Launch Offer:\n**50% OFF** your first 3 months\n\n[CLAIM YOUR DISCOUNT]\n\n*Offer expires in 48 hours*`
        ]
      };
      
      const templates = contentTemplates[selectedTool as keyof typeof contentTemplates] || ['Content generated successfully!'];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      
      setGeneratedContent(randomTemplate);
      setIsGenerating(false);
    }, 2000);
  };

  const saveCampaign = async () => {
    if (!generatedContent) return;
    
    const campaignData = {
      title: `${tools.find(t => t.id === selectedTool)?.name} - ${formData.product}`,
      type: selectedTool,
      content: generatedContent,
      target_audience: formData.targetAudience,
      product: formData.product,
      benefits: formData.benefits,
      tone: formData.tone,
      platform: formData.platform
    };
    
    const { data, error } = await database.createCampaign(campaignData);
    if (!error && data) {
      setSavedCampaigns(prev => [data, ...prev]);
      alert('Campaign saved successfully!');
    } else {
      alert('Error saving campaign. Please try again.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Content copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Marketing Tools</h1>
        <p className="text-slate-600 mt-1">Create compelling marketing content with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tool Selection */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Marketing Tools</h2>
          <div className="space-y-3">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    selectedTool === tool.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5" />
                    <div>
                      <h3 className="font-medium">{tool.name}</h3>
                      <p className="text-sm text-slate-600">{tool.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Generation */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Content Generator</h2>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Content</span>
                </>
              )}
            </button>
          </div>

          {/* Input Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                placeholder="e.g., Small business owners, tech professionals..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product/Service
              </label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
                placeholder="e.g., AI Business Assistant, Marketing Software..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Key Benefits
              </label>
              <textarea
                value={formData.benefits}
                onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                placeholder="e.g., Saves time, increases productivity, reduces costs..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tone
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="urgent">Urgent</option>
                  <option value="friendly">Friendly</option>
                  <option value="authoritative">Authoritative</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="google">Google Ads</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generated Content */}
          {generatedContent && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-slate-800">Generated Content</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button 
                    onClick={saveCampaign}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border">
                <pre className="whitespace-pre-wrap text-slate-700 font-medium">{generatedContent}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Saved Campaigns */}
      {savedCampaigns.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Saved Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCampaigns.slice(0, 6).map((campaign) => (
              <div key={campaign.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-800 truncate">{campaign.title}</h3>
                  <span className="text-xs text-slate-500 capitalize">{campaign.type}</span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                  {campaign.content.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setGeneratedContent(campaign.content)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Load
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingTools;