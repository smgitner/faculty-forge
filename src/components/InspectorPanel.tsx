
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Calendar, 
  Target, 
  Settings,
  Clock,
  User,
  BookOpen,
  CheckSquare,
  Plus,
  Edit3,
  Download
} from 'lucide-react';

interface InspectorPanelProps {
  selectedDocument: string;
  className?: string;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({ selectedDocument, className }) => {
  const [activeTab, setActiveTab] = useState('ai');

  return (
    <div className={cn("bg-slate-50 border-l border-slate-200 h-full overflow-y-auto", className)}>
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Inspector
        </h3>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai" className="text-xs">AI Tools</TabsTrigger>
            <TabsTrigger value="variables" className="text-xs">Variables</TabsTrigger>
            <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4 mt-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2 text-purple-700">
                <Sparkles className="h-4 w-4" />
                AI Assistant
              </h4>
              <div className="space-y-2">
                <Button size="sm" className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <BookOpen className="h-3 w-3" />
                  Generate Content
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Target className="h-3 w-3" />
                  Add Objectives
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <Calendar className="h-3 w-3" />
                  Create Schedule
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <CheckSquare className="h-3 w-3" />
                  Build Rubric
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 text-emerald-700">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <Edit3 className="h-3 w-3" />
                  Add Section
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <Plus className="h-3 w-3" />
                  Insert Template
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="font-medium mb-2 text-blue-700">AI Suggestions</h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-white rounded border border-blue-200">
                  <p className="text-slate-600 mb-1">Consider adding a late policy to your course policies section.</p>
                  <Button size="sm" variant="ghost" className="h-6 text-xs text-blue-600">Apply</Button>
                </div>
                <div className="p-2 bg-white rounded border border-blue-200">
                  <p className="text-slate-600 mb-1">Your learning objectives could benefit from Bloom's taxonomy alignment.</p>
                  <Button size="sm" variant="ghost" className="h-6 text-xs text-blue-600">Review</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="variables" className="space-y-4 mt-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3 text-amber-700">Course Variables</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="semester" className="text-xs text-slate-600">Semester</Label>
                  <Input 
                    id="semester" 
                    placeholder="Spring 2024" 
                    className="h-8 text-sm" 
                  />
                </div>
                <div>
                  <Label htmlFor="start-date" className="text-xs text-slate-600">Start Date</Label>
                  <Input 
                    id="start-date" 
                    type="date" 
                    className="h-8 text-sm" 
                  />
                </div>
                <div>
                  <Label htmlFor="class-time" className="text-xs text-slate-600">Class Time</Label>
                  <Input 
                    id="class-time" 
                    placeholder="MWF 10:00-10:50 AM" 
                    className="h-8 text-sm" 
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-xs text-slate-600">Location</Label>
                  <Input 
                    id="location" 
                    placeholder="Psychology Building 101" 
                    className="h-8 text-sm" 
                  />
                </div>
              </div>
              <Button size="sm" className="w-full mt-3">
                Update Variables
              </Button>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 text-slate-700">Assignment Dates</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="assignment1" className="text-xs text-slate-600">Assignment 1 Due</Label>
                  <Input 
                    id="assignment1" 
                    type="date" 
                    className="h-8 text-sm" 
                  />
                </div>
                <div>
                  <Label htmlFor="midterm" className="text-xs text-slate-600">Midterm Date</Label>
                  <Input 
                    id="midterm" 
                    type="date" 
                    className="h-8 text-sm" 
                  />
                </div>
                <div>
                  <Label htmlFor="final" className="text-xs text-slate-600">Final Exam</Label>
                  <Input 
                    id="final" 
                    type="date" 
                    className="h-8 text-sm" 
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-4 mt-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3 text-emerald-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Options
              </h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <FileText className="h-3 w-3" />
                  Word Document (.docx)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <FileText className="h-3 w-3" />
                  PDF Document
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <BookOpen className="h-3 w-3" />
                  PowerPoint (.pptx)
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 text-slate-700">Export Settings</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Include Variables</span>
                  <Badge variant="secondary" className="text-xs">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Accessibility</span>
                  <Badge variant="secondary" className="text-xs">On</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Template</span>
                  <Badge variant="secondary" className="text-xs">Academic</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-emerald-50 border-emerald-200">
              <h4 className="font-medium mb-2 text-emerald-700">Document Status</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Word count:</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Variables:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Last saved:</span>
                  <span className="font-medium">2 min ago</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
