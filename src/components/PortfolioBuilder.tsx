import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Eye, 
  Edit, 
  Save, 
  Plus, 
  Trash2, 
  ExternalLink,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Palette,
  Type,
  Layout,
  Settings,
  Share2,
  Link,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Award,
  Code,
  Briefcase,
  Star
} from 'lucide-react';
import { database } from '../lib/database';
import ImageUpload from './ImageUpload';

interface PortfolioBuilderProps {
  user: any;
}

const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({ user }) => {
  const [portfolio, setPortfolio] = useState<any>({
    business_name: '',
    tagline: '',
    description: '',
    services: [],
    contact_info: {
      email: '',
      phone: '',
      address: ''
    },
    social_links: {
      website: '',
      linkedin: '',
      twitter: '',
      github: '',
      instagram: '',
      facebook: ''
    },
    is_public: false,
    slug: '',
    theme_settings: {
      primary_color: '#3B82F6',
      secondary_color: '#8B5CF6',
      accent_color: '#10B981'
    },
    portfolio_items: [],
    hero_image: '',
    profile_image: '',
    logo: '',
    tools: [],
    testimonials: []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newService, setNewService] = useState('');
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    image: '',
    tech: [],
    link: ''
  });
  const [showAddItem, setShowAddItem] = useState(false);
  const [newTool, setNewTool] = useState('');
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    company: '',
    text: '',
    rating: 5,
    image: ''
  });
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, [user]);

  const loadPortfolio = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await database.getPortfolio(user.id);
    
    if (!error && data) {
      setPortfolio(data);
    } else {
      // Set default values for new portfolio
      setPortfolio(prev => ({
        ...prev,
        business_name: user.name || '',
        contact_info: {
          ...prev.contact_info,
          email: user.email || ''
        },
        slug: generateSlug(user.name || user.email || '')
      }));
    }
    setLoading(false);
  };

  const generateSlug = (name: string) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 20);
    
    // Add user ID to make it unique
    return `${baseSlug}-${user?.id?.substring(0, 8) || Date.now().toString(36)}`;
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Ensure slug is unique and valid
      if (!portfolio.slug) {
        portfolio.slug = generateSlug(portfolio.business_name || user.name || user.email);
      }
      
      // Ensure user_id is set
      portfolio.user_id = user.id;
      
      const { data, error } = await database.createOrUpdatePortfolio(portfolio);
      
      if (!error && data) {
        setPortfolio(data);
        alert('Portfolio saved successfully!');
      } else {
        console.error('Save error:', error);
        alert('Error saving portfolio. Please try again.');
      }
    } catch (error) {
      console.error('Save portfolio error:', error);
      alert('Error saving portfolio. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addService = () => {
    if (newService.trim()) {
      setPortfolio(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    setPortfolio(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addPortfolioItem = () => {
    if (newPortfolioItem.title && newPortfolioItem.description) {
      setPortfolio(prev => ({
        ...prev,
        portfolio_items: [...prev.portfolio_items, {
          ...newPortfolioItem,
          tech: newPortfolioItem.tech.filter(t => t.trim())
        }]
      }));
      setNewPortfolioItem({
        title: '',
        description: '',
        image: '',
        tech: [],
        link: ''
      });
      setShowAddItem(false);
    }
  };

  const removePortfolioItem = (index: number) => {
    setPortfolio(prev => ({
      ...prev,
      portfolio_items: prev.portfolio_items.filter((_, i) => i !== index)
    }));
  };

  const addTool = () => {
    if (newTool.trim()) {
      setPortfolio(prev => ({
        ...prev,
        tools: [...(prev.tools || []), newTool.trim()]
      }));
      setNewTool('');
    }
  };

  const removeTool = (index: number) => {
    setPortfolio(prev => ({
      ...prev,
      tools: (prev.tools || []).filter((_, i) => i !== index)
    }));
  };

  const addTestimonial = () => {
    if (newTestimonial.name && newTestimonial.text) {
      setPortfolio(prev => ({
        ...prev,
        testimonials: [...(prev.testimonials || []), newTestimonial]
      }));
      setNewTestimonial({
        name: '',
        company: '',
        text: '',
        rating: 5,
        image: ''
      });
      setShowAddTestimonial(false);
    }
  };

  const removeTestimonial = (index: number) => {
    setPortfolio(prev => ({
      ...prev,
      testimonials: (prev.testimonials || []).filter((_, i) => i !== index)
    }));
  };

  const copyPortfolioLink = () => {
    if (portfolio.slug && portfolio.is_public) {
      const link = `${window.location.origin}/portfolio/${portfolio.slug}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const previewPortfolio = () => {
    if (portfolio.slug) {
      const link = `${window.location.origin}/portfolio/${portfolio.slug}`;
      window.open(link, '_blank');
    } else {
      alert('Please save your portfolio first to generate a preview link.');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'portfolio', label: 'Portfolio Items', icon: Award },
    { id: 'tools', label: 'Tools & Tech', icon: Code },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'contact', label: 'Contact & Social', icon: Mail },
    { id: 'design', label: 'Design & Theme', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Portfolio Builder</h1>
          <p className="text-slate-600 dark:text-gray-400 mt-1">Create a stunning portfolio to showcase your work</p>
        </div>
        <div className="flex space-x-3">
          {portfolio.slug && portfolio.is_public && (
            <>
              <button
                onClick={previewPortfolio}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={copyPortfolioLink}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Share Link'}</span>
              </button>
            </>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Portfolio</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={portfolio.business_name}
                    onChange={(e) => setPortfolio(prev => ({ ...prev, business_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your Business Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={portfolio.tagline}
                    onChange={(e) => setPortfolio(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your catchy tagline"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={portfolio.description}
                  onChange={(e) => setPortfolio(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-32 resize-none dark:bg-gray-700 dark:text-white"
                  placeholder="Tell visitors about your business..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ImageUpload
                  onImageUpload={(url) => setPortfolio(prev => ({ ...prev, logo: url }))}
                  currentImage={portfolio.logo}
                  label="Logo"
                />
                <ImageUpload
                  onImageUpload={(url) => setPortfolio(prev => ({ ...prev, profile_image: url }))}
                  currentImage={portfolio.profile_image}
                  label="Profile Image"
                />
                <ImageUpload
                  onImageUpload={(url) => setPortfolio(prev => ({ ...prev, hero_image: url }))}
                  currentImage={portfolio.hero_image}
                  label="Hero Background"
                />
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Add Service
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addService()}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., Web Development, Consulting..."
                  />
                  <button
                    onClick={addService}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {portfolio.services.map((service: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                      <span className="text-slate-800 dark:text-white">{service}</span>
                      <button
                        onClick={() => removeService(index)}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Portfolio Items</h3>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.portfolio_items.map((item: any, index: number) => (
                  <div key={index} className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 border dark:border-gray-600">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-gray-400 mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tech.map((tech: string, techIndex: number) => (
                        <span key={techIndex} className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => removePortfolioItem(index)}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Item Modal */}
              {showAddItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Add Portfolio Item</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Title *</label>
                        <input
                          type="text"
                          value={newPortfolioItem.title}
                          onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Project title"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Description *</label>
                        <textarea
                          value={newPortfolioItem.description}
                          onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none dark:bg-gray-700 dark:text-white"
                          placeholder="Project description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Image URL</label>
                        <input
                          type="url"
                          value={newPortfolioItem.image}
                          onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Technologies (comma-separated)</label>
                        <input
                          type="text"
                          value={newPortfolioItem.tech.join(', ')}
                          onChange={(e) => setNewPortfolioItem(prev => ({ 
                            ...prev, 
                            tech: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                          }))}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Project Link</label>
                        <input
                          type="url"
                          value={newPortfolioItem.link}
                          onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, link: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          placeholder="https://project-demo.com"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={addPortfolioItem}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add Item
                      </button>
                      <button
                        onClick={() => setShowAddItem(false)}
                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                  Add Tool/Technology
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTool()}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., React, Node.js, Python..."
                  />
                  <button
                    onClick={addTool}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Tools & Technologies</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(portfolio.tools || []).map((tool: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                      <span className="text-slate-800 dark:text-white">{tool}</span>
                      <button
                        onClick={() => removeTool(index)}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Client Testimonials</h3>
                <button
                  onClick={() => setShowAddTestimonial(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(portfolio.testimonials || []).map((testimonial: any, index: number) => (
                  <div key={index} className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4 border dark:border-gray-600">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <button
                        onClick={() => removeTestimonial(index)}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-600 dark:text-gray-400 text-sm mb-3 italic">"{testimonial.text}"</p>
                    <div className="flex items-center space-x-3">
                      {testimonial.image && (
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">{testimonial.name}</p>
                        <p className="text-sm text-slate-600 dark:text-gray-400">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Testimonial Modal */}
              {showAddTestimonial && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Add Testimonial</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Client Name *</label>
                        <input
                          type="text"
                          value={newTestimonial.name}
                          onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Client name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Company</label>
                        <input
                          type="text"
                          value={newTestimonial.company}
                          onChange={(e) => setNewTestimonial(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Company name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Testimonial *</label>
                        <textarea
                          value={newTestimonial.text}
                          onChange={(e) => setNewTestimonial(prev => ({ ...prev, text: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none dark:bg-gray-700 dark:text-white"
                          placeholder="What did the client say about your work?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Rating</label>
                        <select
                          value={newTestimonial.rating}
                          onChange={(e) => setNewTestimonial(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">Client Photo URL</label>
                        <input
                          type="url"
                          value={newTestimonial.image}
                          onChange={(e) => setNewTestimonial(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={addTestimonial}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add Testimonial
                      </button>
                      <button
                        onClick={() => setShowAddTestimonial(false)}
                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={portfolio.contact_info.email}
                      onChange={(e) => setPortfolio(prev => ({
                        ...prev,
                        contact_info: { ...prev.contact_info, email: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={portfolio.contact_info.phone}
                      onChange={(e) => setPortfolio(prev => ({
                        ...prev,
                        contact_info: { ...prev.contact_info, phone: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Address</label>
                  <textarea
                    value={portfolio.contact_info.address}
                    onChange={(e) => setPortfolio(prev => ({
                      ...prev,
                      contact_info: { ...prev.contact_info, address: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 resize-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(portfolio.social_links).map(([platform, url]) => (
                    <div key={platform}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 capitalize">
                        {platform}
                      </label>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => setPortfolio(prev => ({
                          ...prev,
                          social_links: { ...prev.social_links, [platform]: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        placeholder={`https://${platform}.com/yourprofile`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Color Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Primary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={portfolio.theme_settings.primary_color}
                        onChange={(e) => setPortfolio(prev => ({
                          ...prev,
                          theme_settings: { ...prev.theme_settings, primary_color: e.target.value }
                        }))}
                        className="w-12 h-10 border border-slate-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={portfolio.theme_settings.primary_color}
                        onChange={(e) => setPortfolio(prev => ({
                          ...prev,
                          theme_settings: { ...prev.theme_settings, primary_color: e.target.value }
                        }))}
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Secondary Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={portfolio.theme_settings.secondary_color}
                        onChange={(e) => setPortfolio(prev => ({
                          ...prev,
                          theme_settings: { ...prev.theme_settings, secondary_color: e.target.value }
                        }))}
                        className="w-12 h-10 border border-slate-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={portfolio.theme_settings.secondary_color}
                        onChange={(e) => setPortfolio(prev => ({
                          ...prev,
                          theme_settings: { ...prev.theme_settings, secondary_color: e.target.value }
                        }))}
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Accent Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={portfolio.theme_settings.accent_color}
                        onChange={(e) => setPortfolio(prev => ({
                          ...prev,
                          theme_settings: { ...prev.theme_settings, accent_color: e.target.value }
                        }))}
                        className="w-12 h-10 border border-slate-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={portfolio.theme_settings.accent_color}
                        onChange={(e) => setPortfolio(prev => ({
                          ...prev,
                          theme_settings: { ...prev.theme_settings, accent_color: e.target.value }
                        }))}
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Color Preview</h4>
                <div className="flex space-x-4">
                  <div 
                    className="w-16 h-16 rounded-lg border border-slate-200 dark:border-gray-600"
                    style={{ backgroundColor: portfolio.theme_settings.primary_color }}
                  />
                  <div 
                    className="w-16 h-16 rounded-lg border border-slate-200 dark:border-gray-600"
                    style={{ backgroundColor: portfolio.theme_settings.secondary_color }}
                  />
                  <div 
                    className="w-16 h-16 rounded-lg border border-slate-200 dark:border-gray-600"
                    style={{ backgroundColor: portfolio.theme_settings.accent_color }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Portfolio Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                      Portfolio URL Slug
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-600 dark:text-gray-400">{window.location.origin}/portfolio/</span>
                      <input
                        type="text"
                        value={portfolio.slug}
                        onChange={(e) => setPortfolio(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        placeholder="your-portfolio-name"
                      />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                      This will be your portfolio's public URL. Use only lowercase letters, numbers, and hyphens.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">Make Portfolio Public</h4>
                      <p className="text-sm text-slate-600 dark:text-gray-400">Allow others to view your portfolio</p>
                    </div>
                    <button
                      onClick={() => setPortfolio(prev => ({ ...prev, is_public: !prev.is_public }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        portfolio.is_public ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          portfolio.is_public ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {portfolio.is_public && portfolio.slug && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Portfolio is Live!</h4>
                      <p className="text-green-700 dark:text-green-400 text-sm mb-3">
                        Your portfolio is now publicly accessible at:
                      </p>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 rounded text-sm">
                          {window.location.origin}/portfolio/{portfolio.slug}
                        </code>
                        <button
                          onClick={copyPortfolioLink}
                          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilder;