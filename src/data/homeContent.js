const img = (id, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

export const navLinks = [
  { href: '#beats', label: 'Beats' },
  { href: '#beats', label: 'Licenses' },
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
    alt: 'Midnight Pulse artwork',
    description:
      'Punchy 808s, wide pads, and room for hooks. Mixed for streaming loudness with headroom for vocals.',
    tags: ['#Trap', '#Dark', '#Streaming'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$29', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$79',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
  {
    id: '2',
    title: 'Neon Drift',
    meta: '92 BPM · R&B',
    price: '$35',
    image: img('1514320291840-2e0a9bf2a9ae', 600, 600),
    alt: 'Neon Drift artwork',
    description:
      'Warm keys, swung drums, and silky low end—built for late-night hooks and stacked harmonies.',
    tags: ['#R&B', '#Soul', '#Hooks'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$35', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$89',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
  {
    id: '3',
    title: 'Glass City',
    meta: '128 BPM · Electronic',
    price: '$32',
    image: img('1470225620780-dba8ba36b745', 600, 600),
    alt: 'Glass City artwork',
    description:
      'Glassy synths, driving sidechain, and crisp transients—club-ready with space for ad-libs.',
    tags: ['#Electronic', '#Club', '#Wide'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$32', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$85',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
  {
    id: '4',
    title: 'Velvet Runway',
    meta: '85 BPM · Soul',
    price: '$40',
    image: img('1459749411175-04bf5292ceea', 600, 600),
    alt: 'Velvet Runway artwork',
    description:
      'Velvet chords, live-feel bass, and pocket drums—made for soulful verses and stacked backgrounds.',
    tags: ['#Soul', '#Warm', '#Live'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$40', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$95',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
]

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
