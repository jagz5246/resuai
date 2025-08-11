import React from 'react';
import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from './Accordian';
import { cn } from '~/lib/utils';
import { CheckCircle, Info } from 'lucide-react';

// Assuming Feedback type is globally defined or imported
interface Feedback {
  toneAndStyle: {
    score: number;
    tips: Array<{
      type: 'good' | 'improve';
      tip: string;
      explanation: string;
    }>;
  };
  content: {
    score: number;
    tips: Array<{
      type: 'good' | 'improve';
      tip: string;
      explanation: string;
    }>;
  };
  structure: {
    score: number;
    tips: Array<{
      type: 'good' | 'improve';
      tip: string;
      explanation: string;
    }>;
  };
  skills: {
    score: number;
    tips: Array<{
      type: 'good' | 'improve';
      tip: string;
      explanation: string;
    }>;
  };
}

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  const getColorClasses = () => {
    if (score > 69) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: <CheckCircle className="w-4 h-4 text-green-700 mr-1" />
      };
    } else if (score > 39) {
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: null
      };
    } else {
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: <Info className="w-4 h-4 text-yellow-700 mr-1" />
      };
    }
  };

  const { bg, text, icon } = getColorClasses();

  return (
    <div className={cn('flex items-center px-2 py-1 rounded-md', bg)}>
      {icon}
      <span className={cn('text-xs font-medium', text)}>{score}/100</span>
    </div>
  );
};

interface CategoryHeaderProps {
  title: string;
  score: number;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, score }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <h3 className="text-sm font-medium">{title}</h3>
      <ScoreBadge score={score} />
    </div>
  );
};

interface CategoryContentProps {
  tips: Array<{
    type: 'good' | 'improve';
    tip: string;
    explanation: string;
  }>;
}

const CategoryContent: React.FC<CategoryContentProps> = ({ tips }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start">
            {tip.type === 'good' ? (
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            )}
            <span className="text-sm">{tip.tip}</span>
          </div>
        ))}
      </div>
      
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div 
            key={index} 
            className={cn(
              'p-3 rounded-md text-sm',
              tip.type === 'good' 
                ? 'bg-green-50 border border-green-100' 
                : 'bg-yellow-50 border border-yellow-100'
            )}
          >
            <p className={cn(
                'font-bold p-1',
                tip.type === 'good'
                    ? 'text-green-600'
                    : 'text-yellow-600'
            )}>{tip.tip}</p>
            <p className={cn('text-xs line-height-md',
                tip.type === 'good'
                ? 'text-green-600'
                : 'text-yellow-600')}>{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DetailsProps {
  feedback: Feedback;
}

const Details: React.FC<DetailsProps> = ({ feedback }) => {
  return (
    <div className="w-full">
      <Accordion className="w-full">
        <AccordionItem id="tone-and-style" className="rounded-md border border-gray-200">
          <AccordionHeader itemId="tone-and-style">
            <CategoryHeader title="Tone & Style" score={feedback.toneAndStyle.score} />
          </AccordionHeader>
          <AccordionContent itemId="tone-and-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem id="content" className="rounded-md border border-gray-200">
          <AccordionHeader itemId="content">
            <CategoryHeader title="Content" score={feedback.content.score} />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem id="structure" className="rounded-md border border-gray-200">
          <AccordionHeader itemId="structure">
            <CategoryHeader title="Structure" score={feedback.structure.score} />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem id="skills" className="rounded-md border border-gray-200">
          <AccordionHeader itemId="skills">
            <CategoryHeader title="Skills" score={feedback.skills.score} />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;