import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Zap,
  RefreshCw,
  Save,
  Download
} from 'lucide-react';
import { deepseekAI } from '../lib/deepseek';
import { TierManager } from '../lib/tiers';
import { database } from '../lib/database';

const StrategyTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('growth');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null);

  // Growth Strategy Form
  const [growthForm, setGrowthForm] = useState({
    businessType: '',
    currentRevenue: '',
    targetRevenue: '',
    timeframe: '12',
    currentChallenges: '',
    targetMarket: '',
    competitiveAdvantage: '',
    resources: ''
  });

  // Competitive Analysis Form
  const [competitiveForm, setCompetitiveForm] = useState({
    industry: '',
    competitors: '',
    analysisType: 'swot',
    focusArea: 'overall'
  });

  // Market Research Form
  const [marketForm, setMarketForm] = useState({
    industry: '',
    targetMarket: '',
    region: '',
    researchFocus: 'size'
  });

  // Innovation Form
  const [innovationForm, setInnovationForm] = useState({
    challenge: '',
    innovationType: 'product',
    targetOutcome: '',
    budget: 'medium'
  });

  const tools = [
    { id: 'growth', name: 'AI Growth Strategy', icon: TrendingUp, description: 'AI-powered growth plans' },
    { id: 'competitive', name: 'Competitive Analysis', icon: Target, description: 'AI competitor insights' },
    { id: 'market', name: 'Market Research', icon: Users, description: 'AI market analysis' },
    { id: 'innovation', name: 'Innovation Hub', icon: Lightbulb, description: 'AI business ideas' },
  ];

  const generateGrowthStrategy = async () => {
    if (!growthForm.businessType || !growthForm.currentRevenue || !growthForm.targetRevenue) {
      alert('Please fill in business type, current revenue, and target revenue');
      return;
    }

    if (!TierManager.canUseFeature('aiQueries')) {
      alert('You\'ve reached your AI query limit. Please upgrade to continue.');
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `Create a comprehensive growth strategy for:

Business Type: ${growthForm.businessType}
Current Revenue: $${growthForm.currentRevenue}
Target Revenue: $${growthForm.targetRevenue}
Timeframe: ${growthForm.timeframe} months
Current Challenges: ${growthForm.currentChallenges}
Target Market: ${growthForm.targetMarket}
Competitive Advantage: ${growthForm.competitiveAdvantage}
Available Resources: ${growthForm.resources}

Provide:
1. Detailed growth phases with timelines
2. Specific action items for each phase
3. Revenue milestones and KPIs
4. Resource allocation recommendations
5. Risk assessment and mitigation strategies
6. Marketing and sales strategies
7. Operational scaling recommendations

Format as a structured business strategy document.`;

      const aiResponse = await deepseekAI.generateContent(prompt, 'general');
      
      // Parse and structure the response
      const strategy = {
        type: 'growth',
        businessType: growthForm.businessType,
        currentRevenue: parseFloat(growthForm.currentRevenue),
        targetRevenue: parseFloat(growthForm.targetRevenue),
        timeframe: parseInt(growthForm.timeframe),
        growthRate: ((parseFloat(growthForm.targetRevenue) - parseFloat(growthForm.currentRevenue)) / parseFloat(growthForm.currentRevenue) * 100).toFixed(1),
        phases: generateGrowthPhases(growthForm),
        aiInsights: aiResponse,
        generatedAt: new Date().toISOString()
      };

      setGeneratedStrategy(strategy);
      TierManager.updateUsage('aiQueries');
    } catch (error) {
      console.error('Growth strategy generation error:', error);
      alert('Error generating growth strategy. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCompetitiveAnalysis = async () => {
    if (!competitiveForm.industry || !competitiveForm.competitors) {
      alert('Please fill in industry and competitors');
      return;
    }

    if (!TierManager.canUseFeature('aiQueries')) {
      alert('You\'ve reached your AI query limit. Please upgrade to continue.');
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `Conduct a comprehensive competitive analysis for:

Industry: ${competitiveForm.industry}
Competitors: ${competitiveForm.competitors}
Analysis Type: ${competitiveForm.analysisType}
Focus Area: ${competitiveForm.focusArea}

Provide:
1. SWOT analysis for each competitor
2. Market positioning comparison
3. Pricing strategy analysis
4. Product/service feature comparison
5. Marketing strategy insights
6. Competitive advantages and weaknesses
7. Market share estimates
8. Recommendations for competitive positioning

Format as a detailed competitive intelligence report.`;

      const aiResponse = await deepseekAI.generateContent(prompt, 'general');
      
      const analysis = {
        type: 'competitive',
        industry: competitiveForm.industry,
        competitors: competitiveForm.competitors.split(',').map(c => c.trim()),
        analysisType: competitiveForm.analysisType,
        aiInsights: aiResponse,
        generatedAt: new Date().toISOString()
      };

      setGeneratedStrategy(analysis);
      TierManager.updateUsage('aiQueries');
    } catch (error) {
      console.error('Competitive analysis error:', error);
      alert('Error generating competitive analysis. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMarketResearch = async () => {
    if (!marketForm.industry || !marketForm.targetMarket) {
      alert('Please fill in industry and target market');
      return;
    }

    if (!TierManager.canUseFeature('aiQueries')) {
      alert('You\'ve reached your AI query limit. Please upgrade to continue.');
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `Conduct comprehensive market research for:

Industry: ${marketForm.industry}
Target Market: ${marketForm.targetMarket}
Geographic Region: ${marketForm.region}
Research Focus: ${marketForm.researchFocus}

Provide:
1. Market size and growth projections
2. Target audience demographics and psychographics
3. Market trends and opportunities
4. Barriers to entry and challenges
5. Customer behavior insights
6. Pricing analysis and recommendations
7. Distribution channel analysis
8. Regulatory considerations
9. Technology trends affecting the market

Format as a detailed market research report with actionable insights.`;

      const aiResponse = await deepseekAI.generateContent(prompt, 'general');
      
      const research = {
        type: 'market',
        industry: marketForm.industry,
        targetMarket: marketForm.targetMarket,
        region: marketForm.region,
        researchFocus: marketForm.researchFocus,
        aiInsights: aiResponse,
        generatedAt: new Date().toISOString()
      };

      setGeneratedStrategy(research);
      TierManager.updateUsage('aiQueries');
    } catch (error) {
      console.error('Market research error:', error);
      alert('Error generating market research. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateInnovationIdeas = async () => {
    if (!innovationForm.challenge || !innovationForm.targetOutcome) {
      alert('Please fill in the challenge and target outcome');
      return;
    }

    if (!TierManager.canUseFeature('aiQueries')) {
      alert('You\'ve reached your AI query limit. Please upgrade to continue.');
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `Generate innovative business solutions for:

Current Challenge: ${innovationForm.challenge}
Innovation Type: ${innovationForm.innovationType}
Target Outcome: ${innovationForm.targetOutcome}
Budget Range: ${innovationForm.budget}

Provide:
1. 5-7 innovative solution ideas
2. Implementation feasibility for each idea
3. Cost-benefit analysis
4. Timeline estimates
5. Resource requirements
6. Risk assessment
7. Success metrics and KPIs
8. Step-by-step implementation roadmap

Format as an innovation strategy document with prioritized recommendations.`;

      const aiResponse = await deepseekAI.generateContent(prompt, 'general');
      
      const innovation = {
        type: 'innovation',
        challenge: innovationForm.challenge,
        innovationType: innovationForm.innovationType,
        targetOutcome: innovationForm.targetOutcome,
        budget: innovationForm.budget,
        aiInsights: aiResponse,
        generatedAt: new Date().toISOString()
      };

      setGeneratedStrategy(innovation);
      TierManager.updateUsage('aiQueries');
    } catch (error) {
      console.error('Innovation generation error:', error);
      alert('Error generating innovation ideas. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateGrowthPhases = (formData: any) => {
    const timeframe = parseInt(formData.timeframe);
    const currentRev = parseFloat(formData.currentRevenue);
    const targetRev = parseFloat(formData.targetRevenue);
    
    const phases = [];
    const phaseCount = timeframe <= 6 ? 2 : timeframe <= 12 ? 3 : 4;
    const revenueIncrement = (targetRev - currentRev) / phaseCount;
    
    for (let i = 0; i < phaseCount; i++) {
      const phaseRevenue = currentRev + (revenueIncrement * (i + 1));
      const phaseDuration = Math.ceil(timeframe / phaseCount);
      
      phases.push({
        phase: `Phase ${i + 1}`,
        duration: `${i * phaseDuration}-${(i + 1) * phaseDuration} months`,
        targetRevenue: phaseRevenue,
        status: i === 0 ? 'current' : 'upcoming',
        tasks: generatePhaseTasks(i + 1, formData.businessType)
      });
    }
    
    return phases;
  };

  const generatePhaseTasks = (phaseNumber: number, businessType: string) => {
    const taskTemplates = {
      1: ['Market validation', 'Product refinement', 'Initial marketing setup'],
      2: ['Scale marketing efforts', 'Optimize operations', 'Expand customer base'],
      3: ['Strategic partnerships', 'Market expansion', 'Team scaling'],
      4: ['International expansion', 'Product diversification', 'Exit strategy planning']
    };
    
    return taskTemplates[phaseNumber as keyof typeof taskTemplates] || ['Strategic planning', 'Execution', 'Optimization'];
  };

  const saveStrategy = async () => {
    if (!generatedStrategy) {
      alert('Please generate a strategy first');
      return;
    }

    const strategyData = {
      title: `${generatedStrategy.type.charAt(0).toUpperCase() + generatedStrategy.type.slice(1)} Strategy`,
      type: 'strategy',
      content: JSON.stringify(generatedStrategy),
      platform: 'business-strategy'
    };

    const { data, error } = await database.createCampaign(strategyData);
    if (!error && data) {
      alert('Strategy saved successfully!');
    } else {
      alert('Error saving strategy. Please try again.');
    }
  };

  const exportStrategy = () => {
    if (!generatedStrategy) return;

    const blob = new Blob([JSON.stringify(generatedStrategy, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedStrategy.type}-strategy-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setGeneratedStrategy(null);
    setGrowthForm({
      businessType: '',
      currentRevenue: '',
      targetRevenue: '',
      timeframe: '12',
      currentChallenges: '',
      targetMarket: '',
      competitiveAdvantage: '',
      resources: ''
    });
    setCompetitiveForm({
      industry: '',
      competitors: '',
      analysisType: 'swot',
      focusArea: 'overall'
    });
    setMarketForm({
      industry: '',
      targetMarket: '',
      region: '',
      researchFocus: 'size'
    });
    setInnovationForm({
      challenge: '',
      innovationType: 'product',
      targetOutcome: '',
      budget: 'medium'
    });
  };

  const renderGrowthStrategy = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">AI Growth Strategy Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Business Type *
            </label>
            <input
              type="text"
              value={growthForm.businessType}
              onChange={(e) => setGrowthForm(prev => ({ ...prev, businessType: e.target.value }))}
              placeholder="e.g., SaaS, E-commerce, Consulting"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Current Monthly Revenue *
            </label>
            <input
              type="number"
              value={growthForm.currentRevenue}
              onChange={(e) => setGrowthForm(prev => ({ ...prev, currentRevenue: e.target.value }))}
              placeholder="5000"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Target Monthly Revenue *
            </label>
            <input
              type="number"
              value={growthForm.targetRevenue}
              onChange={(e) => setGrowthForm(prev => ({ ...prev, targetRevenue: e.target.value }))}
              placeholder="15000"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Timeframe (months) *
            </label>
            <select 
              value={growthForm.timeframe}
              onChange={(e) => setGrowthForm(prev => ({ ...prev, timeframe: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
              <option value="18">18 Months</option>
              <option value="24">24 Months</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Current Challenges
            </label>
            <textarea
              value={growthForm.currentChallenges}
              onChange={(e) => setGrowthForm(prev => ({ ...prev, currentChallenges: e.target.value }))}
              placeholder="What are your biggest growth challenges?"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Target Market
            </label>
            <input
              type="text"
              value={growthForm.targetMarket}
              onChange={(e) => setGrowthForm(prev => ({ ...prev, targetMarket: e.target.value }))}
              placeholder="e.g., Small businesses, Enterprise clients"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Competitive Advantage
            </label>
            <input
              type="text"
              value={growthForm.competitiveAdvantage}
              onChange={(e) => setGrowthForm(prev => ({ ...prev, competitiveAdvantage: e.target.value }))}
              placeholder="What makes you unique?"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <button 
          onClick={generateGrowthStrategy}
          disabled={isGenerating}
          className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating Strategy...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Generate AI Strategy</span>
            </>
          )}
        </button>
      </div>

      {generatedStrategy && generatedStrategy.type === 'growth' && (
        <div className="space-y-6">
          {/* Strategy Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-slate-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Growth Strategy Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">${generatedStrategy.currentRevenue.toLocaleString()}</div>
                <div className="text-sm text-blue-700 dark:text-blue-400">Current Revenue</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">${generatedStrategy.targetRevenue.toLocaleString()}</div>
                <div className="text-sm text-green-700 dark:text-green-400">Target Revenue</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{generatedStrategy.growthRate}%</div>
                <div className="text-sm text-purple-700 dark:text-purple-400">Growth Rate</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{generatedStrategy.timeframe}</div>
                <div className="text-sm text-orange-700 dark:text-orange-400">Months</div>
              </div>
            </div>

            {/* Growth Phases */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generatedStrategy.phases.map((phase: any, index: number) => (
                <div key={index} className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 border dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-800 dark:text-white">{phase.phase}</h4>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      phase.status === 'completed' ? 'bg-green-500' :
                      phase.status === 'current' ? 'bg-blue-500' :
                      'bg-slate-300 dark:bg-gray-600'
                    }`}>
                      {phase.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                      {phase.status === 'current' && <AlertCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">{phase.duration}</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-white mb-3">
                    Target: ${phase.targetRevenue.toLocaleString()}
                  </p>
                  <ul className="space-y-2">
                    {phase.tasks.map((task: string, taskIndex: number) => (
                      <li key={taskIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <span className="text-sm text-slate-700 dark:text-gray-300">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-4">🤖 AI Strategic Insights</h3>
            <pre className="whitespace-pre-wrap text-purple-700 dark:text-purple-400 text-sm">
              {generatedStrategy.aiInsights}
            </pre>
          </div>
        </div>
      )}
    </div>
  );

  const renderCompetitiveAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">AI Competitive Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Industry *
            </label>
            <input
              type="text"
              value={competitiveForm.industry}
              onChange={(e) => setCompetitiveForm(prev => ({ ...prev, industry: e.target.value }))}
              placeholder="e.g., SaaS, E-commerce, Healthcare"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Analysis Type
            </label>
            <select 
              value={competitiveForm.analysisType}
              onChange={(e) => setCompetitiveForm(prev => ({ ...prev, analysisType: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="swot">SWOT Analysis</option>
              <option value="positioning">Market Positioning</option>
              <option value="pricing">Pricing Strategy</option>
              <option value="features">Feature Comparison</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Competitors (comma-separated) *
            </label>
            <input
              type="text"
              value={competitiveForm.competitors}
              onChange={(e) => setCompetitiveForm(prev => ({ ...prev, competitors: e.target.value }))}
              placeholder="e.g., Company A, Company B, Company C"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>
        <button 
          onClick={generateCompetitiveAnalysis}
          disabled={isGenerating}
          className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Generate Analysis</span>
            </>
          )}
        </button>
      </div>

      {generatedStrategy && generatedStrategy.type === 'competitive' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">🎯 Competitive Analysis Results</h3>
          <pre className="whitespace-pre-wrap text-slate-600 dark:text-gray-400 text-sm">
            {generatedStrategy.aiInsights}
          </pre>
        </div>
      )}
    </div>
  );

  const renderMarketResearch = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">AI Market Research</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Industry *
            </label>
            <input
              type="text"
              value={marketForm.industry}
              onChange={(e) => setMarketForm(prev => ({ ...prev, industry: e.target.value }))}
              placeholder="e.g., SaaS, E-commerce, Healthcare"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Target Market *
            </label>
            <input
              type="text"
              value={marketForm.targetMarket}
              onChange={(e) => setMarketForm(prev => ({ ...prev, targetMarket: e.target.value }))}
              placeholder="e.g., Small businesses, Millennials"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Geographic Region
            </label>
            <select 
              value={marketForm.region}
              onChange={(e) => setMarketForm(prev => ({ ...prev, region: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Region</option>
              <option value="north-america">North America</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="global">Global</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Research Focus
            </label>
            <select 
              value={marketForm.researchFocus}
              onChange={(e) => setMarketForm(prev => ({ ...prev, researchFocus: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="size">Market Size</option>
              <option value="trends">Market Trends</option>
              <option value="competition">Competition Analysis</option>
              <option value="opportunities">Growth Opportunities</option>
            </select>
          </div>
        </div>
        <button 
          onClick={generateMarketResearch}
          disabled={isGenerating}
          className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Researching...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Generate Research</span>
            </>
          )}
        </button>
      </div>

      {generatedStrategy && generatedStrategy.type === 'market' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">📊 Market Research Results</h3>
          <pre className="whitespace-pre-wrap text-slate-600 dark:text-gray-400 text-sm">
            {generatedStrategy.aiInsights}
          </pre>
        </div>
      )}
    </div>
  );

  const renderInnovationHub = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">AI Innovation Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Current Business Challenge *
            </label>
            <textarea
              value={innovationForm.challenge}
              onChange={(e) => setInnovationForm(prev => ({ ...prev, challenge: e.target.value }))}
              placeholder="Describe the problem you're trying to solve..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Innovation Type
            </label>
            <select 
              value={innovationForm.innovationType}
              onChange={(e) => setInnovationForm(prev => ({ ...prev, innovationType: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="product">Product Innovation</option>
              <option value="process">Process Innovation</option>
              <option value="business-model">Business Model Innovation</option>
              <option value="marketing">Marketing Innovation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Budget Range
            </label>
            <select 
              value={innovationForm.budget}
              onChange={(e) => setInnovationForm(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="low">Under $10K</option>
              <option value="medium">$10K - $50K</option>
              <option value="high">$50K+</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Target Outcome *
            </label>
            <input
              type="text"
              value={innovationForm.targetOutcome}
              onChange={(e) => setInnovationForm(prev => ({ ...prev, targetOutcome: e.target.value }))}
              placeholder="e.g., Increase efficiency, Reduce costs, Improve customer satisfaction"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>
        <button 
          onClick={generateInnovationIdeas}
          disabled={isGenerating}
          className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Innovating...</span>
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4" />
              <span>Generate Ideas</span>
            </>
          )}
        </button>
      </div>

      {generatedStrategy && generatedStrategy.type === 'innovation' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">💡 AI Innovation Ideas</h3>
          <pre className="whitespace-pre-wrap text-slate-600 dark:text-gray-400 text-sm">
            {generatedStrategy.aiInsights}
          </pre>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">AI Strategy Tools</h1>
        <p className="text-slate-600 dark:text-gray-400 mt-1">Plan and execute your business strategy with AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tool Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Strategy Tools</h2>
          <div className="space-y-3">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    selectedTool === tool.id
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                      : 'border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5" />
                    <div>
                      <h3 className="font-medium text-sm">{tool.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-gray-400">{tool.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tool Content */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              {tools.find(t => t.id === selectedTool)?.name}
            </h2>
            {generatedStrategy && (
              <div className="flex space-x-2">
                <button
                  onClick={resetForm}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 rounded hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={saveStrategy}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={exportStrategy}
                  className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>
          
          {selectedTool === 'growth' && renderGrowthStrategy()}
          {selectedTool === 'competitive' && renderCompetitiveAnalysis()}
          {selectedTool === 'market' && renderMarketResearch()}
          {selectedTool === 'innovation' && renderInnovationHub()}
        </div>
      </div>
    </div>
  );
};

export default StrategyTools;