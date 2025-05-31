
import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GuideSection {
  id: string;
  name: string;
  description: string;
  location: string;
  color: string;
}

const guideSections: GuideSection[] = [
  {
    id: 'project-sidebar',
    name: 'Project Sidebar',
    description: 'Main navigation panel containing document hierarchy, folders, and project files. Supports drag & drop reordering.',
    location: 'Left side of application',
    color: 'bg-blue-100 border-blue-300'
  },
  {
    id: 'document-outline',
    name: 'Document Outline Panel',
    description: 'Shows the structure of the currently selected document with checkboxes for section selection. Supports drag & drop reordering.',
    location: 'Left side of main editor area',
    color: 'bg-green-100 border-green-300'
  },
  {
    id: 'main-editor',
    name: 'Content Editor',
    description: 'Rich text editor where document content is written and formatted.',
    location: 'Center of application',
    color: 'bg-yellow-100 border-yellow-300'
  },
  {
    id: 'formatting-toolbar',
    name: 'Formatting Toolbar',
    description: 'Contains text formatting tools like headings, lists, bold, italic, etc.',
    location: 'Top of content editor',
    color: 'bg-purple-100 border-purple-300'
  },
  {
    id: 'inspector-panel',
    name: 'Inspector Panel',
    description: 'Shows properties and metadata for the selected document or section.',
    location: 'Right side of application (toggleable)',
    color: 'bg-orange-100 border-orange-300'
  },
  {
    id: 'main-toolbar',
    name: 'Main Toolbar',
    description: 'Contains global actions like save, export, and inspector toggle.',
    location: 'Top of application',
    color: 'bg-red-100 border-red-300'
  }
];

export const SoftwareGuide: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed top-4 right-4 z-50 bg-white shadow-lg"
      >
        <Info className="h-4 w-4 mr-2" />
        Software Guide
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">FacultyForge Software Guide</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Application Layout Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {guideSections.map((section) => (
                <div
                  key={section.id}
                  className={`p-4 rounded-lg border-2 ${section.color}`}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{section.name}</h4>
                  <p className="text-sm text-gray-700 mb-2">{section.description}</p>
                  <p className="text-xs text-gray-600 font-medium">📍 {section.location}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Drag & Drop Functionality</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900">Project Sidebar Drag & Drop</h4>
                <p className="text-sm text-blue-700">Reorder documents, move between folders, reorganize project structure</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900">Document Outline Drag & Drop</h4>
                <p className="text-sm text-green-700">Reorder sections within a document, restructure content hierarchy</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Key Features</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• <strong>Project Sidebar:</strong> Document management with folders, status indicators, and context menus</li>
              <li>• <strong>Document Outline:</strong> Section-based editing with checkbox selection for bulk operations</li>
              <li>• <strong>Content Editor:</strong> Rich text editing with TinyMCE-style formatting</li>
              <li>• <strong>Formatting Toolbar:</strong> Quick access to text styles, headings, and lists</li>
              <li>• <strong>Inspector Panel:</strong> Metadata editing and document properties</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
