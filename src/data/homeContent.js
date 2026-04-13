const img = (id, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

export const navLinks = [
  { href: '#beats', label: 'Beats' },
  { href: '#licenses', label: 'Licenses' },
  { href: '#about', label: 'About' },
]

export const hero = {
  title: 'HUGEN BEATS',
  subtitle: [
    'Immersive production for artists who want depth, clarity, and motion.',
    'Stream, license, or build something custom.',
  ],
  backgroundImage: img('1493225457124-a3eb161ffa5f', 1920, 1080),
}

export const featuredBeats = [
  {
    id: '1',
    title: 'Midnight Pulse',
    meta: '140 BPM · Trap',
    price: '$29',
    image: img('1511379938547-c1f69419868d', 600, 600),
    alt: 'Album art',
  },
  {
    id: '2',
    title: 'Neon Drift',
    meta: '92 BPM · R&B',
    price: '$35',
    image: img('1514320291840-2e0a9bf2a9ae', 600, 600),
    alt: 'Album art',
  },
  {
    id: '3',
    title: 'Glass City',
    meta: '128 BPM · Electronic',
    price: '$32',
    image: img('1470225620780-dba8ba36b745', 600, 600),
    alt: 'Album art',
  },
  {
    id: '4',
    title: 'Velvet Runway',
    meta: '85 BPM · Soul',
    price: '$40',
    image: img('1459749411175-04bf5292ceea', 600, 600),
    alt: 'Album art',
  },
]

export const spotlight = {
  title: 'Exclusive License Pack',
  description:
    'Get stems, alternate mixes, and priority support for your next release.',
  tags: ['Stems', 'Broadcast'],
  image: img('1511671782779-c97d3d27a1d4', 800, 600),
  alt: 'Studio spotlight',
  plans: [
    {
      variant: 'popular',
      name: 'Pro',
      price: '$199',
      detail: 'per track',
      badge: 'Popular',
    },
    {
      name: 'Indie',
      price: '$99',
      detail: 'per track',
    },
  ],
}

export const customComposition = {
  eyebrow: 'Custom work',
  title: 'Built for your story',
  description:
    'From reference tracks to final master, we shape the sound around your vision.',
  features: [
    {
      icon: 'graphic_eq',
      title: 'Mix-ready stems',
      text: 'Organized sessions you can hand to any engineer.',
    },
    {
      icon: 'schedule',
      title: 'Fast iterations',
      text: 'Tight feedback loops so you never lose momentum.',
    },
    {
      icon: 'verified',
      title: 'Release-ready',
      text: 'Masters tuned for streaming loudness targets.',
    },
  ],
  startingPrice: '$1000',
  cta: 'Start a project',
  sideImage: img('1598488035139-03d029a0ce5a', 600, 800),
}

export const about = {
  eyebrow: 'The studio',
  title: 'Sound design with intent',
  portrait: img('1507003211169-0a1dd7228f2d', 800, 1000),
  paragraphs: [
    'We build immersive beats that sit deep in the mix—wide, textured, and alive.',
  ],
  paragraph2: {
    before: 'Every loop is a starting point. ',
    emphasis: 'Your arrangement',
    after: ' is where the story lands.',
  },
  credits: ['Film', 'Games', 'Artists', 'Brands'],
}

export const footer = {
  email: 'hello@hugenbeats.example',
  location: 'Remote · Worldwide',
  legal: '© HUGEN BEATS. All rights reserved.',
  developerCredit: '',
  socialLinks: [
    { label: 'YouTube', href: 'https://www.youtube.com/' },
    { label: 'Spotify', href: 'https://open.spotify.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
  ],
}
