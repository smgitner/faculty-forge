import React from 'react';
import { ChevronDown, ChevronRight, GripVertical, Folder, FileText, Edit, Copy, Plus, FolderPlus, Trash2, Settings } from 'lucide-react';
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
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';

interface OutlineSection {
  id: string;
  title: string;
  children?: OutlineSection[];
  type?: 'folder' | 'file';
}

interface DocumentOutlineProps {
  activeSection: string;
  selectedSections: Set<string>;
  expandedNodes: Set<string>;
  onSectionClick: (sectionId: string) => void;
  onSectionSelect: (sectionId: string, selected: boolean) => void;
  onToggleExpanded: (nodeId: string) => void;
  onReorderSections?: (sections: OutlineSection[]) => void;
  onAddSection?: (parentId: string | null) => void;
}

const outlineStructure: OutlineSection[] = [
  {
    id: 'syllabus-intro',
    title: 'Course Overview'
  },
  {
    id: 'instructor-info',
    title: 'Instructor Information',
    children: [
      { id: 'instructor-details', title: 'Instructor Details' },
      { id: 'office-hours', title: 'Office Hours' },
      { id: 'contact-information', title: 'Contact Information' }
    ]
  },
  {
    id: 'course-basics',
    title: 'Course Basics',
    children: [
      { id: 'meeting-day-time', title: 'Meeting Day/Time' },
      { id: 'course-description', title: 'Course Description' },
      { id: 'prerequisites', title: 'Prerequisites/Co-requisites' },
      { id: 'credits', title: 'Credits' },
      { id: 'audience', title: 'Audience' }
    ]
  },
  {
    id: 'values-section',
    title: 'Values & Principles',
    children: [
      { id: 'values-principles', title: 'Values & Principles' },
      { id: 'learning-objectives', title: 'Learning Objectives' }
    ]
  },
  {
    id: 'course-requirements',
    title: 'Course Requirements',
    children: [
      { id: 'assessment-methods', title: 'Assessment Methods' }
    ]
  },
  {
    id: 'policies',
    title: 'Policies',
    children: [
      { id: 'attendance-policy', title: 'Attendance Policy' },
      { id: 'late-work-policy', title: 'Late Work Policy' },
      { id: 'academic-integrity', title: 'Academic Integrity' }
    ]
  },
  {
    id: 'schedule',
    title: 'Schedule',
    children: [
      { id: 'schedule-overview', title: 'Schedule Overview' }
    ]
  }
];

interface SortableOutlineItemProps {
  item: OutlineSection;
  depth: number;
  activeSectionId: string;
  selectedSections: Set<string>;
  expandedNodes: Set<string>;
  onSectionClick: (sectionId: string) => void;
  onSectionSelect: (sectionId: string, selected: boolean) => void;
  onToggleExpanded: (nodeId: string) => void;
  onParentSelect: (item: OutlineSection, selected: boolean) => void;
}

