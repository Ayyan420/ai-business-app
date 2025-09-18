import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Calendar,
  User,
  Briefcase,
  Award,
  TrendingUp,
  Share2,
  Copy,
  Check,
  Star,
  Code,
  Palette,
  Zap,
  Heart,
  Download,
  Eye,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  ArrowRight,
  Play,
  ChevronDown,
  Sparkles,
  Send
} from 'lucide-react';
import { database } from '../lib/database';

interface PublicPortfolioProps {
  slug: string;
}

const PublicPortfolio: React.FC<PublicPortfolioProps> = ({ slug }) => {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [isVisible, setIsVisible] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    loadPortfolio(slug);
    setIsVisible(true);
  }, [slug]);

  const loadPortfolio = async (portfolioSlug: string) => {
    setLoading(true);
    
    try {
      console.log('🔍 Loading portfolio with slug:', portfolioSlug);
      const { data, error } = await database.getPortfolioBySlug(portfolioSlug);
      
      if (error || !data) {
        console.error('❌ Portfolio not found:', error);
        setPortfolio(null);
        setLoading(false);
        return;
      }
      
      console.log('✅ Portfolio loaded successfully:', data);
      
      setPortfolio(data);
    } catch (error) {
      console.error('❌ Error loading portfolio:', error);
      setPortfolio(null);
    }
    
    setLoading(false);
  };

  const copyPortfolioLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github': return Github;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      case 'facebook': return Facebook;
      case 'website': return Globe;
      default: return ExternalLink;
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message
    alert('Message sent! Thank you for reaching out.');
    setContactForm({ name: '', email: '', message: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-400 border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-white text-xl font-medium">Loading portfolio...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-slate-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Portfolio Not Found</h1>
          <p className="text-slate-300 mb-6">The portfolio you're looking for doesn't exist or is not public.</p>
          <a 
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Go to Homepage</span>
          </a>
        </div>
      </div>
    );
  }

  const primaryColor = portfolio.theme_settings?.primary_color || '#3B82F6';
  const secondaryColor = portfolio.theme_settings?.secondary_color || '#8B5CF6';
  const accentColor = portfolio.theme_settings?.accent_color || '#10B981';

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20" style={{ backgroundColor: primaryColor }}></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20" style={{ backgroundColor: secondaryColor, animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20" style={{ backgroundColor: accentColor, animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              {portfolio.logo ? (
                <img 
                  src={portfolio.logo} 
                  alt="Logo" 
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <span className="text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                {portfolio.business_name}
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['about', 'services', 'portfolio', 'testimonials', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`capitalize transition-all duration-300 ${
                    activeSection === section 
                      ? 'border-b-2 border-opacity-100' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={{ 
                    color: activeSection === section ? primaryColor : undefined,
                    borderColor: activeSection === section ? primaryColor : undefined
                  }}
                >
                  {section}
                </button>
              ))}
            </div>

            <button
              onClick={copyPortfolioLink}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 z-0">
          {portfolio.hero_image ? (
            <img 
              src={portfolio.hero_image} 
              alt="Hero Background"
              className="w-full h-full object-cover opacity-20"
            />
          ) : (
            <div 
              className="w-full h-full opacity-30"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        </div>
        
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8">
            {portfolio.profile_image ? (
              <img 
                src={portfolio.profile_image}
                alt={portfolio.business_name}
                className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/20 shadow-2xl animate-bounce-in object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/20 shadow-2xl animate-bounce-in flex items-center justify-center" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                <User className="w-16 h-16 text-white" />
              </div>
            )}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {portfolio.business_name}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up">
            {portfolio.tagline}
          </p>
          
          {/* Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {[
              { label: 'Projects', value: portfolio.stats.projects_completed, suffix: '+' },
              { label: 'Clients', value: portfolio.stats.clients_served, suffix: '+' },
              { label: 'Years', value: portfolio.stats.years_experience, suffix: '+' },
              { label: 'Success', value: portfolio.stats.success_rate, suffix: '%' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in" style={{ animationDelay: '1s' }}>
            <button
              onClick={() => setActiveSection('contact')}
              className="group flex items-center space-x-3 px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
            >
              <Mail className="w-5 h-5 group-hover:animate-pulse" />
              <span className="font-semibold">Get In Touch</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => setActiveSection('portfolio')}
              className="flex items-center space-x-2 px-6 py-4 border-2 border-white/20 rounded-xl hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              <Eye className="w-5 h-5" />
              <span>View Work</span>
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-20 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              About Me
            </h2>
            <div className="w-24 h-1 mx-auto rounded-full" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {portfolio.description.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-gray-300 leading-relaxed text-lg animate-slide-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105" style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` }}>
                  <Code className="w-8 h-8 mb-4" style={{ color: primaryColor }} />
                  <h3 className="font-semibold text-white mb-2">Development</h3>
                  <p className="text-gray-400 text-sm">Full-stack solutions</p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105" style={{ background: `linear-gradient(135deg, ${secondaryColor}20, ${accentColor}20)` }}>
                  <Zap className="w-8 h-8 mb-4" style={{ color: secondaryColor }} />
                  <h3 className="font-semibold text-white mb-2">AI Integration</h3>
                  <p className="text-gray-400 text-sm">Smart automation</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105" style={{ background: `linear-gradient(135deg, ${accentColor}20, ${primaryColor}20)` }}>
                  <TrendingUp className="w-8 h-8 mb-4" style={{ color: accentColor }} />
                  <h3 className="font-semibold text-white mb-2">Strategy</h3>
                  <p className="text-gray-400 text-sm">Business growth</p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105" style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` }}>
                  <Palette className="w-8 h-8 mb-4" style={{ color: primaryColor }} />
                  <h3 className="font-semibold text-white mb-2">Design</h3>
                  <p className="text-gray-400 text-sm">User experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive digital solutions to transform your business
            </p>
          </div>
          
          {portfolio.services && portfolio.services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.services.map((service: string, index: number) => (
                <div 
                  key={index} 
                  className="group relative bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10)` }}></div>
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300 text-center">
                      {service}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Services information will be displayed here once added to the portfolio.</p>
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="relative py-20 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Featured Work
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Showcasing some of my best projects and achievements
            </p>
          </div>
          
          {portfolio.portfolio_items && portfolio.portfolio_items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {portfolio.portfolio_items.map((item: any, index: number) => (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-white/5 to-white/10 rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {item.image && (
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      {item.link && (
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <a 
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                          >
                            <ExternalLink className="w-5 h-5 text-white" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    
                    {item.tech && item.tech.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tech.map((tech: string, techIndex: number) => (
                          <span 
                            key={techIndex}
                            className="px-3 py-1 text-sm rounded-full border"
                            style={{ 
                              background: `${primaryColor}20`, 
                              color: primaryColor,
                              borderColor: `${primaryColor}30`
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Portfolio projects will be displayed here once added.</p>
            </div>
          )}
        </div>
      </section>

      {/* Tools & Technologies */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Tools & Technologies
            </h2>
            <p className="text-xl text-gray-300">
              Cutting-edge technologies I use to build amazing solutions
            </p>
          </div>
          
          {portfolio.tools && portfolio.tools.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {portfolio.tools.map((tool: string, index: number) => (
                <div 
                  key={index}
                  className="group bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-medium group-hover:text-blue-400 transition-colors duration-300">
                    {tool}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Tools and technologies will be displayed here once added.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Client Testimonials
            </h2>
            <p className="text-xl text-gray-300">
              What my clients say about working with me
            </p>
          </div>
          
          {portfolio.testimonials && portfolio.testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.testimonials.map((testimonial: any, index: number) => (
                <div 
                  key={index}
                  className="group bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                    />
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Client testimonials will be displayed here once added.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Let's Work Together
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to transform your business? Let's discuss your next project
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Get In Touch</h3>
                
                <div className="space-y-4">
                  {portfolio.contact_info.email && (
                    <div className="flex items-center space-x-4 group">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <a 
                          href={`mailto:${portfolio.contact_info.email}`}
                          className="text-white hover:text-blue-400 transition-colors duration-300 font-medium"
                        >
                          {portfolio.contact_info.email}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {portfolio.contact_info.phone && (
                    <div className="flex items-center space-x-4 group">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: `linear-gradient(to right, ${accentColor}, ${primaryColor})` }}>
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <a 
                          href={`tel:${portfolio.contact_info.phone}`}
                          className="text-white hover:text-green-400 transition-colors duration-300 font-medium"
                        >
                          {portfolio.contact_info.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {portfolio.contact_info.address && (
                    <div className="flex items-center space-x-4 group">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: `linear-gradient(to right, ${secondaryColor}, ${accentColor})` }}>
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Location</p>
                        <p className="text-white font-medium">{portfolio.contact_info.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Social Links */}
              <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Connect With Me</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(portfolio.social_links).map(([platform, url]) => {
                    if (!url) return null;
                    const IconComponent = getSocialIcon(platform);
                    return (
                      <a 
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center space-x-3 p-3 bg-gradient-to-r from-white/5 to-white/10 rounded-lg transition-all duration-300 transform hover:scale-105"
                        style={{ 
                          background: 'linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.1))',
                          ':hover': { background: `linear-gradient(to right, ${primaryColor}20, ${secondaryColor}20)` }
                        }}
                      >
                        <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                        <span className="capitalize text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">
                          {platform}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 text-white placeholder-gray-400"
                    style={{ focusRingColor: primaryColor }}
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 text-white placeholder-gray-400"
                    style={{ focusRingColor: primaryColor }}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 text-white placeholder-gray-400 resize-none"
                    style={{ focusRingColor: primaryColor }}
                    placeholder="Tell me about your project..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              {portfolio.logo ? (
                <img 
                  src={portfolio.logo} 
                  alt="Logo" 
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <span className="text-xl font-bold" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {portfolio.business_name}
              </span>
            </div>
            
            <p className="text-gray-400 mb-6">
              {portfolio.tagline}
            </p>
            
            <div className="flex justify-center space-x-6 mb-6">
              {Object.entries(portfolio.social_links).map(([platform, url]) => {
                if (!url) return null;
                const IconComponent = getSocialIcon(platform);
                return (
                  <a 
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group"
                  >
                    <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 {portfolio.business_name}. All rights reserved. Built with ❤️ for amazing clients.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPortfolio;