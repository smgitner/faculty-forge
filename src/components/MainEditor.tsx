import React, { useState, useRef, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { DocumentHeader } from './editor/DocumentHeader';
import { DocumentOutline } from './editor/DocumentOutline';
import { syllabusContent, documents } from '../data/syllabusData';
import { Toolbar } from '../components/Toolbar';

interface OutlineSection {
  id: string;
  title: string;
  children?: OutlineSection[];
  type?: 'section' | 'folder' | 'file';
}

interface MainEditorProps {
  selectedDocument: string;
  className?: string;
}

// Initial outline structure
const initialOutlineStructure: OutlineSection[] = [
  { id: 'syllabus-intro', title: 'Course Overview' },
  {
    id: 'instructor-info', title: 'Instructor Information', children: [
      { id: 'instructor-details', title: 'Instructor Details' },
      { id: 'office-hours', title: 'Office Hours' },
      { id: 'contact-information', title: 'Contact Information' }
    ]
  },
  {
    id: 'course-basics', title: 'Course Basics', children: [
      { id: 'meeting-day-time', title: 'Meeting Day/Time' },
      { id: 'course-description', title: 'Course Description' },
      { id: 'prerequisites', title: 'Prerequisites/Co-requisites' },
      { id: 'credits', title: 'Credits' },
      { id: 'audience', title: 'Audience' }
    ]
  },
  {
    id: 'values-section', title: 'Values & Principles', children: [
      { id: 'values-principles', title: 'Values & Principles' },
      { id: 'learning-objectives', title: 'Learning Objectives' }
    ]
  },
  {
    id: 'course-requirements', title: 'Course Requirements', children: [
      { id: 'assessment-methods', title: 'Assessment Methods' }
    ]
  },
  {
    id: 'policies', title: 'Policies', children: [
      { id: 'attendance-policy', title: 'Attendance Policy' },
      { id: 'late-work-policy', title: 'Late Work Policy' },
      { id: 'academic-integrity', title: 'Academic Integrity' }
    ]
  },
  {
    id: 'schedule', title: 'Schedule', children: [
      { id: 'schedule-overview', title: 'Schedule Overview' }
    ]
  }
];

function flattenOutlineToLeafIds(sections: OutlineSection[]): string[] {
  let ids: string[] = [];
  for (const section of sections) {
    if (section.children && section.children.length > 0) {
      ids = ids.concat(flattenOutlineToLeafIds(section.children));
    } else {
      ids.push(section.id);
    }
  }
  return ids;
}

function isLeaf(sectionId: string, outline: OutlineSection[]): boolean {
  function find(sectionId: string, sections: OutlineSection[]): OutlineSection | null {
    for (const section of sections) {
      if (section.id === sectionId) return section;
      if (section.children) {
        const found = find(sectionId, section.children);
        if (found) return found;
      }
    }
    return null;
  }
  const node = find(sectionId, outline);
  return !!node && (!node.children || node.children.length === 0);
}

export const MainEditor: React.FC<MainEditorProps> = ({ className }) => {
  const [outlineStructure, setOutlineStructure] = useState<OutlineSection[]>(initialOutlineStructure);
  const [sectionContent, setSectionContent] = useState(() => ({ ...syllabusContent, ...documents }));
  const [highlightedSection, setHighlightedSection] = useState<string>('syllabus-intro');
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());

  // Refs for each section to allow scrolling/highlighting (not needed for single section view)
  // const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Update content for a section
  const handleContentChange = (sectionId: string, content: string) => {
    setSectionContent(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        content,
      },
    }));
  };

  // Handle section selection (for checkboxes)
  const handleSectionSelect = (sectionId: string, selected: boolean) => {
    setSelectedSections(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(sectionId);
      } else {
        newSet.delete(sectionId);
      }
      return newSet;
    });
  };

  // Handle reordering from DocumentOutline
  const handleReorderSections = (newOutline: OutlineSection[]) => {
    setOutlineStructure(newOutline);
  };

  // Handle section click in outline
  const handleSectionClick = (sectionId: string) => {
    // Only allow leaf nodes to be highlighted for editing
    if (isLeaf(sectionId, outlineStructure)) {
      // If it's a file node and not in sectionContent, add it
      const node = (function find(sectionId: string, sections: OutlineSection[]): OutlineSection | null {
        for (const section of sections) {
          if (section.id === sectionId) return section;
          if (section.children) {
            const found = find(sectionId, section.children);
            if (found) return found;
          }
        }
        return null;
      })(sectionId, outlineStructure);
      if (node && node.type === 'file' && !sectionContent[sectionId]) {
        setSectionContent(prev => ({
          ...prev,
          [sectionId]: { id: sectionId, title: node.title, content: '' },
        }));
      }
      setHighlightedSection(sectionId);
    }
  };

  // Get all selected leaf nodes in outline order
  const allLeafIds = flattenOutlineToLeafIds(outlineStructure);
  const selectedLeafIds = allLeafIds.filter(id => selectedSections.has(id));

  // Decide what to show in the content editor
  let contentSections: { id: string; title: string; content: string }[] = [];
  if (selectedLeafIds.length > 0) {
    // Show all selected leaf nodes
    contentSections = selectedLeafIds.map(id => sectionContent[id] && { id, ...sectionContent[id] }).filter(Boolean);
  } else if (highlightedSection && isLeaf(highlightedSection, outlineStructure)) {
    // Show only the highlighted leaf node
    const section = sectionContent[highlightedSection];
    if (section) {
      contentSections = [{ id: highlightedSection, ...section }];
    }
  }

  // Add a new section (root or as a child)
  const handleAddSection = (parentId: string | null, type: 'section' | 'folder' | 'file' = 'section') => {
    const title = window.prompt(`Enter ${type === 'folder' ? 'folder' : type === 'file' ? 'file' : 'section'} name:`);
    if (!title) return;
    const newId = `${type}-${Date.now()}`;
    let newSection: OutlineSection;
    if (type === 'folder') {
      newSection = { id: newId, title, type: 'folder', children: [] };
    } else if (type === 'file') {
      newSection = { id: newId, title, type: 'file' };
    } else {
      newSection = { id: newId, title, type: 'section' };
    }
    setOutlineStructure(prev => {
      if (!parentId) {
        // Add as root
        return [...prev, newSection];
      }
      function addChild(sections: OutlineSection[]): OutlineSection[] {
        return sections.map(section => {
          if (section.id === parentId) {
            return {
              ...section,
              children: section.children ? [...section.children, newSection] : [newSection],
            };
          } else if (section.children) {
            return { ...section, children: addChild(section.children) };
          }
          return section;
        });
      }
      return addChild(prev);
    });
    if (type === 'file') {
      setSectionContent(prev => ({
        ...prev,
        [newId]: { id: newId, title, content: '' },
      }));
      setHighlightedSection(newId);
    }
  };

  // Add these handlers to pass to Toolbar
  const handleToolbarAddFile = () => {
    // Add as child of highlightedSection if possible, else as root
    let parentId: string | null = null;
    if (highlightedSection) {
      // Find the node
      const node = (function find(sectionId: string, sections: OutlineSection[]): OutlineSection | null {
        for (const section of sections) {
          if (section.id === sectionId) return section;
          if (section.children) {
            const found = find(sectionId, section.children);
            if (found) return found;
          }
        }
        return null;
      })(highlightedSection, outlineStructure);
      if (node && (node.type === 'folder' || (node.children && node.children.length > 0))) {
        parentId = node.id;
      }
    }
    handleAddSection(parentId, 'file');
  };
  const handleToolbarAddFolder = () => {
    let parentId: string | null = null;
    if (highlightedSection) {
      const node = (function find(sectionId: string, sections: OutlineSection[]): OutlineSection | null {
        for (const section of sections) {
          if (section.id === sectionId) return section;
          if (section.children) {
            const found = find(sectionId, section.children);
            if (found) return found;
          }
        }
        return null;
      })(highlightedSection, outlineStructure);
      if (node && (node.type === 'folder' || (node.children && node.children.length > 0))) {
        parentId = node.id;
      }
    }
    handleAddSection(parentId, 'folder');
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className} relative`}>
      <div className="absolute top-2 left-2 z-10 bg-red-100 border-red-300 border px-2 py-1 rounded text-xs font-medium text-red-700 pointer-events-none">
        Main Toolbar
      </div>
      <DocumentHeader 
        title={contentSections.length === 1 ? contentSections[0].title : 'Multiple Sections'}
        type="syllabus"
        lastModified={undefined}
      />
      <div className="flex-1 flex overflow-hidden relative">
        {/* Outline tree on the left */}
        <div className="relative">
          <div className="absolute top-2 left-2 z-10 bg-green-100 border-green-300 border px-2 py-1 rounded text-xs font-medium text-green-700 pointer-events-none">
            Document Outline Panel
          </div>
          <DocumentOutline
            activeSection={highlightedSection || ''}
            selectedSections={selectedSections}
            expandedNodes={new Set(['instructor-info', 'course-basics', 'values-section', 'policies'])}
            onSectionClick={handleSectionClick}
            onSectionSelect={handleSectionSelect}
            onToggleExpanded={() => {}}
            onReorderSections={handleReorderSections}
            onAddSection={handleAddSection}
          />
        </div>
        {/* Editable content on the right */}
        <div className="flex-1 flex flex-col min-h-0 h-full relative">
          <div className="flex-1 relative min-h-0 h-full">
            <div className="absolute top-2 left-2 z-10 bg-yellow-100 border-yellow-300 border px-2 py-1 rounded text-xs font-medium text-yellow-700 pointer-events-none">
              Content Editor
            </div>
            <div className="p-6 space-y-8 overflow-y-auto h-full">
              {contentSections.length > 0 ? (
                contentSections.map(section => (
                  <div
                    key={section.id}
                    className={`mb-8 border-2 border-blue-400 rounded bg-blue-50 p-4${highlightedSection === section.id ? ' ring-4 ring-blue-300' : ''}`}
                  >
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">{section.title}</h2>
                    <textarea
                      style={{ minHeight: 150, background: 'white', padding: 12, borderRadius: 4, width: '100%' }}
                      placeholder="Enter content..."
                      value={section.content}
                      onChange={e => handleContentChange(section.id, e.target.value)}
                    />
                  </div>
                ))
              ) : (
                <div className="text-slate-500">Select a section from the outline to view and edit content.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toolbar
        showInspector={false}
        onToggleInspector={() => {}}
        onAddFile={handleToolbarAddFile}
        onAddFolder={handleToolbarAddFolder}
        onConvertToFile={() => {}}
        onConvertToFolder={() => {}}
        canConvertToFile={false}
        canConvertToFolder={false}
      />
    </div>
  );
};
