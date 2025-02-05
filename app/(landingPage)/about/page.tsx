import React from 'react';
import { 
  Layers, 
  Users, 
  Target, 
  Award,
  Code,
  Building
} from 'lucide-react';
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs';

const AboutPage = () => {
  const features = [
    {
      icon: <Code className="w-12 h-12 text-blue-500" />,
      title: 'AI-Powered Platform',
      description: 'Leveraging cutting-edge artificial intelligence to transform your resume and job search experience.'
    },
    {
      icon: <Target className="w-12 h-12 text-green-500" />,
      title: 'Smart Job Matching',
      description: 'Advanced algorithms that connect your skills and experience with the perfect job opportunities.'
    },
    {
      icon: <Users className="w-12 h-12 text-purple-500" />,
      title: 'Expert Community',
      description: 'Access to career professionals, mentors, and a supportive community of job seekers.'
    }
  ];

  const stats = [
    {
      number: '500K+',
      label: 'Users Helped'
    },
    {
      number: '95%',
      label: 'Success Rate'
    },
    {
      number: '200+',
      label: 'Partner Companies'
    }
  ];

  const teamMembers = [
    {
      icon: <Building className="w-8 h-8 text-gray-400" />,
      name: 'Career Services',
      role: 'Resume Review & Career Coaching'
    },
    {
      icon: <Code className="w-8 h-8 text-gray-400" />,
      name: 'Tech Team',
      role: 'AI & Platform Development'
    },
    {
      icon: <Users className="w-8 h-8 text-gray-400" />,
      name: 'Community Support',
      role: 'User Success & Engagement'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">
          About Resumate
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We're revolutionizing the way people approach job searching through AI-powered tools
          and expert guidance.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-12 mb-16 text-center">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">Our Mission</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          To empower job seekers with innovative tools and resources, making the job search process
          more effective, efficient, and accessible for everyone.
        </p>
      </div>

      {/* Key Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">
          What Sets Us Apart
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-all"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-12 mb-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold mb-2 text-blue-500 dark:text-blue-400">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">
          Our Teams
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 text-center hover:shadow-md transition-all"
            >
              <div className="flex justify-center mb-4">
                {member.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">
                {member.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-blue-50 dark:bg-gray-800 rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">
          Join Our Community
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Start your journey toward career success with our AI-powered platform and expert guidance.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;