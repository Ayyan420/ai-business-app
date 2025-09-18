import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Target, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Zap,
  Shield,
  Clock,
  Globe,
  Sparkles,
  Rocket,
  Award,
  Play,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Send,
  Heart,
  Code,
  Palette,
  Coffee,
  Lightbulb
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: 'AI-Powered Marketing',
      description: 'Generate compelling ad copy, social media content, and email campaigns that convert. Our AI analyzes your brand voice and creates content that resonates with your audience.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      delay: 'delay-100'
    },
    {
      icon: DollarSign,
      title: 'Smart Finance Management',
      description: 'Create professional invoices, track expenses, and get financial insights. Automate your billing process and never miss a payment again.',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      delay: 'delay-200'
    },
    {
      icon: Target,
      title: 'Strategic Planning',
      description: 'Develop growth strategies, analyze competitors, and make data-driven decisions. Get personalized recommendations for scaling your business.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      delay: 'delay-300'
    },
    {
      icon: BarChart3,
      title: 'Operations Optimization',
      description: 'Streamline workflows, manage tasks, and boost productivity. Our AI identifies bottlenecks and suggests improvements for maximum efficiency.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      delay: 'delay-400'
    }
  ];

  const benefits = [
    { icon: Zap, text: 'Save 10+ hours per week on routine tasks', delay: 'delay-100' },
    { icon: TrendingUp, text: 'Increase revenue by up to 40% with AI insights', delay: 'delay-200' },
    { icon: Users, text: 'Scale your team\'s productivity effortlessly', delay: 'delay-300' },
    { icon: Shield, text: 'Enterprise-grade security and data protection', delay: 'delay-400' },
    { icon: Clock, text: '24/7 AI assistant ready to help', delay: 'delay-500' },
    { icon: Globe, text: 'Works with businesses of all sizes globally', delay: 'delay-600' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      content: 'This AI assistant transformed our marketing efforts. We\'ve seen a 300% increase in lead generation since implementing their tools.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Michael Chen',
      role: 'Founder, GrowthLab',
      content: 'The financial tools alone saved us thousands in accounting fees. The invoice automation is a game-changer for our cash flow.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director, ScaleUp',
      content: 'I can create a month\'s worth of social media content in just 30 minutes. The AI understands our brand voice perfectly.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Active Users', delay: 'delay-100' },
    { number: '1M+', label: 'Content Generated', delay: 'delay-200' },
    { number: '99.9%', label: 'Uptime', delay: 'delay-300' },
    { number: '24/7', label: 'Support', delay: 'delay-400' }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message
    alert('Thank you for your message! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Business Assistant
                </h1>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Home</a>
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">About Us</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors font-medium">Contact</a>
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-bounce-in">
              <Sparkles className="w-4 h-4" />
              <span>🎉 Now with Advanced AI Integration</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              Your Complete
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                AI Business
              </span>
              Command Center
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Transform your business operations with our comprehensive AI-powered platform. 
              Generate marketing content, manage finances, plan strategies, and optimize operations 
              - all from one intelligent dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={onGetStarted}
                className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <Rocket className="w-6 h-6 group-hover:animate-pulse" />
                <span className="text-lg font-semibold">Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="flex items-center space-x-2 px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-200">
                <Play className="w-5 h-5" />
                <span className="font-medium">Watch Demo</span>
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center animate-fade-in ${stat.delay}`}>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">About Our Mission</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're passionate about empowering businesses with cutting-edge AI technology that makes complex tasks simple and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-slate-800">Transforming Business Operations</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Founded by a team of AI experts and business professionals, we understand the challenges modern businesses face. 
                Our platform combines the power of artificial intelligence with intuitive design to create solutions that actually work.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                From startups to enterprises, we've helped thousands of businesses automate their workflows, 
                increase productivity, and achieve sustainable growth through intelligent automation.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 mb-2">5+</div>
                  <div className="text-sm text-slate-600">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600 mb-2">98%</div>
                  <div className="text-sm text-slate-600">Customer Satisfaction</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 transform hover:scale-105 transition-transform duration-300">
                  <Code className="w-8 h-8 text-blue-600 mb-4" />
                  <h4 className="font-semibold text-slate-800 mb-2">Innovation</h4>
                  <p className="text-slate-600 text-sm">Cutting-edge AI technology</p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-100 to-green-200 transform hover:scale-105 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-green-600 mb-4" />
                  <h4 className="font-semibold text-slate-800 mb-2">Passion</h4>
                  <p className="text-slate-600 text-sm">Dedicated to your success</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 transform hover:scale-105 transition-transform duration-300">
                  <Lightbulb className="w-8 h-8 text-purple-600 mb-4" />
                  <h4 className="font-semibold text-slate-800 mb-2">Vision</h4>
                  <p className="text-slate-600 text-sm">Future-focused solutions</p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 transform hover:scale-105 transition-transform duration-300">
                  <Coffee className="w-8 h-8 text-orange-600 mb-4" />
                  <h4 className="font-semibold text-slate-800 mb-2">Support</h4>
                  <p className="text-slate-600 text-sm">Always here to help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Customer First', description: 'Every decision we make is centered around delivering value to our customers.' },
              { title: 'Innovation', description: 'We continuously push the boundaries of what\'s possible with AI technology.' },
              { title: 'Transparency', description: 'We believe in honest communication and transparent business practices.' }
            ].map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-300">
                <h4 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h4>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Powerful Features for Every Business Need</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our comprehensive suite of AI-powered tools covers every aspect of your business operations
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className={`group flex items-start space-x-6 p-8 bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-500 animate-fade-in ${feature.delay}`}>
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Trusted by Industry Leaders</h2>
            <p className="text-xl text-slate-600">See what our customers are saying about their success</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200">
              <div className="flex items-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-2xl md:text-3xl text-slate-700 font-medium mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex items-center space-x-4">
                <img 
                  src={testimonials[currentTestimonial].avatar} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-800 text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-slate-600">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-600 w-8' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Get In Touch</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Email</p>
                      <p className="text-slate-600">support@aibusinessassistant.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Phone</p>
                      <p className="text-slate-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Address</p>
                      <p className="text-slate-600">123 Business Ave, Tech City, TC 12345</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Business Hours</h4>
                <div className="space-y-1 text-blue-700">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-8 border border-slate-200 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  <span className="font-semibold">Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
            Join thousands of successful businesses using our AI-powered platform to scale and grow.
          </p>
          <button
            onClick={onGetStarted}
            className="group px-12 py-6 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            <span className="flex items-center space-x-3">
              <span>Start Your Free Trial Today</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
          <p className="text-blue-200 mt-6 text-lg">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">AI Business Assistant</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                Empowering businesses with intelligent automation and AI-driven insights for unprecedented growth.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <span className="text-sm">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <span className="text-sm">t</span>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors">
                  <span className="text-sm">in</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Product</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 AI Business Assistant. All rights reserved. Built with ❤️ for entrepreneurs worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;