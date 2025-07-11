import React from 'react';
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
  Globe
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: TrendingUp,
      title: 'AI-Powered Marketing',
      description: 'Generate compelling ad copy, social media content, and email campaigns that convert. Our AI analyzes your brand voice and creates content that resonates with your audience.',
      color: 'text-blue-600'
    },
    {
      icon: DollarSign,
      title: 'Smart Finance Management',
      description: 'Create professional invoices, track expenses, and get financial insights. Automate your billing process and never miss a payment again.',
      color: 'text-green-600'
    },
    {
      icon: Target,
      title: 'Strategic Planning',
      description: 'Develop growth strategies, analyze competitors, and make data-driven decisions. Get personalized recommendations for scaling your business.',
      color: 'text-purple-600'
    },
    {
      icon: BarChart3,
      title: 'Operations Optimization',
      description: 'Streamline workflows, manage tasks, and boost productivity. Our AI identifies bottlenecks and suggests improvements for maximum efficiency.',
      color: 'text-orange-600'
    }
  ];

  const benefits = [
    { icon: Zap, text: 'Save 10+ hours per week on routine tasks' },
    { icon: TrendingUp, text: 'Increase revenue by up to 40% with AI insights' },
    { icon: Users, text: 'Scale your team\'s productivity effortlessly' },
    { icon: Shield, text: 'Enterprise-grade security and data protection' },
    { icon: Clock, text: '24/7 AI assistant ready to help' },
    { icon: Globe, text: 'Works with businesses of all sizes globally' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechStart Inc.',
      content: 'This AI assistant transformed our marketing efforts. We\'ve seen a 300% increase in lead generation since implementing their tools.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Founder, GrowthLab',
      content: 'The financial tools alone saved us thousands in accounting fees. The invoice automation is a game-changer for our cash flow.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Director, ScaleUp',
      content: 'I can create a month\'s worth of social media content in just 30 minutes. The AI understands our brand voice perfectly.',
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '5 Content Generations',
        '2 Invoices',
        '1 Campaign',
        '10 Tasks',
        'Email Support'
      ],
      popular: false
    },
    {
      name: 'Starter',
      price: '$2',
      period: '/month',
      description: 'Ideal for small businesses',
      features: [
        '50 Content Generations',
        '25 Invoices',
        '10 Campaigns',
        '100 Tasks',
        'Priority Support',
        'Basic Team Features'
      ],
      popular: true
    },
    {
      name: 'Professional',
      price: '$5',
      period: '/month',
      description: 'For growing businesses',
      features: [
        'Unlimited Everything',
        'Advanced Analytics',
        'Team Collaboration',
        'Custom Branding',
        'Portfolio Builder',
        'CRM & Lead Management',
        '24/7 Support'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">AI Business Assistant</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-slate-600 hover:text-slate-800 transition-colors">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-800 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-800 transition-colors">Reviews</a>
              <button
                onClick={onGetStarted}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
              Your Complete
              <span className="text-blue-600"> AI Business</span>
              <br />Command Center
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your business operations with our comprehensive AI-powered platform. 
              Generate marketing content, manage finances, plan strategies, and optimize operations 
              - all from one intelligent dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="flex items-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span className="text-lg font-semibold">Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-slate-500">No credit card required • 14-day free trial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose Our AI Assistant?</h2>
            <p className="text-lg text-slate-600">Join thousands of businesses already transforming their operations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-slate-700 font-medium">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Powerful Features for Every Business Need</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools covers every aspect of your business operations
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-6 p-8 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${feature.color} bg-opacity-10`}>
                    <IconComponent className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-lg text-slate-600">See what our customers are saying about their success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-slate-800">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Simple, Affordable Pricing</h2>
            <p className="text-lg text-slate-600">Choose the plan that fits your business needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative p-8 rounded-xl border-2 ${
                plan.popular 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-slate-200 bg-white'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-slate-800">{plan.price}</span>
                    <span className="text-slate-600 ml-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful businesses using our AI-powered platform to scale and grow.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg"
          >
            Start Your Free Trial Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">AI Business Assistant</span>
              </div>
              <p className="text-slate-400">
                Empowering businesses with intelligent automation and AI-driven insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 AI Business Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;