import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../lib/database';
import { ExternalLink, Mail, Phone, MapPin, Calendar, User, Briefcase, Award, Star } from 'lucide-react';

interface Portfolio {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  description: string;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  contact: {
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
  };
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  created_at: string;
  updated_at: string;
}

export default function PublicPortfolio() {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!slug) {
        setError('Portfolio not found');
        setLoading(false);
        return;
      }

      try {
        const portfolioData = await database.getPortfolioBySlug(slug);
        setPortfolio(portfolioData);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Portfolio not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-600">The portfolio you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const themeStyles = {
    '--primary-color': portfolio.theme.primaryColor,
    '--bg-color': portfolio.theme.backgroundColor,
    '--text-color': portfolio.theme.textColor,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen" style={{ backgroundColor: portfolio.theme.backgroundColor, color: portfolio.theme.textColor, ...themeStyles }}>
      {/* Header */}
      <header className="py-16 px-4" style={{ backgroundColor: portfolio.theme.primaryColor }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{portfolio.title}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">{portfolio.description}</p>
          
          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/90">
            {portfolio.contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{portfolio.contact.email}</span>
              </div>
            )}
            {portfolio.contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{portfolio.contact.phone}</span>
              </div>
            )}
            {portfolio.contact.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{portfolio.contact.location}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Skills */}
        {portfolio.skills && portfolio.skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="w-6 h-6" style={{ color: portfolio.theme.primaryColor }} />
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {portfolio.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: portfolio.theme.primaryColor + '20',
                    color: portfolio.theme.primaryColor,
                    border: `1px solid ${portfolio.theme.primaryColor}40`
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6" style={{ color: portfolio.theme.primaryColor }} />
              Projects
            </h2>
            <div className="grid gap-6">
              {portfolio.projects.map((project, index) => (
                <div key={index} className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6" style={{ color: portfolio.theme.primaryColor }} />
              Experience
            </h2>
            <div className="space-y-6">
              {portfolio.experience.map((exp, index) => (
                <div key={index} className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{exp.position}</h3>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium mb-3">{exp.company}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {portfolio.education && portfolio.education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6" style={{ color: portfolio.theme.primaryColor }} />
              Education
            </h2>
            <div className="space-y-4">
              {portfolio.education.map((edu, index) => (
                <div key={index} className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-500">{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center text-gray-500">
          <p>© {new Date().getFullYear()} {portfolio.title}. All rights reserved.</p>
          {portfolio.contact.website && (
            <a
              href={portfolio.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Website
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}