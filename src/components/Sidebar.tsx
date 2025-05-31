import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Plus,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  GripVertical,
  Copy,
  Trash2,
  Edit,
  FolderPlus,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SidebarProps {
  selectedDocument: string;
  onSelectDocument: (documentId: string) => void;
}

interface DocumentNode {
  id: string;
  title: string;
  type: 'syllabus' | 'textbook' | 'lesson' | 'rubric' | 'folder';
  children?: DocumentNode[];
  status?: 'draft' | 'complete' | 'needs-review';
  dueDate?: string;
}

const sampleDocuments: DocumentNode[] = [
  {
    id: 'course-folder',
    title: 'PSY 101 - Introduction to Psychology',
    type: 'folder',
    children: [
      {
        id: 'syllabus-intro',
        title: 'Course Syllabus',
        type: 'syllabus',
        status: 'draft',
        children: [
          { id: 'course-overview', title: 'Course Overview', type: 'syllabus' },
          { id: 'learning-objectives', title: 'Learning Objectives', type: 'syllabus' },
          { id: 'course-policies', title: 'Course Policies', type: 'syllabus' },
          { id: 'schedule', title: 'Course Schedule', type: 'syllabus' }
        ]
      },
      {
        id: 'textbook-folder',
        title: 'Course Materials',
        type: 'folder',
        children: [
          { id: 'chapter-1', title: 'Chapter 1: What is Psychology?', type: 'textbook', status: 'complete' },
          { id: 'chapter-2', title: 'Chapter 2: Research Methods', type: 'textbook', status: 'draft' }
        ]
      },
      {
        id: 'lessons-folder',
        title: 'Lesson Plans',
        type: 'folder',
        children: [
          { id: 'week-1-lesson', title: 'Week 1: Introduction', type: 'lesson', dueDate: '2024-01-15' },
          { id: 'week-2-lesson', title: 'Week 2: Research Methods', type: 'lesson', dueDate: '2024-01-22' }
        ]
      },
      {
        id: 'rubrics-folder',
        title: 'Assessment Rubrics',
        type: 'folder',
        children: [
          { id: 'essay-rubric', title: 'Research Paper Rubric', type: 'rubric', status: 'complete' },
          { id: 'presentation-rubric', title: 'Presentation Rubric', type: 'rubric', status: 'needs-review' }
        ]
      }
    ]
  }
];

const getIcon = (type: string) => {
  switch (type) {
    case 'syllabus': return FileText;
    case 'textbook': return BookOpen;
    case 'lesson': return Calendar;
    case 'rubric': return CheckSquare;
    default: return FileText;
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'complete': return 'bg-emerald-100 text-emerald-700';
    case 'needs-review': return 'bg-amber-100 text-amber-700';
    case 'draft': return 'bg-blue-100 text-blue-700';
    default: return '';
  }
};

interface SortableDocumentNodeProps {
  node: DocumentNode;
  depth: number;
  expandedNodes: Set<string>;
  selectedDocument: string;
  onSelectDocument: (documentId: string) => void;
  onToggleExpanded: (nodeId: string) => void;
  onRenameDocument: (nodeId: string) => void;
  onDeleteDocument: (nodeId: string) => void;
  onDuplicateDocument: (nodeId: string) => void;
  onCreateFolder: (parentId: string) => void;
  onAddDocumentSibling: (targetId: string) => void;
}

