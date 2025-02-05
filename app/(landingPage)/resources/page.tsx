import React from 'react';
import { 
  FileText, Video, Book, 
  Download, HelpCircle, 
  TrendingUp, Award, 
  User, Target 
} from 'lucide-react';

const ResourcesPage = () => {
  const resourceSections = [
    {
      title: 'Resume Guides',
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      links: [
        'Ultimate Resume Writing Guide',
        'Resume Format Strategies',
        'Industry-Specific Resume Tips'
      ]
    },
    {
      title: 'Video Tutorials',
      icon: <Video className="w-8 h-8 text-green-500" />,
      links: [
        'Resume Writing Masterclass',
        'AI Tools Explained',
        'Interview Preparation Workshop'
      ]
    },
    {
      title: 'Career Development',
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
      links: [
        'Career Growth Strategies',
        'Networking Techniques',
        'Personal Branding Guide'
      ]
    }
  ];

  const featuredResources = [
    {
      icon: <Book className="w-12 h-12 text-blue-500" />,
      title: 'Professional Resume eBook',
      description: 'Comprehensive guide to crafting standout resumes'
    },
    {
      icon: <Award className="w-12 h-12 text-green-500" />,
      title: 'Job Search Certification',
      description: 'Skill-building program for job market success'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">
          Resumate Resources Center
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Empower your job search with comprehensive guides, tutorials, and professional development resources.
        </p>
      </div>

      {/* Resource Categories */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {resourceSections.map((section, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-all"
          >
            <div className="mb-4">{section.icon}</div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {section.title}
            </h2>
            <ul className="space-y-2">
              {section.links.map((link, linkIndex) => (
                <li 
                  key={linkIndex} 
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-300"
                >
                  <a href="#" className="flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center bg-blue-50 dark:bg-gray-800 rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">
          Unlock Your Career Potential
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Access exclusive resources, expert insights, and AI-powered tools to transform your job search strategy.
        </p>
      </div>
    </div>
  );
};

export default ResourcesPage;