
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Underline, List } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const FormattingToolbar: React.FC = () => {
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleHeading = (level: number) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const element = range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
        ? range.commonAncestorContainer.parentElement 
        : range.commonAncestorContainer as Element;
      
      // Create heading element
      const heading = document.createElement(`h${level}`);
      heading.className = getHeadingClasses(level);
      
      if (selection.toString()) {
        // If text is selected, wrap it in heading
        heading.textContent = selection.toString();
        range.deleteContents();
        range.insertNode(heading);
      } else {
        // If no selection, replace current block or insert new heading
        const blockElement = element.closest('div, p, h1, h2, h3, h4, h5, h6');
        if (blockElement && blockElement instanceof HTMLElement && blockElement.isContentEditable) {
          heading.textContent = blockElement.textContent || 'Heading';
          blockElement.parentNode?.replaceChild(heading, blockElement);
        }
      }
      
      // Clear selection and place cursor at end of heading
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(heading);
      newRange.collapse(false);
      selection.addRange(newRange);
    }
  };

  const getHeadingClasses = (level: number): string => {
    const baseClasses = "font-bold text-slate-800 my-4";
    switch (level) {
      case 1: return `${baseClasses} text-3xl`;
      case 2: return `${baseClasses} text-2xl`;
      case 3: return `${baseClasses} text-xl`;
      case 4: return `${baseClasses} text-lg`;
      case 5: return `${baseClasses} text-base`;
      case 6: return `${baseClasses} text-sm`;
      default: return baseClasses;
    }
  };

  const handleOrderedList = () => {
    handleFormat('insertOrderedList');
  };

  const handleUnorderedList = () => {
    handleFormat('insertUnorderedList');
  };

  return (
    <div className="border-b border-slate-200 p-3 bg-slate-50">
      <div className="flex items-center gap-2">
        {/* Heading Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-3">
              Heading
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleHeading(1)}>
              <span className="text-2xl font-bold">Heading 1</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleHeading(2)}>
              <span className="text-xl font-bold">Heading 2</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleHeading(3)}>
              <span className="text-lg font-bold">Heading 3</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleHeading(4)}>
              <span className="text-base font-bold">Heading 4</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleHeading(5)}>
              <span className="text-sm font-bold">Heading 5</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleHeading(6)}>
              <span className="text-xs font-bold">Heading 6</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* Text Formatting */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFormat('bold')}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFormat('italic')}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFormat('underline')}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* Lists */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleOrderedList}
          className="h-8 px-3"
          title="Ordered List"
        >
          1. List
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleUnorderedList}
          className="h-8 w-8 p-0"
          title="Unordered List"
        >
          <List className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        {/* Additional Formatting */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFormat('removeFormat')}
          className="h-8 px-3"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
