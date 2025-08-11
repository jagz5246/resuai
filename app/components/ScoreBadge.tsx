import React from 'react';

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = '';
  let badgeText = '';
  
  if (score > 70) {
    badgeColor = 'bg-badge-green text-green-600';
    badgeText = 'Strong';
  } else if (score > 49) {
    badgeColor = 'bg-badge-yellow text-yellow-600';
    badgeText = 'Good start';
  } else {
    badgeColor = 'bg-badge-red text-red-600';
    badgeText = 'Needs work';
  }
  
  return (
    <div className={`px-2 py-1 rounded-md ${badgeColor}`}>
      <p className="text-xs font-medium">{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;