const SortableDocumentNode: React.FC<SortableDocumentNodeProps> = ({
  node,
  depth,
  expandedNodes,
  selectedDocument,
  onSelectDocument,
  onToggleExpanded,
  onRenameDocument,
  onDeleteDocument,
  onDuplicateDocument,
  onCreateFolder,
  onAddDocumentSibling,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = getIcon(node.type);
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedDocument === node.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "select-none",
        isDragging && "opacity-50"
      )}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md mx-2 my-1",
              "hover:bg-blue-50 transition-colors duration-150",
              isSelected && "bg-blue-100 text-blue-700 font-medium",
              depth > 0 && "ml-4"
            )}
            style={{ paddingLeft: `${12 + depth * 16}px` }}
            onClick={() => {
              if (hasChildren) {
                onToggleExpanded(node.id);
              }
              onSelectDocument(node.id);
            }}
          >
            <button
              {...attributes}
              {...listeners}
              className="p-1 hover:bg-blue-100 rounded cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-3 w-3 text-slate-400" />
            </button>

            {hasChildren && (
              <button
                className="p-0.5 hover:bg-blue-100 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpanded(node.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 text-slate-500" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-slate-500" />
                )}
              </button>
            )}
            
            <Icon className="h-4 w-4 text-slate-600 flex-shrink-0" />
            
            <span className="flex-1 truncate">{node.title}</span>
            
            {node.status && (
              <Badge variant="secondary" className={cn("text-xs", getStatusColor(node.status))}>
                {node.status}
              </Badge>
            )}
            
            {node.dueDate && (
              <span className="text-xs text-slate-500 ml-2">
                {new Date(node.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </ContextMenuTrigger>
        
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => onSelectDocument(node.id)}>
            <FileText className="h-4 w-4 mr-2" />
            Open
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          
          <ContextMenuItem onClick={() => onRenameDocument(node.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Rename
          </ContextMenuItem>
          
          <ContextMenuItem onClick={() => onDuplicateDocument(node.id)}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </ContextMenuItem>
          
          {node.type === 'folder' && (
            <ContextMenuItem onClick={() => onCreateFolder(node.id)}>
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </ContextMenuItem>
          )}
          
          <ContextMenuItem onClick={() => onAddDocumentSibling(node.id)}>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          
          <ContextMenuItem>
            <Settings className="h-4 w-4 mr-2" />
            Properties
          </ContextMenuItem>
          
          <ContextMenuSeparator />
          
          <ContextMenuItem 
            onClick={() => onDeleteDocument(node.id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {hasChildren && isExpanded && (
        <div className="animate-accordion-down">
          <SortableContext items={node.children!.map(child => child.id)} strategy={verticalListSortingStrategy}>
            {node.children!.map(child => (
              <SortableDocumentNode
                key={child.id}
                node={child}
                depth={depth + 1}
                expandedNodes={expandedNodes}
                selectedDocument={selectedDocument}
                onSelectDocument={onSelectDocument}
                onToggleExpanded={onToggleExpanded}
                onRenameDocument={onRenameDocument}
                onDeleteDocument={onDeleteDocument}
                onDuplicateDocument={onDuplicateDocument}
                onCreateFolder={onCreateFolder}
                onAddDocumentSibling={onAddDocumentSibling}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ selectedDocument, onSelectDocument }) => {
  const [documents, setDocuments] = useState(sampleDocuments);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['course-folder', 'syllabus-intro']));
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleNewDocument = () => {
    const newDocId = `new-document-${Date.now()}`;
    const newDocument: DocumentNode = {
      id: newDocId,
      title: 'New Document',
      type: 'syllabus',
      status: 'draft'
    };

    setDocuments(prevDocuments => {
      const newDocuments = [...prevDocuments];
      // Add to the first course folder's children
      if (newDocuments[0]?.children) {
        newDocuments[0].children.push(newDocument);
      }
      return newDocuments;
    });

    // Select the new document
    onSelectDocument(newDocId);
    
    console.log('Created new document:', newDocId);
  };

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const findDocumentById = (nodes: DocumentNode[], id: string): DocumentNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findDocumentById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findParentAndIndex = (nodes: DocumentNode[], id: string, parent: DocumentNode[] = nodes): { parent: DocumentNode[], index: number } | null => {
    for (let i = 0; i < parent.length; i++) {
      if (parent[i].id === id) {
        return { parent, index: i };
      }
      if (parent[i].children) {
        const found = findParentAndIndex(nodes, id, parent[i].children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    setDocuments((prevDocuments) => {
      const newDocuments = [...prevDocuments];
      
      const activeResult = findParentAndIndex(newDocuments, active.id);
      const overResult = findParentAndIndex(newDocuments, over.id);
      
      if (!activeResult || !overResult) return prevDocuments;
      
      // If they're in the same parent, just reorder
      if (activeResult.parent === overResult.parent) {
        const reorderedItems = arrayMove(activeResult.parent, activeResult.index, overResult.index);
        activeResult.parent.splice(0, activeResult.parent.length, ...reorderedItems);
      } else {
        // Move between different parents
        const [removed] = activeResult.parent.splice(activeResult.index, 1);
        overResult.parent.splice(overResult.index, 0, removed);
      }
      
      return newDocuments;
    });
    
    setActiveId(null);
  };

  const handleRenameDocument = (nodeId: string) => {
    const newName = prompt('Enter new name:');
    if (newName && newName.trim()) {
      setDocuments(prevDocuments => {
        const updateNode = (nodes: DocumentNode[]): DocumentNode[] => {
          return nodes.map(node => {
            if (node.id === nodeId) {
              return { ...node, title: newName.trim() };
            }
            if (node.children) {
              return { ...node, children: updateNode(node.children) };
            }
            return node;
          });
        };
        return updateNode(prevDocuments);
      });
      console.log('Renamed document:', nodeId, 'to:', newName);
    }
  };

  const handleDeleteDocument = (nodeId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(prevDocuments => {
        const removeNode = (nodes: DocumentNode[]): DocumentNode[] => {
          return nodes.filter(node => {
            if (node.id === nodeId) {
              return false;
            }
            if (node.children) {
              node.children = removeNode(node.children);
            }
            return true;
          });
        };
        return removeNode(prevDocuments);
      });
      
      // If we deleted the selected document, select the first available one
      if (selectedDocument === nodeId) {
        const firstDoc = documents[0]?.children?.[0];
        if (firstDoc) {
          onSelectDocument(firstDoc.id);
        }
      }
      
      console.log('Deleted document:', nodeId);
    }
  };

  const handleDuplicateDocument = (nodeId: string) => {
    const sourceDocument = findDocumentById(documents, nodeId);
    if (sourceDocument) {
      const duplicatedDoc: DocumentNode = {
        ...sourceDocument,
        id: `${nodeId}-copy-${Date.now()}`,
        title: `${sourceDocument.title} (Copy)`,
        status: 'draft'
      };

      setDocuments(prevDocuments => {
        const addDuplicate = (nodes: DocumentNode[]): DocumentNode[] => {
          return nodes.map(node => {
            if (node.id === nodeId && node.id !== 'course-folder') {
              // Add duplicate as sibling
              return node;
            }
            if (node.children) {
              const childIndex = node.children.findIndex(child => child.id === nodeId);
              if (childIndex !== -1) {
                const newChildren = [...node.children];
                newChildren.splice(childIndex + 1, 0, duplicatedDoc);
                return { ...node, children: newChildren };
              }
              return { ...node, children: addDuplicate(node.children) };
            }
            return node;
          });
        };
        return addDuplicate(prevDocuments);
      });
      
      console.log('Duplicated document:', nodeId);
    }
  };

  const handleCreateFolder = (parentId: string) => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim()) {
      const newFolder: DocumentNode = {
        id: `folder-${Date.now()}`,
        title: folderName.trim(),
        type: 'folder',
        children: []
      };

      setDocuments(prevDocuments => {
        const addFolder = (nodes: DocumentNode[]): DocumentNode[] => {
          return nodes.map(node => {
            if (node.id === parentId && node.children) {
              return { ...node, children: [...node.children, newFolder] };
            }
            if (node.children) {
              return { ...node, children: addFolder(node.children) };
            }
            return node;
          });
        };
        return addFolder(prevDocuments);
      });
      
      console.log('Created new folder:', newFolder.id);
    }
  };

  const handleAddDocumentSibling = (targetId: string) => {
    const title = prompt('Enter document name:');
    if (!title) return;
    const newDocId = `new-document-${Date.now()}`;
    const newDocument: DocumentNode = {
      id: newDocId,
      title,
      type: 'syllabus',
      status: 'draft',
    };
    setDocuments(prevDocuments => {
      // Find the parent and index of the target node
      const findParentAndIndex = (nodes: DocumentNode[], id: string, parent: DocumentNode[] = nodes): { parent: DocumentNode[], index: number } | null => {
        for (let i = 0; i < parent.length; i++) {
          if (parent[i].id === id) {
            return { parent, index: i };
          }
          if (parent[i].children) {
            const found = findParentAndIndex(nodes, id, parent[i].children);
            if (found) return found;
          }
        }
        return null;
      };
      const newDocs = [...prevDocuments];
      const result = findParentAndIndex(newDocs, targetId);
      if (result) {
        result.parent.splice(result.index + 1, 0, newDocument);
      }
      return newDocs;
    });
    onSelectDocument(newDocId);
  };

  const renderDocumentTree = (nodes: DocumentNode[], depth: number = 0) => {
    const sortableIds = nodes.map(node => node.id);
    
    return (
      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        {nodes.map(node => (
          <SortableDocumentNode
            key={node.id}
            node={node}
            depth={depth}
            expandedNodes={expandedNodes}
            selectedDocument={selectedDocument}
            onSelectDocument={onSelectDocument}
            onToggleExpanded={toggleExpanded}
            onRenameDocument={handleRenameDocument}
            onDeleteDocument={handleDeleteDocument}
            onDuplicateDocument={handleDuplicateDocument}
            onCreateFolder={handleCreateFolder}
            onAddDocumentSibling={handleAddDocumentSibling}
          />
        ))}
      </SortableContext>
    );
  };

  const activeDocument = activeId ? findDocumentById(documents, activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-6 w-6" />
            <h1 className="text-lg font-semibold">FacultyForge</h1>
          </div>
          <p className="text-blue-100 text-sm">Academic Writing Assistant</p>
        </div>

        {/* Document Tree */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-4">
            <Button 
              className="w-full justify-start gap-2 bg-emerald-600 hover:bg-emerald-700"
              onClick={handleNewDocument}
            >
              <Plus className="h-4 w-4" />
              New Document
            </Button>
          </div>

          <div className="space-y-1">
            {renderDocumentTree(documents)}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Button variant="outline" size="sm" className="h-8">
              <Calendar className="h-3 w-3 mr-1" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <CheckSquare className="h-3 w-3 mr-1" />
              Rubrics
            </Button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeDocument ? (
          <div className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-md shadow-lg">
            <GripVertical className="h-3 w-3 text-slate-400" />
            {React.createElement(getIcon(activeDocument.type), { className: "h-4 w-4 text-slate-600" })}
            <span className="truncate">{activeDocument.title}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
