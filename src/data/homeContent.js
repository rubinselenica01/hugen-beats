const img = (id, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

export const navLinks = [
  { to: '/#beats', label: 'Beats' },
  { to: '/#beats', label: 'Licenses' },
  { to: '/#about', label: 'About' },
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

const catalogBeatsExtra = [
  {
    id: '5',
    title: 'Chrome Static',
    meta: '150 BPM · Hip-Hop',
    price: '$28',
    image: img('1514525253161-7a46d19cd819', 600, 600),
    alt: 'Chrome Static artwork',
    description:
      'Metallic hi-hats, wide stereo keys, and a pocket that stays locked for double-time flows.',
    tags: ['#HipHop', '#Wide', '#Hooks'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$28', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$78',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
  {
    id: '6',
    title: 'Low Tide',
    meta: '95 BPM · Lo-Fi',
    price: '$26',
    image: img('1511671782779-c97d3d27a1d4', 600, 600),
    alt: 'Low Tide artwork',
    description:
      'Dusty drums, soft Rhodes, and tape-style saturation—head-nod grooves for late sessions.',
    tags: ['#LoFi', '#Chill', '#Tape'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$26', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$72',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
  {
    id: '7',
    title: 'Signal Bloom',
    meta: '138 BPM · Future Bass',
    price: '$34',
    image: img('1498038422601-82a377107fcd', 600, 600),
    alt: 'Signal Bloom artwork',
    description:
      'Lush supersaws, tuned 808 slides, and airy tops—built for drops that open up the room.',
    tags: ['#FutureBass', '#Bright', '#Drop'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$34', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$88',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
  {
    id: '8',
    title: 'Basement Echo',
    meta: '88 BPM · Boom Bap',
    price: '$30',
    image: img('1470229530311-64f71b6e6f04', 600, 600),
    alt: 'Basement Echo artwork',
    description:
      'Crisp snares, grimy bass, and vinyl crackle—classic pocket with modern clarity.',
    tags: ['#BoomBap', '#Grimy', '#Classic'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$30', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$80',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
  {
    id: '9',
    title: 'Aurora Keys',
    meta: '120 BPM · Pop',
    price: '$36',
    image: img('1516450760-636588e2f58b', 600, 600),
    alt: 'Aurora Keys artwork',
    description:
      'Bright piano stacks, tight kicks, and hook-friendly lifts—radio-ready without sounding flat.',
    tags: ['#Pop', '#Bright', '#Hooks'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$36', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$92',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
  {
    id: '10',
    title: 'Night Freight',
    meta: '145 BPM · Drill',
    price: '$33',
    image: img('1516280440614-37939bbacd81', 600, 600),
    alt: 'Night Freight artwork',
    description:
      'Sliding 808s, icy percs, and dark pads—space for ad-libs and aggressive cadences.',
    tags: ['#Drill', '#Dark', '#808'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$33', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$86',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
  {
    id: '11',
    title: 'Soft Circuit',
    meta: '102 BPM · Alt R&B',
    price: '$38',
    image: img('1511379938547-c1f69419868d', 600, 600),
    alt: 'Soft Circuit artwork',
    description:
      'Muted guitars, saturated drums, and airy textures—melodic lanes with room to breathe.',
    tags: ['#AltR&B', '#Texture', '#Melodic'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$38', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$94',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
  {
    id: '12',
    title: 'Pulse Atlas',
    meta: '174 BPM · Drum & Bass',
    price: '$31',
    image: img('1514320291840-2e0a9bf2a9ae', 600, 600),
    alt: 'Pulse Atlas artwork',
    description:
      'Rolling breaks, reese bass movement, and crisp highs—energy without harshness.',
    tags: ['#DnB', '#Energy', '#Roll'],
    licenseEyebrow: 'License',
    plans: [
      { name: 'Basic Lease', price: '$31', detail: 'MP3' },
      {
        variant: 'popular',
        name: 'Premium Lease',
        price: '$84',
        detail: 'WAV + Stems',
        badge: 'Popular',
      },
    ],
  },
]

/** Full catalog for the beats listing page (includes featured tracks). */
export const beatsCatalog = [...featuredBeats, ...catalogBeatsExtra]

export const customComposition = {
  sectionTitle: 'Tailored production',
  sectionSubtitle:
    'From brief to master—built around your references and deadlines.',
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
  legal: '©2026 HUGEN BEATS. All rights reserved.',
  developerCredit: '',
  socialLinks: [
    { label: 'YouTube', href: 'https://www.youtube.com/' },
    { label: 'Spotify', href: 'https://open.spotify.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
  ],
}
