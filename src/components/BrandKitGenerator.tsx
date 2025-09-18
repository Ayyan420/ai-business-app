import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Download, 
  Copy, 
  Check, 
  Zap,
  RefreshCw,
  Save,
  Eye,
  Sparkles
} from 'lucide-react';
import { deepseekAI } from '../lib/deepseek';
import { TierManager } from '../lib/tiers';
import { database } from '../lib/database';

const BrandKitGenerator: React.FC = () => {
  const [brandData, setBrandData] = useState({
    businessName: '',
    industry: '',
    targetAudience: '',
    brandPersonality: 'professional',
    preferredColors: '',
    description: ''
  });

  const [generatedBrand, setGeneratedBrand] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState('');

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Food & Beverage',
    'Real Estate', 'Consulting', 'Creative Services', 'Manufacturing', 'Other'
  ];

  const personalities = [
    { id: 'professional', name: 'Professional', description: 'Trustworthy, reliable, corporate' },
    { id: 'creative', name: 'Creative', description: 'Artistic, innovative, expressive' },
    { id: 'friendly', name: 'Friendly', description: 'Approachable, warm, personal' },
    { id: 'bold', name: 'Bold', description: 'Confident, strong, impactful' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean, simple, elegant' },
    { id: 'playful', name: 'Playful', description: 'Fun, energetic, youthful' }
  ];

  const generateBrandKit = async () => {
    if (!brandData.businessName || !brandData.industry) {
      alert('Please fill in business name and industry');
      return;
    }

    if (!TierManager.canUseFeature('contentGenerations')) {
      alert('You\'ve reached your content generation limit. Please upgrade to continue.');
      return;
    }

    setIsGenerating(true);

    try {
      // Generate colors based on personality and industry
      const colors = generateColorPalette(brandData.brandPersonality, brandData.industry, brandData.preferredColors);
      
      // Generate AI content for brand voice and guidelines
      const prompt = `Create brand voice guidelines and visual style recommendations for:
Business Name: ${brandData.businessName}
Industry: ${brandData.industry}
Target Audience: ${brandData.targetAudience}
Brand Personality: ${brandData.brandPersonality}
Description: ${brandData.description}

Provide:
1. Brand voice and tone guidelines
2. Visual style recommendations
3. Content strategy suggestions
4. Brand messaging framework`;

      const aiResponse = await deepseekAI.generateContent(prompt, 'general');
      
      const brandKit = {
        colors: colors,
        fonts: generateFontRecommendations(brandData.brandPersonality),
        logoIdeas: generateLogoSuggestions(brandData.businessName, brandData.industry, brandData.brandPersonality),
        brandVoice: aiResponse,
        visualStyle: generateVisualStyle(brandData.brandPersonality, brandData.industry)
      };

      setGeneratedBrand(brandKit);
      TierManager.updateUsage('contentGenerations');
    } catch (error) {
      console.error('Brand kit generation error:', error);
      alert('Error generating brand kit. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateColorPalette = (personality: string, industry: string, preferredColors: string) => {
    // Industry-specific color schemes
    const industryColors = {
      'Technology': ['#0066CC', '#4A90E2', '#7B68EE', '#00CED1', '#E6F3FF'],
      'Healthcare': ['#2E8B57', '#20B2AA', '#66CDAA', '#98FB98', '#F0FFF0'],
      'Finance': ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
      'Education': ['#7C3AED', '#A855F7', '#C084FC', '#DDD6FE', '#F3E8FF'],
      'Retail': ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FEE2E2'],
      'Food & Beverage': ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A', '#FFFBEB'],
      'Real Estate': ['#059669', '#10B981', '#34D399', '#6EE7B7', '#D1FAE5'],
      'Consulting': ['#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F9FAFB'],
      'Creative Services': ['#EC4899', '#F472B6', '#F9A8D4', '#FBCFE8', '#FDF2F8'],
      'Manufacturing': ['#B45309', '#D97706', '#F59E0B', '#FBBF24', '#FEF3C7']
    };

    // Personality-based color adjustments
    const personalityAdjustments = {
      'professional': (colors: string[]) => colors, // Keep as is
      'creative': (colors: string[]) => [colors[0], '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      'friendly': (colors: string[]) => [colors[0], '#FF9F43', '#10AC84', '#5F27CD', '#00D2D3'],
      'bold': (colors: string[]) => ['#E74C3C', '#C0392B', '#8E44AD', '#2C3E50', '#F39C12'],
      'minimalist': (colors: string[]) => ['#2C3E50', '#34495E', '#7F8C8D', '#BDC3C7', '#ECF0F1'],
      'playful': (colors: string[]) => ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
    };

    // Start with industry colors or default
    let baseColors = industryColors[industry as keyof typeof industryColors] || industryColors['Technology'];
    
    // Apply personality adjustments
    const adjustmentFn = personalityAdjustments[personality as keyof typeof personalityAdjustments];
    if (adjustmentFn) {
      baseColors = adjustmentFn(baseColors);
    }

    // If user specified preferred colors, try to incorporate them
    if (preferredColors) {
      const userColors = extractColorsFromText(preferredColors);
      if (userColors.length > 0) {
        baseColors[0] = userColors[0]; // Use first user color as primary
        if (userColors.length > 1) {
          baseColors[1] = userColors[1]; // Use second as secondary
        }
      }
    }

    return {
      primary: baseColors[0],
      secondary: baseColors[1],
      accent: baseColors[2],
      light: baseColors[3],
      lighter: baseColors[4],
      neutral: '#6B7280',
      background: '#F9FAFB'
    };
  };

  const generateLogoSuggestions = (businessName: string, industry: string, personality: string) => {
    const logoStyles = {
      professional: ['Clean wordmark', 'Geometric icon', 'Monogram with serif font'],
      creative: ['Abstract symbol', 'Hand-drawn illustration', 'Artistic typography'],
      friendly: ['Rounded icon', 'Mascot character', 'Playful wordmark'],
      bold: ['Strong typography', 'Angular shapes', 'High contrast design'],
      minimalist: ['Simple wordmark', 'Single letter mark', 'Clean line art'],
      playful: ['Cartoon character', 'Colorful badge', 'Fun typography']
    };

    const industryIcons = {
      'Technology': ['Circuit patterns', 'Digital elements', 'Abstract tech symbols'],
      'Healthcare': ['Medical cross', 'Heart symbol', 'Wellness icons'],
      'Finance': ['Dollar sign', 'Growth arrows', 'Stability symbols'],
      'Education': ['Book icons', 'Graduation cap', 'Learning symbols'],
      'Retail': ['Shopping elements', 'Product icons', 'Commerce symbols'],
      'Food & Beverage': ['Food icons', 'Chef elements', 'Dining symbols']
    };

    const styles = logoStyles[personality as keyof typeof logoStyles] || logoStyles.professional;
    const icons = industryIcons[industry as keyof typeof industryIcons] || ['Custom symbol', 'Brand mark', 'Icon design'];

    return [
      {
        type: 'Wordmark',
        description: `${businessName} in ${styles[0]} style`,
        elements: ['Typography-focused', 'Clean letterforms', 'Professional spacing']
      },
      {
        type: 'Icon + Text',
        description: `Combination logo with ${icons[0]} and business name`,
        elements: ['Scalable icon', 'Balanced composition', 'Versatile usage']
      },
      {
        type: 'Symbol/Icon',
        description: `Standalone ${icons[1]} representing your brand`,
        elements: ['Memorable symbol', 'Works at small sizes', 'Strong recognition']
      }
    ];
  };
  const extractColorsFromText = (text: string): string[] => {
    const colorMap: Record<string, string> = {
      'blue': '#3B82F6',
      'red': '#EF4444',
      'green': '#10B981',
      'purple': '#8B5CF6',
      'orange': '#F59E0B',
      'yellow': '#EAB308',
      'pink': '#EC4899',
      'indigo': '#6366F1',
      'teal': '#14B8A6',
      'cyan': '#06B6D4',
      'emerald': '#059669',
      'lime': '#65A30D',
      'amber': '#D97706',
      'rose': '#F43F5E',
      'violet': '#7C3AED',
      'sky': '#0EA5E9',
      'navy': '#1E3A8A',
      'black': '#000000',
      'white': '#FFFFFF',
      'gray': '#6B7280',
      'grey': '#6B7280'
    };

    const colors: string[] = [];
    const words = text.toLowerCase().split(/[\s,]+/);
    
    words.forEach(word => {
      if (colorMap[word]) {
        colors.push(colorMap[word]);
      }
    });

    // Also check for hex colors in the text
    const hexMatches = text.match(/#[0-9A-Fa-f]{6}/g);
    if (hexMatches) {
      colors.push(...hexMatches);
    }

    return colors;
  };

  const generateFontRecommendations = (personality: string) => {
    const fonts = {
      professional: {
        primary: 'Inter',
        secondary: 'Roboto',
        description: 'Clean, readable fonts that convey trust and reliability'
      },
      creative: {
        primary: 'Poppins',
        secondary: 'Nunito',
        description: 'Modern, friendly fonts with creative flair'
      },
      friendly: {
        primary: 'Open Sans',
        secondary: 'Lato',
        description: 'Warm, approachable fonts that feel personal'
      },
      bold: {
        primary: 'Montserrat',
        secondary: 'Oswald',
        description: 'Strong, impactful fonts that command attention'
      },
      minimalist: {
        primary: 'Helvetica',
        secondary: 'Arial',
        description: 'Simple, clean fonts that focus on content'
      },
      playful: {
        primary: 'Quicksand',
        secondary: 'Comfortaa',
        description: 'Fun, rounded fonts that feel energetic'
      }
    };
    return fonts[personality as keyof typeof fonts] || fonts.professional;
  };

  const generateLogoIdeas = (businessName: string, industry: string) => {
    return [
      {
        concept: 'Wordmark',
        description: `Clean typography-based logo using the business name "${businessName}" with custom lettering`
      },
      {
        concept: 'Icon + Text',
        description: `Combination of a simple ${industry.toLowerCase()}-related icon with the business name`
      },
      {
        concept: 'Monogram',
        description: `Stylized initials of "${businessName}" in a distinctive design`
      },
      {
        concept: 'Abstract Symbol',
        description: `Modern abstract shape that represents growth and innovation in ${industry.toLowerCase()}`
      }
    ];
  };

  const generateVisualStyle = (personality: string, industry: string) => {
    const styles = {
      professional: 'Clean lines, structured layouts, plenty of white space, corporate imagery with a focus on trust and reliability',
      creative: 'Artistic elements, unique layouts, creative imagery, experimental typography with bold visual statements',
      friendly: 'Rounded corners, warm imagery, approachable layouts, personal photos with inviting color schemes',
      bold: 'Strong contrasts, large typography, dramatic imagery, confident layouts with impactful visual hierarchy',
      minimalist: 'Lots of white space, simple layouts, minimal elements, focus on content with subtle sophistication',
      playful: 'Bright colors, fun illustrations, dynamic layouts, energetic imagery with youthful appeal'
    };
    
    const industryContext = {
      'Technology': 'incorporating modern tech aesthetics and innovation themes',
      'Healthcare': 'emphasizing care, trust, and professionalism',
      'Finance': 'conveying security, stability, and expertise',
      'Education': 'promoting learning, growth, and accessibility',
      'Retail': 'focusing on products, lifestyle, and customer experience',
      'Food & Beverage': 'highlighting freshness, quality, and appetite appeal'
    };
    
    const baseStyle = styles[personality as keyof typeof styles] || styles.professional;
    const context = industryContext[industry as keyof typeof industryContext] || 'maintaining industry-appropriate aesthetics';
    
    return `${baseStyle}, ${context}.`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const saveBrandKit = async () => {
    if (!generatedBrand) {
      alert('Please generate a brand kit first');
      return;
    }

    const brandKitData = {
      title: `Brand Kit - ${brandData.businessName}`,
      type: 'brand-kit',
      content: JSON.stringify(generatedBrand),
      target_audience: brandData.targetAudience,
      product: brandData.businessName,
      platform: 'brand-kit'
    };

    const { data, error } = await database.createCampaign(brandKitData);
    if (!error && data) {
      alert('Brand kit saved successfully!');
    } else {
      alert('Error saving brand kit. Please try again.');
    }
  };

  const exportBrandKit = () => {
    if (!generatedBrand) return;

    const exportData = {
      businessName: brandData.businessName,
      brandKit: generatedBrand,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandData.businessName.replace(/\s+/g, '-').toLowerCase()}-brand-kit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Brand Kit Generator</h1>
        <p className="text-slate-600 dark:text-gray-400 mt-1">Create a comprehensive brand identity with AI assistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Brand Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={brandData.businessName}
                onChange={(e) => setBrandData(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Industry *
              </label>
              <select
                value={brandData.industry}
                onChange={(e) => setBrandData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={brandData.targetAudience}
                onChange={(e) => setBrandData(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Small business owners, Young professionals"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Brand Personality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {personalities.map(personality => (
                  <button
                    key={personality.id}
                    onClick={() => setBrandData(prev => ({ ...prev, brandPersonality: personality.id }))}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      brandData.brandPersonality === personality.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium text-sm">{personality.name}</div>
                    <div className="text-xs text-slate-600 dark:text-gray-400">{personality.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Preferred Colors (optional)
              </label>
              <input
                type="text"
                value={brandData.preferredColors}
                onChange={(e) => setBrandData(prev => ({ ...prev, preferredColors: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Blue, Green, #3B82F6"
              />
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Enter color names or hex codes (e.g., blue, #3B82F6)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Business Description
              </label>
              <textarea
                value={brandData.description}
                onChange={(e) => setBrandData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none dark:bg-gray-700 dark:text-white"
                placeholder="Describe what your business does..."
              />
            </div>

            <button
              onClick={generateBrandKit}
              disabled={isGenerating || !brandData.businessName || !brandData.industry}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Brand Kit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Brand Kit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Brand Kit */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Generated Brand Kit</h2>
            {generatedBrand && (
              <div className="flex space-x-2">
                <button
                  onClick={saveBrandKit}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={exportBrandKit}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>

          {generatedBrand ? (
            <div className="space-y-6">
              {/* Color Palette */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Color Palette</span>
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(generatedBrand.colors).slice(0, 5).map(([name, color]) => (
                    <div key={name} className="text-center">
                      <div 
                        className="w-full h-16 rounded-lg border border-slate-200 dark:border-gray-600 cursor-pointer hover:scale-105 transition-transform"
                        style={{ backgroundColor: color as string }}
                        onClick={() => copyToClipboard(color as string, `color-${name}`)}
                      />
                      <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 capitalize">{name}</p>
                      <p className="text-xs font-mono text-slate-500 dark:text-gray-500">{color}</p>
                      {copied === `color-${name}` && (
                        <p className="text-xs text-green-600">Copied!</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center space-x-2">
                  <Type className="w-4 h-4" />
                  <span>Typography</span>
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">Primary Font: {generatedBrand.fonts.primary}</p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">For headings and important text</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedBrand.fonts.primary, 'primary-font')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-gray-600 rounded"
                      >
                        {copied === 'primary-font' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">Secondary Font: {generatedBrand.fonts.secondary}</p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">For body text and descriptions</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedBrand.fonts.secondary, 'secondary-font')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-gray-600 rounded"
                      >
                        {copied === 'secondary-font' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-gray-400">{generatedBrand.fonts.description}</p>
                </div>
              </div>

              {/* Logo Ideas */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Logo Suggestions</h3>
                <div className="space-y-2">
                  {generatedBrand.logoIdeas.map((logo: any, index: number) => (
                    <div key={index} className="p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-slate-800 dark:text-white">{logo.type}</h4>
                      <p className="text-sm text-slate-600 dark:text-gray-400 mb-2">{logo.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {logo.elements.map((element: string, elemIndex: number) => (
                          <span key={elemIndex} className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded">
                            {element}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Style */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Visual Style Guidelines</h3>
                <div className="p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-gray-400">{generatedBrand.visualStyle}</p>
                </div>
              </div>

              {/* Brand Voice */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Brand Voice & Guidelines</h3>
                <div className="p-3 bg-slate-50 dark:bg-gray-700 rounded-lg">
                  <pre className="whitespace-pre-wrap text-slate-600 dark:text-gray-400 text-sm">
                    {generatedBrand.brandVoice}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Palette className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-gray-400">Fill in your brand information and click "Generate Brand Kit" to create your comprehensive brand identity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandKitGenerator;