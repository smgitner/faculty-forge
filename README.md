
# FacultyForge - Course Material Editor

FacultyForge is a comprehensive web-based editor designed specifically for educators to create, manage, and organize course materials. Built with modern web technologies, it provides an intuitive interface for developing syllabi, lesson plans, rubrics, and other educational content.

## Overview

FacultyForge streamlines the course development process by offering a structured, document-centric approach to educational content creation. The application features a professional interface similar to traditional document editors but specifically tailored for academic use cases.

## Current Functionality

### 📝 Document Management
- **Multi-document workspace** with sidebar navigation
- **Syllabus-focused editing** with predefined sections
- **Document outlining** with hierarchical content organization
- **Real-time content editing** with rich text capabilities

### 🎨 User Interface
- **Professional toolbar** with traditional menu bar (File, Edit, View, Insert, Format, AI Tools, Tools, Help)
- **Collapsible sidebar** for document navigation
- **Inspector panel** for detailed document properties (toggleable)
- **Responsive design** that works across different screen sizes

### 📋 Syllabus Structure
The application comes pre-configured with a comprehensive syllabus template including:
- Course Overview
- Instructor Information (details, office hours, contact)
- Course Basics (meeting times, description, prerequisites, credits, audience)
- Values & Principles (learning objectives)
- Course Requirements (assessment methods)
- Policies (attendance, late work, academic integrity)
- Schedule Overview

### ✏️ Content Editing
- **Rich text editor** with formatting capabilities
- **Section-based editing** allowing selection of multiple sections
- **Content persistence** within the browser session
- **Formatting toolbar** with bold, italic, and underline options
- **Document sectioning** with expandable/collapsible outline view

### 📤 Export Capabilities
- **ZIP export functionality** for complete project backup
- Export includes all document content and project metadata
- Generates downloadable files for offline storage

### 🤖 AI Integration (UI Ready)
- Menu structure prepared for AI-powered features including:
  - Syllabus content generation
  - Learning objective creation
  - Course calendar building
  - Lesson plan generation
  - Rubric building
  - Grammar checking and style suggestions

## Technical Architecture

### Built With
- **React 18** - Modern component-based UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Lucide React** - Comprehensive icon set
- **JSZip** - Client-side ZIP file generation

### Key Components
- `Toolbar` - Main application toolbar with menu system
- `MainEditor` - Primary content editing interface
- `DocumentOutline` - Hierarchical content navigation
- `ContentEditor` - Rich text editing capabilities
- `InspectorPanel` - Document properties and metadata
- `FormattingToolbar` - Text formatting controls

## Project Structure

```
src/
├── components/
│   ├── editor/
│   │   ├── ContentEditor.tsx      # Main content editing
│   │   ├── DocumentHeader.tsx     # Document title and metadata
│   │   ├── DocumentOutline.tsx    # Hierarchical navigation
│   │   └── FormattingToolbar.tsx  # Text formatting controls
│   ├── ui/                        # shadcn/ui components
│   ├── MainEditor.tsx             # Primary editor interface
│   ├── Toolbar.tsx                # Application toolbar
│   └── ...
├── data/
│   └── syllabusData.ts           # Predefined content templates
├── utils/
│   └── exportUtils.ts            # Export functionality
└── pages/
    └── Index.tsx                 # Main application page
```

## Current Limitations

- **Frontend-only application** - No backend persistence
- **Browser storage** - Data persists only within browser session
- **No user authentication** - Single-user experience
- **Limited file import** - No Word document import yet implemented
- **AI features** - UI prepared but not yet connected to AI services

## Future Development Opportunities

### Backend Integration
- Supabase integration for persistent storage
- User authentication and multi-user support
- Cloud synchronization across devices

### Enhanced Features
- Word document import/export
- PDF generation
- Collaborative editing
- Template library expansion
- Advanced AI content generation

### Export Enhancements
- Multiple export formats (PDF, Word, PowerPoint)
- Custom styling and branding options
- Batch export capabilities

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd facultyforge

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage
1. Open the application in your browser
2. Use the sidebar to navigate between document sections
3. Select sections from the outline to edit content
4. Use the formatting toolbar for text styling
5. Export your project using File > Export Project as ZIP

## Contributing

This project is built using Lovable, an AI-powered development platform. Contributions can be made through:
- Direct code editing in development mode
- Feature requests and bug reports
- UI/UX improvements
- Documentation updates

## License

This project is part of the Lovable platform ecosystem. Please refer to the Lovable terms of service for usage guidelines.

---

**Note**: This is an active development project. Features and functionality may evolve rapidly. Check back frequently for updates and new capabilities.
