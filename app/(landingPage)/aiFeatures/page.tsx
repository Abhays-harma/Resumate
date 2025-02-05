import React from 'react';
import { Check, Zap, Target, FileText, BookOpen, WandSparkles } from 'lucide-react';
import Link from 'next/link';

const AIFeatures = () => {
  const features = [
    {
      icon: <WandSparkles className="w-8 h-8 text-blue-500 dark:text-blue-300" />,
      title: 'AI Writer',
      description: 'Craft professional resumes with AI-powered content generation',
      capabilities: [
        'Personalized job descriptions',
        'Tailored skill descriptions',
        'Achievement-focused writing'
      ]
    },
    {
      icon: <Target className="w-8 h-8 text-green-500 dark:text-green-300" />,
      title: 'Keyword Optimization',
      description: 'Automatically align your resume with job descriptions',
      capabilities: [
        'ATS-friendly content',
        'Strategic keyword insertion',
        'Industry-specific language'
      ]
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-500 dark:text-purple-300" />,
      title: 'Smart Editing',
      description: 'Advanced editing suggestions for maximum impact',
      capabilities: [
        'Grammar and style improvements',
        'Conciseness optimization',
        'Contextual refinements'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 bg-white dark:bg-gray-900 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Resumate AI Features
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Revolutionize your job application with cutting-edge AI technology designed to elevate your professional profile.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md dark:hover:shadow-xl transition-all"
          >
            <div className="mb-4">{feature.icon}</div>
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              {feature.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {feature.description}
            </p>
            <ul className="space-y-2">
              {feature.capabilities.map((cap, capIndex) => (
                <li
                  key={capIndex}
                  className="flex items-center text-gray-700 dark:text-gray-200"
                >
                  <Check className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-300" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Ready to Transform Your Job Search?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Join 2,934,574 job seekers who have already upgraded their resume game.
        </p>
      </div>
    </div>
  );
};

export default AIFeatures;