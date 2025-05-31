import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Download, 
  Share2, 
  Sparkles, 
  Settings, 
  FileText,
  Eye,
  EyeOff,
  Undo,
  Redo,
  Bold,
  Italic,
  List,
  Plus,
  FolderPlus,
  RefreshCcw
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { exportProject } from '../utils/exportUtils';
import { SaveDialog } from './SaveDialog';
import { toast } from 'sonner';

interface ToolbarProps {
  showInspector: boolean;
  onToggleInspector: () => void;
  onAddFile: () => void;
  onAddFolder: () => void;
  onConvertToFile: () => void;
  onConvertToFolder: () => void;
  canConvertToFile: boolean;
  canConvertToFolder: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ showInspector, onToggleInspector, onAddFile, onAddFolder, onConvertToFile, onConvertToFolder, canConvertToFile, canConvertToFolder }) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate saving the document
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Document saved successfully');
      console.log('Document saved');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickExport = async () => {
    try {
      await exportProject('Course_Syllabus');
      toast.success('Project exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed');
    }
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200">
        {/* Traditional Menu Bar */}
        <div className="border-b border-slate-100">
          <Menubar className="border-none rounded-none bg-transparent h-8 px-2">
            <MenubarMenu>
              <MenubarTrigger className="text-sm">File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Document <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Open <MenubarShortcut>⌘O</MenubarShortcut>
                </MenubarItem>
                <MenubarItem onClick={handleSave}>
                  Save <MenubarShortcut>⌘S</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Save As... <MenubarShortcut>⌘⇧S</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Import from Word
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={handleQuickExport}>
                  Export Project as ZIP
                </MenubarItem>
                <MenubarItem onClick={() => setShowSaveDialog(true)}>
                  Export as PDF
                </MenubarItem>
                <MenubarItem onClick={() => setShowSaveDialog(true)}>
                  Export as Word
                </MenubarItem>
                <MenubarItem onClick={() => setShowSaveDialog(true)}>
                  Export as PowerPoint
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Print <MenubarShortcut>⌘P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-sm">Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Redo <MenubarShortcut>⌘⇧Z</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Cut <MenubarShortcut>⌘X</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Copy <MenubarShortcut>⌘C</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Paste <MenubarShortcut>⌘V</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Find <MenubarShortcut>⌘F</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Replace <MenubarShortcut>⌘H</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-sm">View</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={onToggleInspector}>
                  {showInspector ? 'Hide' : 'Show'} Inspector Panel
                </MenubarItem>
                <MenubarItem>
                  Show Outline View
                </MenubarItem>
                <MenubarItem>
                  Show Variables Panel
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Reset Zoom <MenubarShortcut>⌘0</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-sm">Insert</MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={onAddFile}>
                  <Plus className="h-4 w-4 mr-2" />
                  New File
                </MenubarItem>
                <MenubarItem onClick={onAddFolder}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Folder
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={onConvertToFile} disabled={!canConvertToFile}>
                  <FileText className="h-4 w-4 mr-2" />
                  Convert to File
                </MenubarItem>
                <MenubarItem onClick={onConvertToFolder} disabled={!canConvertToFolder}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Convert to Folder
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-sm">Format</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Bold <MenubarShortcut>⌘B</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Italic <MenubarShortcut>⌘I</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Underline <MenubarShortcut>⌘U</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Heading 1
                </MenubarItem>
                <MenubarItem>
                  Heading 2
                </MenubarItem>
                <MenubarItem>
                  Normal Text
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Bullet List
                </MenubarItem>
                <MenubarItem>
                  Numbered List
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-sm">AI Tools</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Generate Syllabus Content
                </MenubarItem>
                <MenubarItem>
                  Create Learning Objectives
                </MenubarItem>
                <MenubarItem>
                  Build Course Calendar
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Lesson Plan Generator
                </MenubarItem>
                <MenubarItem>
                  Rubric Builder
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Grammar Check
                </MenubarItem>
                <MenubarItem>
                  Style Suggestions
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-sm">Tools</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Variable Manager
                </MenubarItem>
                <MenubarItem>
                  Template Library
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Settings
                </MenubarItem>
                <MenubarItem>
                  API Keys
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger className="text-sm">Help</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  User Guide
                </MenubarItem>
                <MenubarItem>
                  Keyboard Shortcuts
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  Check for Updates
                </MenubarItem>
                <MenubarItem>
                  About FacultyForge
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Toolbar with Action Buttons */}
        <div className="h-12 flex items-center justify-between px-4">
          {/* Left Section - Quick Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button variant="ghost" size="sm" className="gap-2">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Redo className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Formatting Tools */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Center Section - Document Info */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-sm font-medium text-slate-700">Course Syllabus</div>
              <div className="text-xs text-slate-500">
                {isSaving ? 'Saving...' : 'Last saved 2 minutes ago'}
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Draft
            </Badge>
          </div>

          {/* Right Section - AI Tools & Settings */}
          <div className="flex items-center gap-2">
            <Button 
              className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="sm"
            >
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => setShowSaveDialog(true)}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleInspector}
              className={showInspector ? "bg-blue-100 text-blue-700" : ""}
            >
              {showInspector ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <SaveDialog 
        open={showSaveDialog} 
        onOpenChange={setShowSaveDialog} 
      />
    </>
  );
};
