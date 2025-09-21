import React, { useState, useEffect } from 'react';
import { database } from '../lib/database';
import { ExternalLink, Mail, Phone, MapPin, Calendar, User, Briefcase, Award, Star } from 'lucide-react';

interface PublicPortfolioProps {
  slug: string;
}

export default function PublicPortfolio({ slug }: PublicPortfolioProps) {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPortfolio();
  }, [slug]);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const { data, error } = await database.getPortfolioBySlug(slug);
      if (error) {
        setError(error);
      } else {
        setPortfolio(data);
      }
    } catch (err) {
      setError('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Not Found</h1>
          <p className="text-gray-600">The portfolio you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const theme = portfolio.theme_settings || {};
  const primaryColor = theme.primaryColor || '#3B82F6';
  const secondaryColor = theme.secondaryColor || '#1F2937';

  return (
    <div className="min-h-screen bg-gray-50">
      <style>
        {`
          .portfolio-primary { color: ${primaryColor}; }
          .portfolio-bg-primary { background-color: ${primaryColor}; }
          .portfolio-border-primary { border-color: ${primaryColor}; }
          .portfolio-secondary { color: ${secondaryColor}; }
        `}
      </style>

      {/* Header */}
      <header className="portfolio-bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {portfolio.profile_image && (
            <img
              src={portfolio.profile_image}
              alt={portfolio.business_name}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
            />
          )}
          <h1 className="text-4xl font-bold mb-4">{portfolio.business_name}</h1>
          {portfolio.tagline && (
            <p className="text-xl opacity-90 mb-6">{portfolio.tagline}</p>
          )}
          {portfolio.description && (
            <p className="text-lg opacity-80 max-w-2xl mx-auto">{portfolio.description}</p>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Contact Information */}
        {portfolio.contact_info && Object.keys(portfolio.contact_info).length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold portfolio-secondary mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {portfolio.contact_info.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 portfolio-primary" />
                  <a href={`mailto:${portfolio.contact_info.email}`} className="portfolio-primary hover:underline">
                    {portfolio.contact_info.email}
                  </a>
                </div>
              )}
              {portfolio.contact_info.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 portfolio-primary" />
                  <a href={`tel:${portfolio.contact_info.phone}`} className="portfolio-primary hover:underline">
                    {portfolio.contact_info.phone}
                  </a>
                </div>
              )}
              {portfolio.contact_info.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 portfolio-primary" />
                  <span className="text-gray-700">{portfolio.contact_info.address}</span>
                </div>
              )}
              {portfolio.contact_info.website && (
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 portfolio-primary" />
                  <a href={portfolio.contact_info.website} target="_blank" rel="noopener noreferrer" className="portfolio-primary hover:underline">
                    {portfolio.contact_info.website}
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Services */}
        {portfolio.services && portfolio.services.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold portfolio-secondary mb-6">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.services.map((service: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold portfolio-secondary mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  {service.price && (
                    <p className="portfolio-primary font-semibold">{service.price}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Portfolio Items */}
        {portfolio.portfolio_items && portfolio.portfolio_items.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold portfolio-secondary mb-6">Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.portfolio_items.map((item: any, index: number) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold portfolio-secondary mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="portfolio-primary hover:underline flex items-center gap-1">
                        View Project <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tools */}
        {portfolio.tools && portfolio.tools.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold portfolio-secondary mb-6">Tools & Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {portfolio.tools.map((tool: string, index: number) => (
                <span key={index} className="bg-white px-4 py-2 rounded-full border portfolio-border-primary portfolio-primary font-medium">
                  {tool}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {portfolio.testimonials && portfolio.testimonials.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold portfolio-secondary mb-6">Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < (testimonial.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    {testimonial.avatar && (
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full" />
                    )}
                    <div>
                      <p className="font-semibold portfolio-secondary">{testimonial.name}</p>
                      {testimonial.company && (
                        <p className="text-sm text-gray-600">{testimonial.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {portfolio.social_links && Object.keys(portfolio.social_links).length > 0 && (
          <section className="text-center">
            <h2 className="text-2xl font-bold portfolio-secondary mb-6">Connect With Me</h2>
            <div className="flex justify-center gap-4">
              {Object.entries(portfolio.social_links).map(([platform, url]: [string, any]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity capitalize"
                >
                  {platform}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}