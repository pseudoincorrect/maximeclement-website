export const SITE = {
  name: 'Maxime Clément',
  url: 'https://www.maximeclement.com',
  email: 'maximeclement6@gmail.com',
  tagline: 'Data Engineer',
  description:
    'Hello! I am Maxime Clément, Data Engineer working on datalakes, microservices and databases. Formerly an IoT Engineer, I used to link anything to the web... now I take care of the data behind it.',
  socials: {
    linkedin: 'https://www.linkedin.com/in/maximeclement-iot/',
    github: 'https://github.com/pseudoincorrect',
    codewars: 'https://www.codewars.com/users/pseudoincorrect',
  },
};

export const NAV = [
  { name: 'Home', href: '/', icon: 'home' },
  { name: 'Projects', href: '/projects/', icon: 'folder' },
  { name: 'Skills', href: '/skills/', icon: 'cpu' },
  { name: 'Career', href: '/path/', icon: 'route' },
  { name: 'Leisure', href: '/leisure/', icon: 'bike' },
  { name: 'Contact', href: '/contact/', icon: 'mail' },
  { name: 'Documents', href: '/documents/', icon: 'file' },
] as const;
