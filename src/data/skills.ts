export interface SkillItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  color: string;
  iconType: 'web' | 'android' | 'java' | 'dsa' | 'graphic' | 'video' | 'social' | 'automation' | 'threejs';
  subSkills: string[];
}

export const SKILL_ITEMS: SkillItem[] = [
  {
    id: 'web',
    name: 'WEB',
    category: 'WEB DEVELOPMENT',
    tagline: 'BUILD · SOLVE · CREATE',
    color: '#61DAFB',
    iconType: 'web',
    subSkills: ['JavaScript', 'HTML', 'CSS', 'React'],
  },
  {
    id: 'android',
    name: 'ANDROID',
    category: 'ANDROID DEVELOPMENT',
    tagline: 'KOTLIN · XML · NATIVE APPS',
    color: '#3DDC84',
    iconType: 'android',
    subSkills: ['Kotlin', 'Android', 'XML'],
  },
  {
    id: 'java',
    name: 'JAVA BACKEND',
    category: 'JAVA BACKEND / SPRING BOOT',
    tagline: 'JAVA · SPRING BOOT · APIS',
    color: '#E76F00',
    iconType: 'java',
    subSkills: ['Java', 'Spring Boot', 'REST APIs'],
  },
  {
    id: 'dsa',
    name: 'DSA',
    category: 'DATA STRUCTURES & ALGORITHMS',
    tagline: 'ALGORITHMS · COMPLEXITY · LOGIC',
    color: '#8B5CF6',
    iconType: 'dsa',
    subSkills: ['Data Structures', 'Algorithms', 'Complexity Analysis', 'Problem Solving'],
  },
  {
    id: 'graphic',
    name: 'GRAPHIC DESIGN',
    category: 'GRAPHIC DESIGNING',
    tagline: 'UI/UX · VISUAL CONTENT',
    color: '#FF6B6B',
    iconType: 'graphic',
    subSkills: ['Graphic Design', 'UI/UX', 'Visual Content'],
  },
  {
    id: 'video',
    name: 'VIDEO EDITING',
    category: 'VIDEO EDITING',
    tagline: 'CONTENT CREATION · MOTION',
    color: '#F59E0B',
    iconType: 'video',
    subSkills: ['Video Editing', 'Digital Content Creation'],
  },
  {
    id: 'social',
    name: 'SOCIAL MEDIA',
    category: 'SOCIAL MEDIA MANAGEMENT',
    tagline: 'MANAGEMENT · DIGITAL STRATEGY',
    color: '#EC4899',
    iconType: 'social',
    subSkills: ['Content Management', 'Social Media Management', 'Digital Content'],
  },
  {
    id: 'automation',
    name: 'AUTOMATION',
    category: 'AUTOMATION BUILDING',
    tagline: 'WORKFLOWS · AI-ASSISTED · SPEED',
    color: '#10B981',
    iconType: 'automation',
    subSkills: ['Workflow Automation', 'AI-assisted Automation', 'Digital Workflow Optimization'],
  },
  {
    id: 'threejs',
    name: 'THREE.JS / 3D WEB',
    category: 'THREE.JS & 3D WEB DEVELOPMENT',
    tagline: 'WEBGL · 3D EXPERIENCES',
    color: '#FFFFFF',
    iconType: 'threejs',
    subSkills: ['Three.js', '3D Web Development', 'Interactive Web Experiences'],
  },
];
