export interface SyllabusSection {
  id: string;
  title: string;
  content: string;
}

export interface DocumentContent {
  title: string;
  content: string;
  type: 'syllabus' | 'lesson' | 'rubric' | 'textbook';
  lastModified: string;
}

export const syllabusContent: Record<string, SyllabusSection> = {
  'syllabus-intro': {
    id: 'syllabus-intro',
    title: 'Course Overview',
    content: `PSY 101 - Introduction to Psychology<br><br>
Welcome to Introduction to Psychology! This course will provide you with a solid foundation in psychological science and its applications to everyday life.`
  },
  'instructor-details': {
    id: 'instructor-details',
    title: 'Instructor Details',
    content: `Dr. Sarah Johnson, Ph.D.<br>
Email: s.johnson@university.edu<br>
Phone: (555) 123-4567<br>
Office: Psychology Building, Room 301`
  },
  'office-hours': {
    id: 'office-hours',
    title: 'Office Hours',
    content: `Monday: 2:00 PM - 4:00 PM<br>
Wednesday: 10:00 AM - 12:00 PM<br>
Friday: 1:00 PM - 3:00 PM<br>
Or by appointment`
  },
  'contact-information': {
    id: 'contact-information',
    title: 'Contact Information',
    content: `Best method of contact: Email<br>
Response time: Within 24 hours during business days<br>
Emergency contact: Department office (555) 123-4500`
  },
  'meeting-day-time': {
    id: 'meeting-day-time',
    title: 'Meeting Day/Time',
    content: `Tuesday & Thursday: 9:00 AM - 10:30 AM<br>
Location: Psychology Building, Room 150<br>
Lab Sessions: Friday 2:00 PM - 4:00 PM (Room 152)`
  },
  'course-description': {
    id: 'course-description',
    title: 'Course Description',
    content: `This course provides students with a comprehensive introduction to the scientific study of behavior and mental processes. Topics include research methods, biological bases of behavior, sensation and perception, learning, memory, cognition, personality, abnormal psychology, and social psychology.`
  },
  'prerequisites': {
    id: 'prerequisites',
    title: 'Prerequisites/Co-requisites',
    content: `Prerequisites: None<br>
Co-requisites: None<br>
Recommended: High school biology and statistics`
  },
  'credits': {
    id: 'credits',
    title: 'Credits',
    content: `3 Credit Hours<br>
General Education: Social Sciences<br>
This course satisfies the university's general education requirements for social sciences.`
  },
  'audience': {
    id: 'audience',
    title: 'Audience',
    content: `This course is designed for:<br>
• Psychology majors and minors<br>
• Students fulfilling general education requirements<br>
• Pre-professional students (pre-med, pre-law, etc.)<br>
• Anyone interested in understanding human behavior`
  },
  'values-principles': {
    id: 'values-principles',
    title: 'Values & Principles',
    content: `Our classroom is built on mutual respect, academic integrity, and inclusive learning. We value diverse perspectives and encourage open dialogue while maintaining a supportive environment for all students.`
  },
  'learning-objectives': {
    id: 'learning-objectives',
    title: 'Learning Objectives',
    content: `By the end of this course, students will be able to:<br>
• Demonstrate understanding of major psychological theories<br>
• Apply scientific methods to psychological research<br>
• Analyze behavior from multiple psychological perspectives<br>
• Communicate psychological concepts effectively`
  },
  'assessment-methods': {
    id: 'assessment-methods',
    title: 'Assessment Methods',
    content: `Exams: 40%<br>
Research Paper: 25%<br>
Lab Reports: 20%<br>
Class Participation: 15%`
  },
  'attendance-policy': {
    id: 'attendance-policy',
    title: 'Attendance Policy',
    content: `Regular attendance is expected. More than 3 unexcused absences may result in a grade reduction. Please notify me in advance of any planned absences.`
  },
  'late-work-policy': {
    id: 'late-work-policy',
    title: 'Late Work Policy',
    content: `Late assignments will be penalized 10% per day unless prior arrangements are made. Extensions may be granted for documented emergencies or health issues.`
  },
  'academic-integrity': {
    id: 'academic-integrity',
    title: 'Academic Integrity',
    content: `All work must be your own. Plagiarism and cheating will result in course failure. When in doubt about citations or collaboration, please ask for clarification.`
  },
  'schedule-overview': {
    id: 'schedule-overview',
    title: 'Schedule Overview',
    content: `Week 1-4: Foundations of Psychology<br>
Week 5-8: Research Methods & Statistics<br>
Week 9-12: Cognitive & Developmental Psychology<br>
Week 13-16: Social & Abnormal Psychology`
  }
};

export const documents: Record<string, DocumentContent> = {
  'lesson-week1': {
    title: 'Week 1: Introduction',
    content: `Week 1: Course Introduction
Date: September 3, 2024
Duration: 50 minutes

Learning Objectives
Students will be able to:
- Understand course expectations and requirements
- Identify key concepts in psychology
- Recognize the importance of scientific thinking`,
    type: 'lesson',
    lastModified: '1 hour ago'
  }
};
