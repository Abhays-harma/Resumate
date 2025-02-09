import React, { useState } from 'react';
import { Globe, Copy, Check } from 'lucide-react';
import { useResumeInfoContext } from '@/context/resume-info-provider';

const ShareResumeLink = () => {
  const [customLinkEnabled, setCustomLinkEnabled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customLink, setCustomLink] = useState('');

  const {resumeInfo}=useResumeInfoContext()

  const baseUrl =`${window.location.origin}/app.resumate.ai/s/`;
  const defaultLink = `${resumeInfo?.documentId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(baseUrl + (customLink || defaultLink));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCustomLinkChange = (e:any) => {
    const value = e.target.value;
    // Allow only letters, numbers, and hyphens
    if (/^[a-zA-Z0-9-]*$/.test(value)) {
      setCustomLink(value);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Share this resume</h2>

      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Globe size={16} />
        <span>Anyone with the link</span>
        <span className="text-blue-600">can view</span>
        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="relative">
        <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          <input
            type="text"
            className="flex-1 p-3 bg-gray-50 text-gray-600 rounded-lg focus:outline-none"
            value={baseUrl + (customLink || defaultLink)}
            readOnly
          />
          <button
            onClick={handleCopy}
            className="p-3 hover:text-blue-600 transition-colors"
            aria-label="Copy link"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">Use letters, numbers, and hyphens only.</p>
      </div>

    </div>
  );
};

export default ShareResumeLink;