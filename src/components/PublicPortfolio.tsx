import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  Star,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Globe,
  Award,
  Settings,
  Heart,
  ChevronRight,
  Quote
} from "lucide-react";
import { database } from "../lib/database";

interface Portfolio {
  id: string;
  user_id: string;
  slug: string;
  business_name: string;
  tagline?: string;
  description?: string;
  services: Array<{ title: string; description: string }>;
  tools: string[];
  testimonials: Array<{ name: string; role: string; message: string }>;
  contact_info: {
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
  };
  social_links: { [key: string]: string };
  theme_settings: {
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    font_family?: string;
    layout?: string;
    dark_mode?: boolean;
  };
  portfolio_items: Array<{
    title: string;
    description: string;
    image?: string;
    link?: string;
    technologies?: string[];
  }>;
  stats?: {
    projects_completed?: number;
    clients_served?: number;
    years_experience?: number;
    success_rate?: number;
  };
  logo?: string;
  profile_image?: string;
  hero_image?: string;
  created_at: string;
  updated_at: string;
}

export default function PublicPortfolio({ slug }: { slug: string }) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const fetchPortfolio = async () => {
      const data = await database.getPortfolioBySlug(slug);
      setPortfolio(data.data);
      setLoading(false);
    };
    fetchPortfolio();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      let currentSection = "home";
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          currentSection = section.id;
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-blue-800 font-medium">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">The portfolio you're looking for doesn't exist or may have been moved.</p>
          <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  const theme = portfolio.theme_settings;

  const socialIcons: Record<string, JSX.Element> = {
    github: <Github className="w-5 h-5" />,
    twitter: <Twitter className="w-5 h-5" />,
    linkedin: <Linkedin className="w-5 h-5" />,
    facebook: <Facebook className="w-5 h-5" />,
    instagram: <Instagram className="w-5 h-5" />,
    website: <Globe className="w-5 h-5" />,
  };

  // Navigation items
  const navItems = [
    { id: "home", label: "Home" },
    portfolio.services?.length > 0 && { id: "services", label: "Services" },
    portfolio.portfolio_items?.length > 0 && { id: "portfolio", label: "Portfolio" },
    portfolio.tools?.length > 0 && { id: "tools", label: "Tools" },
    portfolio.testimonials?.length > 0 && { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" }
  ].filter(Boolean);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: theme.dark_mode ? "#111827" : "#f8fafc",
        color: theme.dark_mode ? "#F9FAFB" : "#334155",
        fontFamily: theme.font_family || "Inter, sans-serif",
      }}
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {portfolio.logo ? (
                <img src={portfolio.logo} alt="Logo" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              )}
              <span className="ml-3 font-bold text-lg">{portfolio.business_name}</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`px-1 py-2 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header
        id="home"
        className="relative py-24 px-4 text-center overflow-hidden"
        style={{
          backgroundColor: theme.primary_color,
          backgroundImage: portfolio.hero_image ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${portfolio.hero_image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 right-0 h-96 opacity-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          {portfolio.profile_image ? (
            <img
              src={portfolio.profile_image}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/80 shadow-2xl object-cover"
            />
          ) : portfolio.logo ? (
            <img
              src={portfolio.logo}
              alt="Logo"
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/80 shadow-2xl object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 border-4 border-white/80 shadow-2xl">
              <User className="w-16 h-16 text-white" />
            </div>
          )}

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            {portfolio.business_name}
          </h1>
          
          {portfolio.tagline && (
            <p className="text-xl md:text-2xl mb-6 text-blue-100 font-light max-w-3xl mx-auto">
              {portfolio.tagline}
            </p>
          )}
          
          {portfolio.description && (
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
              {portfolio.description}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <a 
              href="#portfolio" 
              className="px-8 py-3 bg-white text-blue-900 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center"
            >
              View Work <ChevronRight className="ml-2 h-5 w-5" />
            </a>
            <a 
              href="#contact" 
              className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Get In Touch
            </a>
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/90">
            {portfolio.contact_info.email && (
              <a
                href={`mailto:${portfolio.contact_info.email}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
              >
                <Mail className="w-5 h-5" /> {portfolio.contact_info.email}
              </a>
            )}
            {portfolio.contact_info.phone && (
              <a
                href={`tel:${portfolio.contact_info.phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
              >
                <Phone className="w-5 h-5" /> {portfolio.contact_info.phone}
              </a>
            )}
            {portfolio.contact_info.location && (
              <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <MapPin className="w-5 h-5" /> {portfolio.contact_info.location}
              </span>
            )}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-8">
            {Object.entries(portfolio.social_links || {}).map(
              ([key, url]) =>
                url && (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition transform hover:scale-110"
                  >
                    {socialIcons[key] || <ExternalLink className="w-6 h-6" />}
                  </a>
                )
            )}
          </div>
        </div>
      </header>

      {/* Stats */}
      {portfolio.stats && (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
            {portfolio.stats.projects_completed !== undefined && (
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{portfolio.stats.projects_completed}+</h3>
                <p className="text-gray-600 dark:text-gray-300">Projects Completed</p>
              </div>
            )}
            {portfolio.stats.clients_served !== undefined && (
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{portfolio.stats.clients_served}+</h3>
                <p className="text-gray-600 dark:text-gray-300">Happy Clients</p>
              </div>
            )}
            {portfolio.stats.years_experience !== undefined && (
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{portfolio.stats.years_experience}+</h3>
                <p className="text-gray-600 dark:text-gray-300">Years Experience</p>
              </div>
            )}
            {portfolio.stats.success_rate !== undefined && (
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{portfolio.stats.success_rate}%</h3>
                <p className="text-gray-600 dark:text-gray-300">Success Rate</p>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* Services */}
        {portfolio.services?.length > 0 && (
          <section id="services" className="scroll-mt-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Services</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Here's what I can do to help you achieve your goals
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {portfolio.services.map((service, i) => (
                <div 
                  key={i} 
                  className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6">
                    <Star className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Portfolio Items */}
        {portfolio.portfolio_items?.length > 0 && (
          <section id="portfolio" className="scroll-mt-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Featured Work</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A selection of projects I've worked on
              </p>
            </div>
            
            <div className="grid gap-8">
              {portfolio.portfolio_items.map((item, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="md:flex">
                    {item.image && (
                      <div className="md:flex-shrink-0 md:w-1/3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-64 w-full md:h-full md:w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                      
                      {item.technologies && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {item.technologies.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" /> View Project
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tools */}
        {portfolio.tools?.length > 0 && (
          <section id="tools" className="scroll-mt-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Tools & Technologies</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Technologies I use to bring ideas to life
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {portfolio.tools.map((tool, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-center"
                >
                  <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-sm font-medium text-center">{tool}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {portfolio.testimonials?.length > 0 && (
          <section id="testimonials" className="scroll-mt-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Client Testimonials</h2>
              <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                What people I've worked with have to say
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              {portfolio.testimonials.map((t, i) => (
                <div 
                  key={i} 
                  className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Quote className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-4 rotate-180" />
                  <p className="text-lg italic mb-6">"{t.message}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      {t.role && <p className="text-sm text-gray-600 dark:text-gray-400">{t.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have a project in mind? Let's work together!
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                
                <div className="space-y-4">
                  {portfolio.contact_info.email && (
                    <a
                      href={`mailto:${portfolio.contact_info.email}`}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600 dark:text-gray-300">{portfolio.contact_info.email}</p>
                      </div>
                    </a>
                  )}
                  
                  {portfolio.contact_info.phone && (
                    <a
                      href={`tel:${portfolio.contact_info.phone}`}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                    >
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600 dark:text-gray-300">{portfolio.contact_info.phone}</p>
                      </div>
                    </a>
                  )}
                  
                  {portfolio.contact_info.location && (
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-gray-600 dark:text-gray-300">{portfolio.contact_info.location}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4 mt-8">
                  {Object.entries(portfolio.social_links || {}).map(
                    ([key, url]) =>
                      url && (
                        <a
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                        >
                          {socialIcons[key] || <ExternalLink className="w-6 h-6" />}
                        </a>
                      )
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Your Message</label>
                    <textarea 
                      id="message" 
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
                      placeholder="How can I help you?"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {portfolio.logo ? (
            <img src={portfolio.logo} alt="Logo" className="h-16 w-16 mx-auto mb-6 rounded-full object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
              <User className="h-8 w-8 text-white" />
            </div>
          )}
          
          <h3 className="text-2xl font-bold mb-4">{portfolio.business_name}</h3>
          
          {portfolio.tagline && (
            <p className="max-w-2xl mx-auto text-gray-400 mb-8">{portfolio.tagline}</p>
          )}
          
          <div className="flex justify-center gap-6 mb-8">
            {Object.entries(portfolio.social_links || {}).map(
              ([key, url]) =>
                url && (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
                  >
                    {socialIcons[key] || <ExternalLink className="w-5 h-5" />}
                  </a>
                )
            )}
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>
              © {new Date().getFullYear()} {portfolio.business_name}. All rights reserved.
            </p>
            
            {portfolio.contact_info.website && (
              <a
                href={portfolio.contact_info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 md:mt-0 text-blue-400 hover:text-blue-300"
              >
                <Globe className="w-4 h-4" /> Visit Website
              </a>
            )}
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}