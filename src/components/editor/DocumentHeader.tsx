
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Target, BookOpen } from 'lucide-react';

interface DocumentHeaderProps {
  title: string;
  type?: 'syllabus' | 'lesson' | 'rubric' | 'textbook';
  lastModified?: string;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({ 
  title, 
  type = 'syllabus', 
  lastModified = 'just now' 
}) => {
  const getTypeIcon = (docType: string) => {
    switch (docType) {
      case 'syllabus': return <FileText className="h-4 w-4" />;
      case 'lesson': return <Calendar className="h-4 w-4" />;
      case 'rubric': return <Target className="h-4 w-4" />;
      case 'textbook': return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (docType: string) => {
    switch (docType) {
      case 'syllabus': return 'bg-blue-100 text-blue-700';
      case 'lesson': return 'bg-green-100 text-green-700';
      case 'rubric': return 'bg-purple-100 text-purple-700';
      case 'textbook': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="border-b border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {getTypeIcon(type)}
            <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
          </div>
          <Badge className={getTypeColor(type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </div>
        <div className="text-sm text-slate-500">
          Last modified {lastModified}
        </div>
      </div>
    </div>
  );
};
