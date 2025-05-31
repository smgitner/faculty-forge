import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContentSection {
  id: string;
  title: string;
  content: string;
}

interface ContentEditorProps {
  sections: ContentSection[];
  onContentChange: (sectionId: string, content: string) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  sections,
  onContentChange,
}) => {
  if (!sections.length) {
    return (
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-center h-full text-slate-500">
          <div className="text-center">
            <p className="mb-4">No sections available to edit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 h-full min-h-0 overflow-y-auto">
      <div className="p-6 space-y-8">
        {sections.map((section) => (
          <div
            key={section.id}
            className="mb-8 border-2 border-blue-400 rounded bg-blue-50 p-4"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{section.title}</h2>
            <textarea
              style={{ minHeight: 150, background: 'white', padding: 12, borderRadius: 4, width: '100%' }}
              placeholder="Enter content..."
              value={section.content}
              onChange={e => onContentChange(section.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
