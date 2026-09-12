export interface ProjectItem {
  id: string;
  number: string;
  name: string;
  tagline: string;
  subtitle: string;
  description: string;
  liveUrl: string;
  techPills: string[];
  ctaLabel?: string;
  previewType:
    | 'balaji'
    | 'pooja'
    | 'jic'
    | 'rkk'
    | 'jecrc'
    | 'prozify'
    | 'truetalk'
    | 'aryan';
}

// Ordered for the 3D elliptical carousel matching the approved reference:
// Left: Prozify (-3) -> Truetalk (-2) -> Pooja Clinic (-1) -> Center: Balaji Tiles (0) -> Right: JIC (+1) -> RKK (+2) -> JECRC (+3) -> Behind: Aryan (+4)
export const PROJECT_ITEMS: ProjectItem[] = [
  {
    id: 'balaji-tiles',
    number: '01 / 08',
    name: 'Balaji Tiles',
    tagline: 'Elegance in Every Tile',
    subtitle: 'Premium Tiles for Modern Spaces',
    description:
      'A modern, responsive website for a premium tiles brand showcasing their collections with elegant design and smooth user experience.',
    liveUrl: 'https://balajitiles.com',
    techPills: ['React', 'Tailwind CSS', 'Framer Motion', 'Responsive'],
    ctaLabel: 'EXPLORE COLLECTION →',
    previewType: 'balaji',
  },
  {
    id: 'jic-foundation',
    number: '03 / 08',
    name: 'JIC Foundation',
    tagline: 'Ideas Create Change',
    subtitle: 'Empowering Grassroots Innovation',
    description:
      'An institutional digital platform for social empowerment and youth initiatives, facilitating community outreach and educational development.',
    liveUrl: 'https://jicfoundation.co.in',
    techPills: ['React', 'Next.js', 'CSS Modules', 'Accessible'],
    ctaLabel: 'Learn More →',
    previewType: 'jic',
  },
  {
    id: 'rkk-constructions',
    number: '04 / 08',
    name: 'RKK Constructions',
    tagline: 'Building Stronger Tomorrows',
    subtitle: 'Commercial & Residential Infrastructure',
    description:
      'A corporate digital presence for an infrastructure and construction enterprise, highlighting engineering scale and landmark civil projects.',
    liveUrl: 'https://rkkconstructions.com',
    techPills: ['React', 'Modern Web', 'Performance', 'Responsive'],
    ctaLabel: 'View Portfolio →',
    previewType: 'rkk',
  },
  {
    id: 'jecrc-challenge',
    number: '05 / 08',
    name: 'JECRC Entrepreneur Challenge',
    tagline: 'Ideas Today, Impact Tomorrow.',
    subtitle: 'National Startup & Pitching Summit',
    description:
      'The flagship annual startup and venture summit platform, managing founder registrations, competition tracks, and investor showcases.',
    liveUrl: 'https://jecrentrepreneurchallenge.co.in',
    techPills: ['React', 'Firebase', 'Tailwind CSS', 'Event Portal'],
    ctaLabel: 'Know More →',
    previewType: 'jecrc',
  },
  {
    id: 'aryan-tech',
    number: '08 / 08',
    name: 'Aryan Tech',
    tagline: 'Next-Gen IT & Digital Solutions',
    subtitle: 'Cloud Transformation & Engineering',
    description:
      'A digital agency and technology consultancy platform delivering tailored software engineering and cloud transformation solutions.',
    liveUrl: 'https://aryantech.vercel.app',
    techPills: ['React', 'TypeScript', 'Tailwind CSS', 'Portfolio'],
    ctaLabel: 'Get Started →',
    previewType: 'aryan',
  },
  {
    id: 'prozify',
    number: '06 / 08',
    name: 'Prozify',
    tagline: 'Build Your Productivity',
    subtitle: 'Streamlined Workflows for Modern Teams',
    description:
      'A modern workflow productivity and team management SaaS suite designed to streamline project lifecycles and team velocity.',
    liveUrl: 'https://prozify.com',
    techPills: ['React', 'TypeScript', 'Tailwind CSS', 'SaaS'],
    ctaLabel: 'Learn More →',
    previewType: 'prozify',
  },
  {
    id: 'truetalk',
    number: '07 / 08',
    name: 'Truetalk',
    tagline: 'Speak Freely Connect Deeply',
    subtitle: 'Real-time Audio & Social Platform',
    description:
      'A next-generation real-time voice and communication platform engineered for spontaneous audio conversations and community rooms.',
    liveUrl: 'https://truetalk.co.in',
    techPills: ['React', 'WebRTC', 'Socket.io', 'Realtime'],
    ctaLabel: 'Explore Features →',
    previewType: 'truetalk',
  },
  {
    id: 'pooja-clinic',
    number: '02 / 08',
    name: 'Pooja Speech & Hearing Clinic',
    tagline: 'Better Hearing Brighter Futures',
    subtitle: 'Dedicated Audiology & Speech Therapy',
    description:
      'A comprehensive healthcare portal offering diagnostic hearing evaluations, speech therapy solutions, and online appointment booking.',
    liveUrl: 'https://poojaspeechandhearing.in',
    techPills: ['React', 'TypeScript', 'Healthcare UI', 'Responsive'],
    ctaLabel: 'Book Appointment →',
    previewType: 'pooja',
  },
];