const SortableOutlineItem: React.FC<SortableOutlineItemProps & {
  onAddSection?: (parentId: string) => void;
  onAddSectionSibling?: (targetId: string) => void;
  onAddFolder?: (parentId: string) => void;
  onAddFile?: (parentId: string) => void;
  onRename?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onConvertToFolder?: (id: string) => void;
  onConvertToFile?: (id: string) => void;
}> = ({
  item,
  depth,
  activeSectionId,
  selectedSections,
  expandedNodes,
  onSectionClick,
  onSectionSelect,
  onToggleExpanded,
  onParentSelect,
  onAddSection,
  onAddSectionSibling,
  onAddFolder,
  onAddFile,
  onRename,
  onDuplicate,
  onDelete,
  onConvertToFolder,
  onConvertToFile
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedNodes.has(item.id);
  const isActive = activeSectionId === item.id;
  const isSelected = selectedSections.has(item.id);

  // Check if all children are selected (for parent checkbox state)
  const areAllChildrenSelected = hasChildren && item.children!.every(child => {
    const isChildSelected = selectedSections.has(child.id);
    if (child.children) {
      // Recursively check grandchildren
      return isChildSelected && child.children.every(grandchild => selectedSections.has(grandchild.id));
    }
    return isChildSelected;
  });

  // Check if some (but not all) children are selected (for indeterminate state)
  const areSomeChildrenSelected = hasChildren && item.children!.some(child => {
    const isChildSelected = selectedSections.has(child.id);
    if (child.children) {
      // Check if any grandchildren are selected
      return isChildSelected || child.children.some(grandchild => selectedSections.has(grandchild.id));
    }
    return isChildSelected;
  });

  const checkboxChecked = hasChildren ? areAllChildrenSelected : isSelected;
  const checkboxIndeterminate = hasChildren && areSomeChildrenSelected && !areAllChildrenSelected;

  const isParent = item.children && item.children.length > 0;
  const isFolder = item.type === 'folder';
  const isFile = !item.children && item.type === 'file';

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={setNodeRef}
          style={style}
          className={`${isDragging ? 'opacity-50' : ''}`}
        >
          <div
            className={`flex items-center w-full text-left p-1 rounded text-sm transition-colors ${
              isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-slate-200'
            }`}
            style={{ paddingLeft: `${8 + depth * 16}px` }}
          >
            {hasChildren && <Folder className="h-4 w-4 text-slate-400 mr-1" />}
            <button
              {...attributes}
              {...listeners}
              className="mr-1 p-0.5 hover:bg-slate-300 rounded cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-3 w-3 text-slate-400" />
            </button>

            <input
              type="checkbox"
              checked={checkboxChecked}
              ref={(input) => {
                if (input) input.indeterminate = checkboxIndeterminate;
              }}
              onChange={(e) => {
                e.stopPropagation();
                console.log('Checkbox changed:', item.id, e.target.checked);
                if (hasChildren) {
                  onParentSelect(item, e.target.checked);
                } else {
                  onSectionSelect(item.id, e.target.checked);
                }
              }}
              className="mr-2 h-3 w-3"
            />
            
            <button
              onClick={() => {
                if (hasChildren) {
                  onToggleExpanded(item.id);
                }
                onSectionClick(item.id);
              }}
              className="flex items-center flex-1"
            >
              {hasChildren && (
                <span className="mr-1">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </span>
              )}
              {item.title}
            </button>
            {hasChildren && onAddSection && (
              <button
                className="ml-2 px-1 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs"
                title="Add child section"
                onClick={e => {
                  e.stopPropagation();
                  onAddSection(item.id);
                }}
              >
                +
              </button>
            )}
          </div>
          
          {hasChildren && isExpanded && (
            <div className="ml-2">
              <SortableContext items={item.children!.map(child => child.id)} strategy={verticalListSortingStrategy}>
                {item.children!.map(child => (
                  <SortableOutlineItem
                    key={child.id}
                    item={child}
                    depth={depth + 1}
                    activeSectionId={activeSectionId}
                    selectedSections={selectedSections}
                    expandedNodes={expandedNodes}
                    onSectionClick={onSectionClick}
                    onSectionSelect={onSectionSelect}
                    onToggleExpanded={onToggleExpanded}
                    onParentSelect={onParentSelect}
                    onAddSection={onAddSection}
                    onAddSectionSibling={onAddSectionSibling}
                    onAddFolder={onAddFolder}
                    onAddFile={onAddFile}
                    onRename={onRename}
                    onDuplicate={onDuplicate}
                    onDelete={onDelete}
                    onConvertToFolder={onConvertToFolder}
                    onConvertToFile={onConvertToFile}
                  />
                ))}
              </SortableContext>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={() => onSectionClick(item.id)}>
          <FileText className="h-4 w-4 mr-2" />
          Open
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onRename && onRename(item.id)}>
          <Edit className="h-4 w-4 mr-2" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDuplicate && onDuplicate(item.id)}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </ContextMenuItem>
        {(isParent || isFolder || isFile) && (
          <ContextMenuItem onClick={() => onAddFolder && onAddFolder(item.id)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </ContextMenuItem>
        )}
        {(isParent || isFolder || isFile) && (
          <ContextMenuItem onClick={() => onAddFile && onAddFile(item.id)}>
            <Plus className="h-4 w-4 mr-2" />
            New File
          </ContextMenuItem>
        )}
        {isFile && (
          <ContextMenuItem onClick={() => onConvertToFolder && onConvertToFolder(item.id)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Convert to Folder
          </ContextMenuItem>
        )}
        {isFolder && (
          <ContextMenuItem onClick={() => onConvertToFile && onConvertToFile(item.id)}>
            <FileText className="h-4 w-4 mr-2" />
            Convert to File
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Settings className="h-4 w-4 mr-2" />
          Properties
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onDelete && onDelete(item.id)} className="text-red-600 focus:text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const DocumentOutline: React.FC<DocumentOutlineProps> = ({
  activeSection,
  selectedSections,
  expandedNodes,
  onSectionClick,
  onSectionSelect,
  onToggleExpanded,
  onReorderSections,
  onAddSection
}) => {
  const [sections, setSections] = React.useState(outlineStructure);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<OutlineSection[][]>([outlineStructure]);
  const [historyIndex, setHistoryIndex] = React.useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Add undo/redo keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Cmd+Z (Mac) or Ctrl+Z (Windows/Linux) for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      
      // Handle Cmd+Shift+Z (Mac) or Ctrl+Y (Windows/Linux) for redo
      if (((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) || 
          ((e.ctrlKey && !e.metaKey) && e.key === 'y')) {
        e.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [historyIndex, history]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setSections(history[newIndex]);
      console.log('Undo: reverted to history index', newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setSections(history[newIndex]);
      console.log('Redo: moved to history index', newIndex);
    }
  };

  const addToHistory = (newSections: OutlineSection[]) => {
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newSections))); // Deep copy
    
    // Limit history to 50 entries
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
  };

  // Handle parent checkbox selection - auto-select/deselect children
  const handleParentSelect = (item: OutlineSection, selected: boolean) => {
    console.log('Parent select:', item.id, selected);
    
    // First select/deselect the parent
    onSectionSelect(item.id, selected);
    
    // Then select/deselect all children recursively
    if (item.children) {
      const processChildren = (children: OutlineSection[]) => {
        children.forEach(child => {
          console.log('Processing child:', child.id, selected);
          onSectionSelect(child.id, selected);
          if (child.children) {
            processChildren(child.children);
          }
        });
      };
      processChildren(item.children);
    }
  };

  const findSectionById = (sections: OutlineSection[], id: string): OutlineSection | null => {
    for (const section of sections) {
      if (section.id === id) return section;
      if (section.children) {
        const found = findSectionById(section.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findParentAndIndex = (sections: OutlineSection[], targetId: string, parentSections: OutlineSection[] = sections): { parent: OutlineSection[], index: number } | null => {
    for (let i = 0; i < parentSections.length; i++) {
      if (parentSections[i].id === targetId) {
        return { parent: parentSections, index: i };
      }
      if (parentSections[i].children) {
        const found = findParentAndIndex(sections, targetId, parentSections[i].children);
        if (found) return found;
      }
    }
    return null;
  };

  const removeSection = (sections: OutlineSection[], targetId: string): { sections: OutlineSection[], removedSection: OutlineSection | null } => {
    const newSections = [...sections];
    let removedSection: OutlineSection | null = null;

    const removeFromArray = (arr: OutlineSection[]): OutlineSection[] => {
      return arr.filter(section => {
        if (section.id === targetId) {
          removedSection = section;
          return false;
        }
        if (section.children) {
          section.children = removeFromArray(section.children);
        }
        return true;
      });
    };

    return { sections: removeFromArray(newSections), removedSection };
  };

  const insertSection = (sections: OutlineSection[], targetId: string, sectionToInsert: OutlineSection, insertAfter: boolean = true): OutlineSection[] => {
    const newSections = [...sections];

    const insertIntoArray = (arr: OutlineSection[]): OutlineSection[] => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === targetId) {
          const insertIndex = insertAfter ? i + 1 : i;
          arr.splice(insertIndex, 0, sectionToInsert);
          return arr;
        }
        if (arr[i].children) {
          arr[i] = { ...arr[i], children: insertIntoArray(arr[i].children!) };
        }
      }
      return arr;
    };

    return insertIntoArray(newSections);
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

    setSections((prevSections) => {
      // Find the active (dragged) section
      const activeResult = findParentAndIndex(prevSections, active.id);
      const overResult = findParentAndIndex(prevSections, over.id);
      
      if (!activeResult || !overResult) {
        console.log('Could not find active or over section');
        return prevSections;
      }

      let newSections: OutlineSection[];

      // If they're in the same parent, just reorder
      if (activeResult.parent === overResult.parent) {
        const reorderedItems = arrayMove(activeResult.parent, activeResult.index, overResult.index);
        activeResult.parent.splice(0, activeResult.parent.length, ...reorderedItems);
        newSections = [...prevSections];
      } else {
        // Moving between different parents
        console.log('Moving between different parents:', active.id, 'to near', over.id);
        
        // Remove the section from its current location
        const { sections: sectionsAfterRemoval, removedSection } = removeSection(prevSections, active.id);
        
        if (!removedSection) {
          console.log('Could not remove section');
          return prevSections;
        }

        // Insert the section near the target
        newSections = insertSection(sectionsAfterRemoval, over.id, removedSection);
        
        onReorderSections?.(newSections);
      }

      // Add to history for undo/redo
      addToHistory(newSections);
      
      return newSections;
    });
    
    setActiveId(null);
  };

  const getAllSectionIds = (sections: OutlineSection[]): string[] => {
    const ids: string[] = [];
    sections.forEach(section => {
      ids.push(section.id);
      if (section.children) {
        ids.push(...getAllSectionIds(section.children));
      }
    });
    return ids;
  };

  const draggedSection = activeId ? findSectionById(sections, activeId) : null;

  // Helper to get all leaf section IDs
  const getAllLeafSectionIds = (sections: OutlineSection[]): string[] => {
    let ids: string[] = [];
    for (const section of sections) {
      if (section.children && section.children.length > 0) {
        ids = ids.concat(getAllLeafSectionIds(section.children));
      } else {
        ids.push(section.id);
      }
    }
    return ids;
  };

  const allLeafIds = getAllLeafSectionIds(sections);
  const allSelected = allLeafIds.every(id => selectedSections.has(id));
  const someSelected = allLeafIds.some(id => selectedSections.has(id));

  // Handler for select all
  const handleSelectAll = (checked: boolean) => {
    allLeafIds.forEach(id => {
      onSectionSelect(id, checked);
    });
  };

  const handleAddSectionSibling = (targetId: string) => {
    const title = window.prompt('Enter section name:');
    if (!title) return;
    const newId = `section-${Date.now()}`;
    const newSection = { id: newId, title };
    setSections(prev => {
      // Find the parent and index of the target node
      const findParentAndIndex = (sections: OutlineSection[], id: string, parentSections: OutlineSection[] = sections): { parent: OutlineSection[], index: number } | null => {
        for (let i = 0; i < parentSections.length; i++) {
          if (parentSections[i].id === id) {
            return { parent: parentSections, index: i };
          }
          if (parentSections[i].children) {
            const found = findParentAndIndex(sections, id, parentSections[i].children);
            if (found) return found;
          }
        }
        return null;
      };
      const newSections = [...prev];
      const result = findParentAndIndex(newSections, targetId);
      if (result) {
        result.parent.splice(result.index + 1, 0, newSection);
      }
      return newSections;
    });
  };

  const handleAddFolder = (parentId: string) => {
    const name = window.prompt('Enter folder name:');
    if (!name) return;
    setSections(prev => {
      const add = (sections: OutlineSection[]): OutlineSection[] =>
        sections.map(s =>
          s.id === parentId
            ? { ...s, children: [...(s.children || []), { id: `folder-${Date.now()}`, title: name, type: 'folder', children: [] }] }
            : s.children ? { ...s, children: add(s.children) } : s
        );
      return add(prev);
    });
  };

  const handleAddFile = (parentId: string) => {
    const name = window.prompt('Enter file name:');
    if (!name) return;
    setSections(prev => {
      const add = (sections: OutlineSection[]): OutlineSection[] =>
        sections.map(s =>
          s.id === parentId
            ? { ...s, children: [...(s.children || []), { id: `file-${Date.now()}`, title: name, type: 'file' }] }
            : s.children ? { ...s, children: add(s.children) } : s
        );
      return add(prev);
    });
  };

  const handleConvertToFolder = (id: string) => {
    setSections(prev => {
      const convert = (sections: OutlineSection[]): OutlineSection[] =>
        sections.map(s =>
          s.id === id
            ? { ...s, type: 'folder', children: s.children || [] }
            : s.children ? { ...s, children: convert(s.children) } : s
        );
      return convert(prev);
    });
  };

  const handleConvertToFile = (id: string) => {
    setSections(prev => {
      const convert = (sections: OutlineSection[]): OutlineSection[] =>
        sections.map(s =>
          s.id === id
            ? { id: s.id, title: s.title, type: 'file' } // remove children
            : s.children ? { ...s, children: convert(s.children) } : s
        );
      return convert(prev);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-64 border-r border-slate-200 bg-slate-50 h-full overflow-y-auto">
        {/* Select All Checkbox and Add Root Section Button */}
        <div className="flex items-center px-3 py-2 border-b border-slate-200 bg-slate-100 sticky top-0 z-10">
          <input
            type="checkbox"
            checked={allSelected}
            ref={input => { if (input) input.indeterminate = !allSelected && someSelected; }}
            onChange={e => handleSelectAll(e.target.checked)}
            className="mr-2 h-4 w-4"
          />
          <span className="text-sm font-medium flex-1">Select All</span>
          {onAddSection && (
            <button
              className="ml-2 px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs"
              title="Add root section"
              onClick={() => onAddSection(null)}
            >
              +
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Document Outline Panel</h3>
          <div className="space-y-0">
            <SortableContext items={getAllSectionIds(sections)} strategy={verticalListSortingStrategy}>
              {sections.map(item => (
                <SortableOutlineItem
                  key={item.id}
                  item={item}
                  depth={0}
                  activeSectionId={activeSection}
                  selectedSections={selectedSections}
                  expandedNodes={expandedNodes}
                  onSectionClick={onSectionClick}
                  onSectionSelect={onSectionSelect}
                  onToggleExpanded={onToggleExpanded}
                  onParentSelect={handleParentSelect}
                  onAddSection={onAddSection}
                  onAddSectionSibling={handleAddSectionSibling}
                  onAddFolder={handleAddFolder}
                  onAddFile={handleAddFile}
                  onConvertToFolder={handleConvertToFolder}
                  onConvertToFile={handleConvertToFile}
                />
              ))}
            </SortableContext>
          </div>
        </div>
      </div>

      <DragOverlay>
        {draggedSection ? (
          <div className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-md shadow-lg">
            <GripVertical className="h-3 w-3 text-slate-400" />
            <span className="truncate">{draggedSection.title}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
