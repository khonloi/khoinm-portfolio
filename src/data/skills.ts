import type { SkillCategory } from '../types';

export const SKILLS_DATA: SkillCategory[] = [
  {
    id: 'front-end',
    title: 'Front-End Development',
    skills: [
      'HTML5 / CSS3',
      'JavaScript (ES6) / TypeScript',
      'React.js / Next.js',
      'Bootstrap / SCSS / Tailwind CSS',
      'Responsive Design',
      'Animation',
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    skills: [
      'Node.js / Express.js',
      'NestJS',
      'Socket.IO',
      'RESTful APIs / JWT',
    ],
  },
  {
    id: 'tools',
    title: 'Development Tools',
    skills: ['Git / GitHub', 'Vite / Webpack', 'Postman'],
  },
];

export default SKILLS_DATA;
