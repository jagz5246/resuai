import React from 'react';

interface Suggestion {
  type: 'good' | 'improve';
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score
  const getBgGradient = () => {
    if (score > 69) return 'from-green-100';
    if (score > 49) return 'from-yellow-100';
    return 'from-red-100';
  };

  // Determine icon based on score
  const getIcon = () => {
    if (score > 69) return '/icons/ats-good.svg';
    if (score > 49) return '/icons/ats-warning.svg';
    return '/icons/ats-bad.svg';
  };

  // Determine status text based on score
  const getStatusText = () => {
    if (score > 69) return 'ATS Friendly';
    if (score > 49) return 'Moderately ATS Friendly';
    return 'Not ATS Friendly';
  };

  return (
    <div className={`bg-gradient-to-b ${getBgGradient()} to-white rounded-2xl shadow-md w-full p-6`}>
      {/* Top section with icon and score */}
      <div className="flex items-center gap-4 mb-4">
        <img src={getIcon()} alt="ATS Score Icon" className="w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold">ATS score - {score}/100</h2>
          <p className="text-sm font-medium">{getStatusText()}</p>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Applicant Tracking System (ATS) Analysis</h3>
        <p className="text-gray-600 mb-4">
          ATS software scans resumes before they reach human recruiters. A higher score means your resume is more likely to pass through these systems.
        </p>
      </div>

      {/* Suggestions list */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Key findings:</h3>
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2">
              <img 
                src={suggestion.type === 'good' ? '/icons/check.svg' : '/icons/warning.svg'} 
                alt={suggestion.type === 'good' ? 'Check' : 'Warning'} 
                className="w-5 h-5 mt-0.5" 
              />
              <span>{suggestion.tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Closing line */}
      <p className="text-sm font-medium">
        Improve your ATS score by addressing the suggestions above to increase your chances of getting past automated screening.
      </p>
    </div>
  );
};

export default ATS;