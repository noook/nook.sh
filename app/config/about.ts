export interface HistoryEntry {
  company: string;
  title: string;
  start: Date;
  end: Date | null;
  description: string;
}

export const birth = {
  year: 1999,
  month: 8,
  day: 14,
};

export const experiences: HistoryEntry[] = [
  {
    company: 'Zest',
    start: new Date(2018, 6 - 1),
    end: new Date(2018, 9 - 1),
    title: 'Full-stack Javascript internship',
    description: 'Participation in the improvement of the platform and in the development of new features on the front and API part. Front made with Angular.js and back with PostgreSQL and Node.js.',
  },
  {
    company: 'Golem.ai',
    start: new Date(2019, 2 - 1),
    end: new Date(2019, 9 - 1),
    title: 'Full-stack Symfony + Vue.js Internship',
    description: 'Participation in the creation of Web tools for Golem.ai, research and development work, and product development. Technologies used: Vue.js, Symfony3 and 4, PostgreSQL, Docker',
  },
  {
    company: 'HEC',
    start: new Date(2021, 1 - 1),
    end: new Date(2021, 1 - 1),
    title: 'Teacher',
    description: 'Teaching at HEC, the world-class business school. Winter Coding & Digital Camp, initiation to HTML, CSS and JavaScript. Taught in english.',
  },
  {
    company: 'Golem.ai',
    start: new Date(2020, 1 - 1),
    end: new Date(2022, 1 - 1),
    title: 'Lead Developer Front-End',
    description: 'Head of front-end development and architecture. Redesign of the AI configuration interface, implementation of design systems, development of products used by projects carried out by Golem.ai.',
  },
  {
    company: 'Epitech Digital',
    start: new Date(2021, 9 - 1),
    end: null,
    title: 'Teacher',
    description: 'Teaching at Epitech Digital, the school of the web\'s high potentials. Algorithmy initiation, Portfolios, Vue.js',
  },
  {
    company: 'Beamy.io',
    start: new Date(2022, 1 - 1),
    end: null,
    title: 'Fullstack Developer Typescript (Nuxt.js + Nest.js)',
    description: 'Development of the SaaS platform, improvement of performances and migration of tools like AgGrid or development tooling.',
  },
];

export const education: HistoryEntry[] = [
  {
    company: 'Lycée Privé Robert Schuman',
    start: new Date(2015, 9 - 1),
    end: new Date(2017, 8 - 1),
    title: 'High-school',
    description: 'Bachelor\'s degree of Science and Technology in Industry and Sustainable Development, mention Very Good',
  },
  {
    company: 'Epitech Digital',
    start: new Date(2017, 9 - 1),
    end: new Date(2020, 8 - 1),
    title: 'Web Project Management Bachelor',
    description: 'Web project Management Bachelor, specialized in Web Development. Graduated as valedictorian',
  },
];

export interface Skill {
  class: string;
  name: string;
}

export const skills: Skill[] = [
  {
    class: 'vuejs',
    name: 'Vue.js',
  },
  {
    class: 'javascript',
    name: 'Javascript',
  },
  {
    class: 'typescript',
    name: 'Typescript',
  },
  {
    class: 'nest',
    name: 'Nest.js',
  },
  {
    class: 'nuxt',
    name: 'Nuxt.js',
  },
  {
    class: 'symfony',
    name: 'Symfony',
  },
  {
    class: 'php',
    name: 'PHP',
  },
  {
    class: 'nodejs',
    name: 'Node.js',
  },
  {
    class: 'nginx',
    name: 'Nginx',
  },
  {
    class: 'sass',
    name: 'Sass',
  },
  {
    class: 'docker',
    name: 'Docker',
  },
  {
    class: 'git',
    name: 'Git',
  },
  {
    class: 'go',
    name: 'Golang',
  },
  {
    class: 'postgresql',
    name: 'PostgreSQL',
  },
  {
    class: 'python',
    name: 'Python',
  },
];
