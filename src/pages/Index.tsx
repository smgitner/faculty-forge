import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MainEditor } from '@/components/MainEditor';
import { InspectorPanel } from '@/components/InspectorPanel';
import { Toolbar } from '@/components/Toolbar';
import { SoftwareGuide } from '@/components/SoftwareGuide';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const [selectedDocument, setSelectedDocument] = useState('syllabus-intro');
  const [showInspector, setShowInspector] = useState(true);

  return (
    <div className="min-h-screen h-screen overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50">
      <SidebarProvider>
        <div className="flex h-screen w-full min-h-0">
          {/* Main Application Layout */}
          <div className="relative min-h-0">
            <div className="absolute top-2 left-2 z-10 bg-blue-100 border-blue-300 border px-2 py-1 rounded text-xs font-medium text-blue-700 pointer-events-none">
              Project Sidebar
            </div>
            <Sidebar 
              selectedDocument={selectedDocument}
              onSelectDocument={setSelectedDocument}
            />
          </div>
          
          <div className="flex-1 flex flex-col min-h-0">
            <Toolbar 
              showInspector={showInspector}
              onToggleInspector={() => setShowInspector(!showInspector)}
            />
            
            <div className="flex-1 flex overflow-hidden min-h-0">
              <MainEditor 
                selectedDocument={selectedDocument}
                className="flex-1 min-h-0"
              />
              
              {showInspector && (
                <div className="relative min-h-0">
                  <div className="absolute top-2 right-2 z-10 bg-orange-100 border-orange-300 border px-2 py-1 rounded text-xs font-medium text-orange-700 pointer-events-none">
                    Inspector Panel
                  </div>
                  <InspectorPanel 
                    selectedDocument={selectedDocument}
                    className="w-80 border-l border-slate-200 min-h-0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Software Guide Component */}
        <SoftwareGuide />
        
        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </SidebarProvider>
    </div>
  );
};

export default Index;
