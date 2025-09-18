import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Copy, 
  Check,
  Zap,
  Save,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import { deepseekAI } from '../lib/deepseek';
import { TierManager } from '../lib/tiers';
import { database } from '../lib/database';

interface SOPStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  responsible: string;
  tools: string[];
  notes: string;
}

interface SOP {
  id: string;
  title: string;
  description: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
  steps: SOPStep[];
  created_at: string;
  updated_at: string;
}

const SOPCreator: React.FC = () => {
  const [sops, setSops] = useState<SOP[]>([]);
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState('');

  const [sopForm, setSopForm] = useState({
    title: '',
    description: '',
    department: 'general',
    priority: 'medium' as const,
    businessType: '',
    processGoal: '',
    stakeholders: '',
    currentChallenges: ''
  });

  const departments = [
    { id: 'general', name: 'General' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'operations', name: 'Operations' },
    { id: 'finance', name: 'Finance' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'it', name: 'IT & Technology' },
    { id: 'customer-service', name: 'Customer Service' }
  ];

  const generateSOP = async () => {
    if (!sopForm.title || !sopForm.description) {
      alert('Please fill in title and description');
      return;
    }

    if (!TierManager.canUseFeature('contentGenerations')) {
      alert('You\'ve reached your content generation limit. Please upgrade to continue.');
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `Create a detailed Standard Operating Procedure (SOP) for:

Title: ${sopForm.title}
Description: ${sopForm.description}
Department: ${sopForm.department}
Priority: ${sopForm.priority}
Business Type: ${sopForm.businessType}
Process Goal: ${sopForm.processGoal}
Stakeholders: ${sopForm.stakeholders}
Current Challenges: ${sopForm.currentChallenges}

Please create a comprehensive SOP with:
1. Clear step-by-step procedures
2. Responsible parties for each step
3. Estimated time duration for each step
4. Required tools/resources
5. Quality checkpoints
6. Troubleshooting notes

Format as a structured, professional SOP document.`;

      const aiResponse = await deepseekAI.generateContent(prompt, 'general');
      
      // Parse AI response into structured SOP
      const generatedSOP = parseAIResponseToSOP(aiResponse, sopForm);
      
      setSops(prev => [generatedSOP, ...prev]);
      setSelectedSOP(generatedSOP);
      setShowCreateModal(false);
      resetForm();
      
      TierManager.updateUsage('contentGenerations');
    } catch (error) {
      console.error('SOP generation error:', error);
      alert('Error generating SOP. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseAIResponseToSOP = (aiResponse: string, formData: any): SOP => {
    // Create a structured SOP from AI response
    const steps: SOPStep[] = [];
    
    // Extract steps from AI response (simplified parsing)
    const lines = aiResponse.split('\n').filter(line => line.trim());
    let stepCounter = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.match(/^\d+\./) || line.toLowerCase().includes('step')) {
        steps.push({
          id: `step-${stepCounter}`,
          title: line.replace(/^\d+\.\s*/, '').replace(/step\s*\d*:?\s*/i, ''),
          description: lines[i + 1] || 'Detailed description of this step',
          duration: '15-30 minutes',
          responsible: 'Team Member',
          tools: ['Standard tools'],
          notes: 'Important considerations for this step'
        });
        stepCounter++;
      }
    }

    // If no steps were parsed, create default steps
    if (steps.length === 0) {
      steps.push(
        {
          id: 'step-1',
          title: 'Preparation and Setup',
          description: 'Gather all necessary resources and prepare the workspace',
          duration: '10-15 minutes',
          responsible: 'Process Owner',
          tools: ['Computer', 'Documentation'],
          notes: 'Ensure all prerequisites are met before proceeding'
        },
        {
          id: 'step-2',
          title: 'Execute Main Process',
          description: 'Perform the core activities as outlined in the procedure',
          duration: '30-45 minutes',
          responsible: 'Team Member',
          tools: ['Required software', 'Templates'],
          notes: 'Follow the checklist carefully and document any deviations'
        },
        {
          id: 'step-3',
          title: 'Quality Check and Review',
          description: 'Verify that all requirements have been met and quality standards achieved',
          duration: '10-15 minutes',
          responsible: 'Quality Reviewer',
          tools: ['Checklist', 'Review template'],
          notes: 'Document any issues found and corrective actions taken'
        },
        {
          id: 'step-4',
          title: 'Documentation and Handoff',
          description: 'Complete all documentation and hand off to the next stage',
          duration: '5-10 minutes',
          responsible: 'Process Owner',
          tools: ['Documentation system'],
          notes: 'Ensure all stakeholders are notified of completion'
        }
      );
    }

    return {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      department: formData.department,
      priority: formData.priority,
      steps,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };

  const saveSOP = async (sop: SOP) => {
    const campaignData = {
      title: `SOP: ${sop.title}`,
      type: 'sop',
      content: JSON.stringify(sop),
      target_audience: sop.department,
      platform: 'business-process'
    };

    const { data, error } = await database.createCampaign(campaignData);
    if (!error && data) {
      alert('SOP saved successfully!');
    } else {
      alert('Error saving SOP. Please try again.');
    }
  };

  const exportSOP = (sop: SOP) => {
    const sopContent = `
# ${sop.title}

**Department:** ${sop.department}
**Priority:** ${sop.priority}
**Created:** ${new Date(sop.created_at).toLocaleDateString()}

## Description
${sop.description}

## Procedure Steps

${sop.steps.map((step, index) => `
### Step ${index + 1}: ${step.title}

**Description:** ${step.description}
**Duration:** ${step.duration}
**Responsible:** ${step.responsible}
**Tools Required:** ${step.tools.join(', ')}
**Notes:** ${step.notes}

---
`).join('')}

## Additional Information
- Total estimated time: ${sop.steps.length * 20} minutes
- Review this SOP quarterly for updates
- Contact process owner for clarifications
    `;

    const blob = new Blob([sopContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP-${sop.title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySOPContent = (sop: SOP) => {
    const content = `${sop.title}\n\n${sop.description}\n\nSteps:\n${sop.steps.map((step, i) => `${i + 1}. ${step.title}: ${step.description}`).join('\n')}`;
    navigator.clipboard.writeText(content);
    setCopied(sop.id);
    setTimeout(() => setCopied(''), 2000);
  };

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const resetForm = () => {
    setSopForm({
      title: '',
      description: '',
      department: 'general',
      priority: 'medium',
      businessType: '',
      processGoal: '',
      stakeholders: '',
      currentChallenges: ''
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Business SOP Creator</h1>
          <p className="text-slate-600 dark:text-gray-400 mt-1">Create comprehensive Standard Operating Procedures with AI assistance</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create SOP</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOP List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Your SOPs</h2>
          
          {sops.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-gray-400">No SOPs created yet</p>
              <p className="text-sm text-slate-500 dark:text-gray-500">Create your first SOP to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sops.map((sop) => (
                <div
                  key={sop.id}
                  onClick={() => setSelectedSOP(sop)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedSOP?.id === sop.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500'
                  }`}
                >
                  <h3 className="font-medium text-slate-800 dark:text-white mb-2">{sop.title}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${getPriorityColor(sop.priority)}`}>
                      {sop.priority}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 capitalize">
                      {sop.department}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2">
                    {sop.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-500 dark:text-gray-400">
                      {sop.steps.length} steps
                    </span>
                    <span className="text-xs text-slate-500 dark:text-gray-400">
                      {new Date(sop.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SOP Details */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700">
          {selectedSOP ? (
            <div className="space-y-6">
              {/* SOP Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{selectedSOP.title}</h2>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 text-sm rounded-full capitalize ${getPriorityColor(selectedSOP.priority)}`}>
                      {selectedSOP.priority} Priority
                    </span>
                    <span className="text-sm text-slate-600 dark:text-gray-400 capitalize">
                      {selectedSOP.department} Department
                    </span>
                    <span className="text-sm text-slate-500 dark:text-gray-500">
                      {selectedSOP.steps.length} Steps
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-gray-400">{selectedSOP.description}</p>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => copySOPContent(selectedSOP)}
                    className="p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Copy SOP"
                  >
                    {copied === selectedSOP.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => saveSOP(selectedSOP)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Save SOP"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => exportSOP(selectedSOP)}
                    className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Export SOP"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* SOP Steps */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Procedure Steps</h3>
                <div className="space-y-3">
                  {selectedSOP.steps.map((step, index) => (
                    <div key={step.id} className="border border-slate-200 dark:border-gray-600 rounded-lg">
                      <button
                        onClick={() => toggleStepExpansion(step.id)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-800 dark:text-white">{step.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{step.duration}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{step.responsible}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        {expandedSteps.has(step.id) ? (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      
                      {expandedSteps.has(step.id) && (
                        <div className="px-4 pb-4 border-t border-slate-200 dark:border-gray-600">
                          <div className="pt-4 space-y-4">
                            <div>
                              <h5 className="font-medium text-slate-700 dark:text-gray-300 mb-2">Description</h5>
                              <p className="text-slate-600 dark:text-gray-400">{step.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-slate-700 dark:text-gray-300 mb-2">Tools Required</h5>
                                <div className="flex flex-wrap gap-2">
                                  {step.tools.map((tool, toolIndex) => (
                                    <span key={toolIndex} className="px-2 py-1 text-xs bg-slate-100 dark:bg-gray-600 text-slate-700 dark:text-gray-300 rounded">
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="font-medium text-slate-700 dark:text-gray-300 mb-2">Duration</h5>
                                <p className="text-slate-600 dark:text-gray-400">{step.duration}</p>
                              </div>
                            </div>
                            
                            {step.notes && (
                              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <div className="flex items-start space-x-2">
                                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                                  <div>
                                    <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Important Notes</h5>
                                    <p className="text-yellow-700 dark:text-yellow-400 text-sm">{step.notes}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">No SOP Selected</h3>
              <p className="text-slate-600 dark:text-gray-400">Select an SOP from the list or create a new one to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Create SOP Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Create New SOP</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  SOP Title *
                </label>
                <input
                  type="text"
                  value={sopForm.title}
                  onChange={(e) => setSopForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Customer Onboarding Process"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={sopForm.description}
                  onChange={(e) => setSopForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none dark:bg-gray-700 dark:text-white"
                  placeholder="Describe what this SOP covers..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    Department
                  </label>
                  <select
                    value={sopForm.department}
                    onChange={(e) => setSopForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={sopForm.priority}
                    onChange={(e) => setSopForm(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Business Type
                </label>
                <input
                  type="text"
                  value={sopForm.businessType}
                  onChange={(e) => setSopForm(prev => ({ ...prev, businessType: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., SaaS, E-commerce, Consulting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Process Goal
                </label>
                <input
                  type="text"
                  value={sopForm.processGoal}
                  onChange={(e) => setSopForm(prev => ({ ...prev, processGoal: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="What should this process achieve?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Key Stakeholders
                </label>
                <input
                  type="text"
                  value={sopForm.stakeholders}
                  onChange={(e) => setSopForm(prev => ({ ...prev, stakeholders: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Who is involved in this process?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Current Challenges
                </label>
                <textarea
                  value={sopForm.currentChallenges}
                  onChange={(e) => setSopForm(prev => ({ ...prev, currentChallenges: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none dark:bg-gray-700 dark:text-white"
                  placeholder="What problems does this SOP solve?"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={generateSOP}
                disabled={isGenerating || !sopForm.title || !sopForm.description}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating SOP...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate SOP</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SOPCreator;