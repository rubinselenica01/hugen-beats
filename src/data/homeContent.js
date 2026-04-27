import { producerBrand } from '../producerBrand.js'

const img = (id, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`

/** Footer contact & socials — override via `.env` (see `.env.example`). */
const footerValues = {
  email:
    import.meta.env.VITE_CONTACT_EMAIL ?? 'hello@hugenmusic.example',
  youtube:
    import.meta.env.VITE_SOCIAL_YOUTUBE ??
    'https://www.youtube.com/@hugenmusic',
  spotify:
    import.meta.env.VITE_SOCIAL_SPOTIFY ??
    'https://open.spotify.com/artist/61zp7kZ3ICWnbroQhCH6KB?si=ZaGsW-n4Q6qrtwefrvp4Bw&nd=1&dlsi=4ed240a00618455c',
  instagram:
    import.meta.env.VITE_SOCIAL_INSTAGRAM ??
    'https://www.instagram.com/hugenmusic',
}

export const navLinks = [
  { to: '/#beats', label: 'Beats' },
  { to: '/#beats', label: 'Licenses', licensesOverlay: true },
  { to: '/#about', label: 'About' },
]

/** Top nav on /beats — omits home-only anchors (featured beats, about). */
export const navLinksCatalog = [
  { to: '/#beats', label: 'Licenses', licensesOverlay: true },
]

/** Copy shown when opening Licenses from the nav (blurred backdrop overlay). */
export const licensesOverlayContent = {
  title: 'Licenses',
  paragraphs: [
    'Every beat is offered under a non-exclusive lease: you get the files you need with a lifetime license in one clear package.',
    'Need exclusive rights, film clearance, or custom terms? Use the contact details in the footer and we will align the paperwork with your project.',
  ],
}

export const hero = {
  title: producerBrand,
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
    price: '$79',
    image: img('1511379938547-c1f69419868d', 600, 600),
    alt: 'Midnight Pulse artwork',
    description:
      'Punchy 808s, wide pads, and room for hooks. Mixed for streaming loudness with headroom for vocals.',
    tags: ['#Trap', '#Dark', '#Streaming'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$79',
        detail: 'MP4 + WAV + lifetime license',
      },
    ],
  },
  {
    id: '2',
    title: 'Neon Drift',
    meta: '92 BPM · R&B',
    price: '$89',
    image: img('1514320291840-2e0a9bf2a9ae', 600, 600),
    alt: 'Neon Drift artwork',
    description:
      'Warm keys, swung drums, and silky low end—built for late-night hooks and stacked harmonies.',
    tags: ['#R&B', '#Soul', '#Hooks'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$89',
        detail: 'MP4 + WAV + lifetime license',
      },
    ],
  },
  {
    id: '3',
    title: 'Glass City',
    meta: '128 BPM · Electronic',
    price: '$85',
    image: img('1470225620780-dba8ba36b745', 600, 600),
    alt: 'Glass City artwork',
    description:
      'Glassy synths, driving sidechain, and crisp transients—club-ready with space for ad-libs.',
    tags: ['#Electronic', '#Club', '#Wide'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$85',
        detail: 'MP4 + WAV + lifetime license',
      },
    ],
  },
  {
    id: '4',
    title: 'Velvet Runway',
    meta: '85 BPM · Soul',
    price: '$95',
    image: img('1459749411175-04bf5292ceea', 600, 600),
    alt: 'Velvet Runway artwork',
    description:
      'Velvet chords, live-feel bass, and pocket drums—made for soulful verses and stacked backgrounds.',
    tags: ['#Soul', '#Warm', '#Live'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$95',
        detail: 'MP4 + WAV + lifetime license',
      },
    ],
  },
]

const catalogBeatsExtra = [
  {
    id: '5',
    title: 'Chrome Static',
    meta: '150 BPM · Hip-Hop',
    price: '$78',
    image: img('1514525253161-7a46d19cd819', 600, 600),
    alt: 'Chrome Static artwork',
    description:
      'Metallic hi-hats, wide stereo keys, and a pocket that stays locked for double-time flows.',
    tags: ['#HipHop', '#Wide', '#Hooks'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$78',
        detail: 'MP4 + WAV + lifetime license',
      },
    ],
  },
  {
    id: '6',
    title: 'Low Tide',
    meta: '95 BPM · Lo-Fi',
    price: '$72',
    image: img('1511671782779-c97d3d27a1d4', 600, 600),
    alt: 'Low Tide artwork',
    description:
      'Dusty drums, soft Rhodes, and tape-style saturation—head-nod grooves for late sessions.',
    tags: ['#LoFi', '#Chill', '#Tape'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$72',
        detail: 'MP4 + WAV + lifetime license',
      },
    ],
  },
  {
    id: '7',
    title: 'Signal Bloom',
    meta: '138 BPM · Future Bass',
    price: '$88',
    image: img('1498038422601-82a377107fcd', 600, 600),
    alt: 'Signal Bloom artwork',
    description:
      'Lush supersaws, tuned 808 slides, and airy tops—built for drops that open up the room.',
    tags: ['#FutureBass', '#Bright', '#Drop'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$88',
        detail: 'MP4 + WAV + lifetime license',
      },
    ],
  },
  {
    id: '8',
    title: 'Basement Echo',
    meta: '88 BPM · Boom Bap',
    price: '$80',
    image: img('1470229530311-64f71b6e6f04', 600, 600),
    alt: 'Basement Echo artwork',
    description:
      'Crisp snares, grimy bass, and vinyl crackle—classic pocket with modern clarity.',
    tags: ['#BoomBap', '#Grimy', '#Classic'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$80',
        detail: 'MP4 + WAV + lifetime license',
      },
    ],
  },
  {
    id: '9',
    title: 'Aurora Keys',
    meta: '120 BPM · Pop',
    price: '$92',
    image: img('1516450760-636588e2f58b', 600, 600),
    alt: 'Aurora Keys artwork',
    description:
      'Bright piano stacks, tight kicks, and hook-friendly lifts—radio-ready without sounding flat.',
    tags: ['#Pop', '#Bright', '#Hooks'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$92',
        detail: 'MP4 + WAV + lifetime license',
      },
    ],
  },
  {
    id: '10',
    title: 'Night Freight',
    meta: '145 BPM · Drill',
    price: '$86',
    image: img('1516280440614-37939bbacd81', 600, 600),
    alt: 'Night Freight artwork',
    description:
      'Sliding 808s, icy percs, and dark pads—space for ad-libs and aggressive cadences.',
    tags: ['#Drill', '#Dark', '#808'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$86',
        detail: 'MP4 + WAV + lifetime license',
      },
    ],
  },
  {
    id: '11',
    title: 'Soft Circuit',
    meta: '102 BPM · Alt R&B',
    price: '$94',
    image: img('1511379938547-c1f69419868d', 600, 600),
    alt: 'Soft Circuit artwork',
    description:
      'Muted guitars, saturated drums, and airy textures—melodic lanes with room to breathe.',
    tags: ['#AltR&B', '#Texture', '#Melodic'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$94',
        detail: 'MP4 + WAV + lifetime license',
      },
    ],
  },
  {
    id: '12',
    title: 'Pulse Atlas',
    meta: '174 BPM · Drum & Bass',
    price: '$84',
    image: img('1514320291840-2e0a9bf2a9ae', 600, 600),
    alt: 'Pulse Atlas artwork',
    description:
      'Rolling breaks, reese bass movement, and crisp highs—energy without harshness.',
    tags: ['#DnB', '#Energy', '#Roll'],
    licenseEyebrow: 'License',
    plans: [
      {
        name: 'Full License',
        price: '$84',
        detail: 'MP4 + WAV + lifetime license',
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
  email: footerValues.email,
  location: 'Remote · Worldwide',
  legal: `©2026 ${producerBrand.toUpperCase()}. All rights reserved.`,
  developerCredit: '',
  socialLinks: [
    { label: 'YouTube', href: footerValues.youtube },
    { label: 'Spotify', href: footerValues.spotify },
    { label: 'Instagram', href: footerValues.instagram },
  ],
}
