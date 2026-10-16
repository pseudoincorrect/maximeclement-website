export const SITE = {
  name: 'Maxime Clément',
  url: 'https://www.maximeclement.com',
  email: 'maximeclement6@gmail.com',
  tagline: 'IoT Engineer',
  description:
    'Hello! I am Maxime Clément, IoT Engineer (Internet of Things) focused on cloud technologies for physical devices. I can link anything to the web... at scale!',
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
