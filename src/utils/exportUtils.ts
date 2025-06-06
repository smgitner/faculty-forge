
import JSZip from 'jszip';
import { syllabusContent, documents } from '../data/syllabusData';

export interface ProjectData {
  documents: typeof documents;
  syllabusContent: typeof syllabusContent;
  metadata: {
    exportDate: string;
    version: string;
    projectName: string;
  };
}

export const generateProjectZip = async (projectName: string = 'FacultyForge_Project'): Promise<Blob> => {
  const zip = new JSZip();
  
  // Create project metadata
  const metadata = {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    projectName
  };

  // Prepare project data
  const projectData: ProjectData = {
    documents,
    syllabusContent,
    metadata
  };

  // Add main project file
  zip.file('project.json', JSON.stringify(projectData, null, 2));

  // Create documents folder
  const documentsFolder = zip.folder('documents');
  if (documentsFolder) {
    Object.entries(documents).forEach(([key, doc]) => {
      const fileName = `${key}.json`;
      documentsFolder.file(fileName, JSON.stringify(doc, null, 2));
    });
  }

  // Create syllabus sections folder
  const syllabusFolder = zip.folder('syllabus_sections');
  if (syllabusFolder) {
    Object.entries(syllabusContent).forEach(([key, section]) => {
      const fileName = `${key}.json`;
      syllabusFolder.file(fileName, JSON.stringify(section, null, 2));
    });
  }

  // Create a README file
  const readmeContent = `# ${projectName}

This is a FacultyForge project export created on ${new Date().toLocaleDateString()}.

## Contents:
- project.json: Complete project data
- documents/: Individual document files
- syllabus_sections/: Individual syllabus section files

## How to use:
Import this zip file back into FacultyForge to restore your project.

Generated by FacultyForge v${metadata.version}
`;

  zip.file('README.md', readmeContent);

  // Generate the zip file
  return await zip.generateAsync({ type: 'blob' });
};

export const downloadZipFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportProject = async (projectName?: string) => {
  try {
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${projectName || 'FacultyForge_Project'}_${timestamp}.zip`;
    
    console.log('Starting project export...');
    const zipBlob = await generateProjectZip(projectName);
    
    console.log('Downloading zip file...');
    downloadZipFile(zipBlob, fileName);
    
    console.log('Export completed successfully');
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};
