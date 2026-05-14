export type SectionType = 'once' | 'humans'

export type ContentPage = {
  id: string
  section: SectionType
  title: string
  category: string
  subcategory: string
  description: string
  gallery: string[]
  relatedIds?: string[]
  searchTerms?: string[]
}

export type Subcategory = {
  title: string
  description: string
}

export type Category = {
  title: string
  description: string
  accent: string
  subcategories: Subcategory[]
}

export type PendingSubmission = {
  id: string
  section: SectionType
  category: string
  subcategory: string
  title: string
  description: string
  gallery: string[]
  createdAt: string
}

export const pendingSubmissionsStorageKey = 'once-humans-pending-submissions'

export const categories: Record<SectionType, Category[]> = {
  once: [
    {
      title: 'Inventions',
      description: 'Objects and breakthroughs that changed the world.',
      accent: 'from-amber-200 via-orange-200 to-rose-200',
      subcategories: [
        { title: 'Household', description: 'Everyday tools that reshaped home life.' },
        { title: 'Transportation', description: 'Ways humans learned to move farther.' },
        { title: 'Communication', description: 'Tools for carrying ideas across distance.' },
        { title: 'Computing', description: 'Machines and systems for processing information.' },
        { title: 'Energy', description: 'Ways humans stored, moved, and used power.' },
        { title: 'Agriculture', description: 'Tools that changed how food is grown.' },
        { title: 'Tools', description: 'Practical devices that extend human hands.' },
        { title: 'Infrastructure', description: 'Systems that make daily life possible at scale.' },
      ],
    },
    {
      title: 'Art',
      description: 'Visual forms, paintings, and stories from human hands.',
      accent: 'from-violet-200 via-fuchsia-200 to-rose-200',
      subcategories: [
        { title: 'Painting', description: 'Images made with pigment, surface, and time.' },
        { title: 'Sculpture', description: 'Objects shaped into lasting forms.' },
        { title: 'Design', description: 'Useful beauty in objects, spaces, and systems.' },
        { title: 'Architecture', description: 'Built spaces shaped with intention and meaning.' },
        { title: 'Photography', description: 'Images made by light, lens, and timing.' },
        { title: 'Ceramics', description: 'Clay shaped into useful and expressive forms.' },
        { title: 'Typography', description: 'Letterforms arranged for reading and feeling.' },
        { title: 'Glasswork', description: 'Transparent and colored material shaped by heat.' },
      ],
    },
    {
      title: 'Music',
      description: 'Sound and rhythm that echo history and feeling.',
      accent: 'from-sky-200 via-cyan-200 to-teal-200',
      subcategories: [
        { title: 'Instruments', description: 'Tools made to organize sound.' },
        { title: 'Genres', description: 'Shared languages for making music.' },
        { title: 'Recording', description: 'Ways sound became repeatable.' },
        { title: 'Notation', description: 'Systems for writing and preserving music.' },
        { title: 'Popular Music', description: 'Musical forms shaped by mass culture.' },
      ],
    },
    {
      title: 'Literature',
      description: 'Written worlds, myths, and voices preserved over time.',
      accent: 'from-lime-200 via-emerald-200 to-teal-200',
      subcategories: [
        { title: 'Novels', description: 'Long stories of invented lives.' },
        { title: 'Poetry', description: 'Language condensed into rhythm and image.' },
        { title: 'Myths', description: 'Stories that carried meaning across generations.' },
        { title: 'Epics', description: 'Long foundational stories of journeys and origins.' },
        { title: 'Reference', description: 'Books and systems made to organize knowledge.' },
        { title: 'Journalism', description: 'Writing built around public events and evidence.' },
        { title: 'Folklore', description: 'Stories carried by communities across time.' },
      ],
    },
    {
      title: 'Performance',
      description: 'Stage, movement, and live expression in human culture.',
      accent: 'from-pink-200 via-orange-200 to-amber-200',
      subcategories: [
        { title: 'Theater', description: 'Stories performed live for an audience.' },
        { title: 'Dance', description: 'Movement shaped into expression.' },
        { title: 'Cinema', description: 'Performance captured by camera and edit.' },
        { title: 'Ballet', description: 'Classical movement shaped by discipline and stage.' },
        { title: 'Sport', description: 'Physical contests that became shared spectacle.' },
        { title: 'Comedy', description: 'Performance built around timing, surprise, and release.' },
        { title: 'Opera', description: 'Drama carried by voice, music, and stage.' },
        { title: 'Film', description: 'Moving images shaped into public stories.' },
      ],
    },
    {
      title: 'Science',
      description: 'Ideas and discoveries that shaped what we know.',
      accent: 'from-cyan-200 via-sky-200 to-blue-200',
      subcategories: [
        { title: 'Physics', description: 'Matter, motion, light, and force.' },
        { title: 'Medicine', description: 'Knowledge for healing bodies.' },
        { title: 'Astronomy', description: 'Ways humans studied the sky.' },
        { title: 'Biology', description: 'Knowledge about living systems.' },
        { title: 'Chemistry', description: 'Substances, reactions, and hidden structures.' },
        { title: 'Earth Science', description: 'The planet studied as land, water, air, and time.' },
        { title: 'Mathematics', description: 'Patterns, quantity, proof, and structure.' },
        { title: 'Methods', description: 'Ways of testing, measuring, and knowing.' },
      ],
    },
  ],
  humans: [
    {
      title: 'Creators',
      description: 'People who shape stories, objects, and worlds.',
      accent: 'from-rose-200 via-fuchsia-200 to-violet-200',
      subcategories: [
        { title: 'Inventors', description: 'People who made new tools possible.' },
        { title: 'Makers', description: 'Hands-on builders of useful things.' },
        { title: 'Visionaries', description: 'People who imagined new directions.' },
        { title: 'Pioneers', description: 'People who opened paths others could follow.' },
        { title: 'Entrepreneurs', description: 'People who turned ideas into public ventures.' },
        { title: 'Explorers', description: 'People who crossed boundaries and mapped possibility.' },
        { title: 'Reformers', description: 'People who pushed society toward change.' },
      ],
    },
    {
      title: 'Artists',
      description: 'Visual and performing makers of emotion and form.',
      accent: 'from-amber-200 via-orange-200 to-rose-200',
      subcategories: [
        { title: 'Painters', description: 'Artists who worked with surface and color.' },
        { title: 'Sculptors', description: 'Artists who shaped physical form.' },
        { title: 'Designers', description: 'Artists of practical visual systems.' },
        { title: 'Photographers', description: 'Artists who worked with light and image.' },
        { title: 'Architects', description: 'Artists who shaped buildings and public space.' },
        { title: 'Illustrators', description: 'Artists who made images for stories and ideas.' },
      ],
    },
    {
      title: 'Builders',
      description: 'Builders of machines, systems, and practical progress.',
      accent: 'from-slate-200 via-slate-300 to-slate-400',
      subcategories: [
        { title: 'Computing', description: 'People who shaped digital systems.' },
        { title: 'Machines', description: 'Builders of physical mechanisms.' },
        { title: 'Structures', description: 'People who made durable environments.' },
        { title: 'Electrical', description: 'People who shaped power and signal systems.' },
        { title: 'Aerospace', description: 'People who helped flight and space travel work.' },
        { title: 'Civil', description: 'People who built infrastructure and cities.' },
        { title: 'Software', description: 'People who shaped programs, networks, and code.' },
      ],
    },
    {
      title: 'Thinkers',
      description: 'Thinkers who turned curiosity into knowledge.',
      accent: 'from-cyan-200 via-sky-200 to-blue-200',
      subcategories: [
        { title: 'Physics', description: 'People who studied matter and motion.' },
        { title: 'Chemistry', description: 'People who studied substances and change.' },
        { title: 'Astronomy', description: 'People who studied worlds beyond Earth.' },
        { title: 'Biology', description: 'People who studied life and living systems.' },
        { title: 'Medicine', description: 'People who changed health and healing.' },
        { title: 'Mathematics', description: 'People who worked with proof, pattern, and number.' },
        { title: 'Earth Science', description: 'People who studied the planet and its systems.' },
        { title: 'Playwrights', description: 'Thinkers who wrote for performance.' },
        { title: 'Novelists', description: 'Thinkers of long fiction.' },
        { title: 'Poets', description: 'Thinkers of concentrated language.' },
        { title: 'Essayists', description: 'Thinkers who shaped public prose.' },
        { title: 'Journalists', description: 'Thinkers who reported and interpreted events.' },
        { title: 'Philosophers', description: 'Thinkers who asked how life and knowledge work.' },
        { title: 'Historians', description: 'Thinkers who preserved and interpreted the past.' },
      ],
    },
    {
      title: 'Leaders',
      description: 'People who guide, teach, organize, serve, and help others move together.',
      accent: 'from-lime-200 via-emerald-200 to-teal-200',
      subcategories: [
        { title: 'Teachers', description: 'People who teach, mentor, and help others learn.' },
        { title: 'Coaches', description: 'People who guide practice, growth, teams, and discipline.' },
        { title: 'Pastors', description: 'People who lead spiritual communities and care.' },
        { title: 'Presidents', description: 'People who lead governments, institutions, or public movements.' },
        { title: 'Mentors', description: 'People who shape others through advice, example, and attention.' },
        { title: 'Organizers', description: 'People who gather communities around shared work or change.' },
      ],
    },
    {
      title: 'Performers',
      description: 'Actors, dancers, and live artists crafting presence.',
      accent: 'from-pink-200 via-rose-200 to-orange-200',
      subcategories: [
        { title: 'Actors', description: 'Performers of character and story.' },
        { title: 'Dancers', description: 'Performers of movement and rhythm.' },
        { title: 'Musicians', description: 'Performers of organized sound.' },
        { title: 'Directors', description: 'Performers and guides who shaped staged or filmed work.' },
        { title: 'Comedians', description: 'Performers of humor, timing, and observation.' },
        { title: 'Athletes', description: 'Performers of physical skill and public contest.' },
        { title: 'Singers', description: 'Performers whose primary instrument is voice.' },
      ],
    },
  ],
}

const baseSeededPages: ContentPage[] = [
  {
    id: 'once-microwave',
    section: 'once',
    title: 'Microwave',
    category: 'Inventions',
    subcategory: 'Household',
    description: 'The microwave oven turned invisible electromagnetic waves into a familiar kitchen tool. It made reheating food fast, changed household routines, and became one of the clearest examples of science slipping quietly into daily life.',
    gallery: ['Warm food in minutes', 'Radar research roots', 'A kitchen standard'],
    relatedIds: ['once-refrigerator', 'once-light-bulb', 'once-radio'],
    searchTerms: ['oven', 'kitchen', 'appliance', 'heat'],
  },
  {
    id: 'once-wheel',
    section: 'once',
    title: 'Wheel',
    category: 'Inventions',
    subcategory: 'Transportation',
    description: 'The wheel gave humans a simpler way to move weight, shape machines, and build transport. Its power is not only in carts and roads, but in gears, pulleys, clocks, mills, and countless systems built around rotation.',
    gallery: ['Movement made easier', 'Rotation as tool', 'Ancient idea, endless uses'],
    relatedIds: ['once-airplane', 'once-steam-engine', 'once-compass'],
    searchTerms: ['transport', 'cart', 'machine', 'rotation'],
  },
  {
    id: 'once-printing-press',
    section: 'once',
    title: 'Printing Press',
    category: 'Inventions',
    subcategory: 'Communication',
    description: 'The printing press helped books, arguments, maps, and discoveries travel faster than handwriting ever could. It changed who could encounter knowledge and helped ideas spread beyond the rooms where they began.',
    gallery: ['Books multiplied', 'Ideas traveled', 'Knowledge became portable'],
    relatedIds: ['once-paper', 'once-telephone', 'humans-william-shakespeare'],
    searchTerms: ['books', 'type', 'publishing', 'knowledge'],
  },
  {
    id: 'once-telescope',
    section: 'once',
    title: 'Telescope',
    category: 'Science',
    subcategory: 'Astronomy',
    description: 'The telescope expanded human sight beyond the unaided eye. By making distant light visible, it changed astronomy from sky-watching into evidence-gathering and made Earth feel smaller in a much larger universe.',
    gallery: ['Distant light', 'New worlds in view', 'The sky became evidence'],
    relatedIds: ['humans-galileo-galilei', 'once-camera', 'once-calendar'],
    searchTerms: ['space', 'stars', 'lens', 'astronomy'],
  },
  {
    id: 'once-vaccines',
    section: 'once',
    title: 'Vaccines',
    category: 'Science',
    subcategory: 'Medicine',
    description: 'Vaccines taught the immune system before disease arrived. They became one of humanity\'s most important public health tools, protecting individuals while also changing what entire communities could survive.',
    gallery: ['Prevention before illness', 'Community protection', 'Medicine at population scale'],
    relatedIds: ['once-antibiotics', 'humans-louis-pasteur', 'humans-marie-curie'],
    searchTerms: ['immunity', 'public health', 'disease', 'medicine'],
  },
  {
    id: 'once-compass',
    section: 'once',
    title: 'Compass',
    category: 'Inventions',
    subcategory: 'Transportation',
    description: 'The compass gave travelers a dependable way to orient themselves when landmarks disappeared. It helped oceans become routes, maps become practical guides, and exploration become less dependent on luck.',
    gallery: ['Direction by magnetism', 'Navigation across water', 'Maps made actionable'],
    relatedIds: ['once-wheel', 'once-airplane', 'once-calendar'],
    searchTerms: ['navigation', 'magnet', 'travel', 'exploration'],
  },
  {
    id: 'once-camera',
    section: 'once',
    title: 'Camera',
    category: 'Art',
    subcategory: 'Design',
    description: 'The camera changed memory into something visible and shareable. It became an artistic tool, a scientific witness, and a social habit that reshaped how people recorded faces, places, and events.',
    gallery: ['Memory captured', 'Light becomes image', 'Everyday witnessing'],
    relatedIds: ['once-telescope', 'humans-frida-kahlo', 'once-internet'],
    searchTerms: ['photography', 'image', 'lens', 'visual'],
  },
  {
    id: 'once-light-bulb',
    section: 'once',
    title: 'Light Bulb',
    category: 'Inventions',
    subcategory: 'Household',
    description: 'The light bulb made night more usable. Beyond a single glowing object, it represents networks of power, new working hours, safer streets, and homes no longer ruled as strictly by sunset.',
    gallery: ['Night made useful', 'Electric homes', 'A new rhythm of work'],
    relatedIds: ['humans-nikola-tesla', 'once-telephone', 'once-refrigerator'],
    searchTerms: ['electricity', 'lamp', 'illumination', 'home'],
  },
  {
    id: 'once-telephone',
    section: 'once',
    title: 'Telephone',
    category: 'Inventions',
    subcategory: 'Communication',
    description: 'The telephone made the human voice travel instantly across distance. It changed business, family life, emergencies, and the expectation that someone far away could still be reached now.',
    gallery: ['Voice over wire', 'Distance shortened', 'Conversation becomes instant'],
    relatedIds: ['once-radio', 'once-internet', 'once-printing-press'],
    searchTerms: ['voice', 'call', 'communication', 'wire'],
  },
  {
    id: 'once-radio',
    section: 'once',
    title: 'Radio',
    category: 'Inventions',
    subcategory: 'Communication',
    description: 'Radio sent voices, music, warnings, and stories through the air. It made mass listening possible and gave communities a shared stream of news and culture before screens became ordinary.',
    gallery: ['Sound over air', 'Broadcast culture', 'Shared listening'],
    relatedIds: ['once-telephone', 'once-internet', 'once-piano'],
    searchTerms: ['broadcast', 'wireless', 'music', 'news'],
  },
  {
    id: 'once-airplane',
    section: 'once',
    title: 'Airplane',
    category: 'Inventions',
    subcategory: 'Transportation',
    description: 'The airplane turned long journeys into hours instead of weeks. It changed war, migration, trade, tourism, and the human sense of how large the planet felt.',
    gallery: ['Flight becomes travel', 'Continents connected', 'The sky as route'],
    relatedIds: ['humans-amelia-earhart', 'once-steam-engine', 'once-compass'],
    searchTerms: ['flight', 'aviation', 'transport', 'travel'],
  },
  {
    id: 'once-steam-engine',
    section: 'once',
    title: 'Steam Engine',
    category: 'Inventions',
    subcategory: 'Transportation',
    description: 'The steam engine converted heat into mechanical power at industrial scale. It moved trains, powered factories, and helped accelerate a world of machines, cities, and mass production.',
    gallery: ['Heat into motion', 'Factories powered', 'Railways expand'],
    relatedIds: ['once-wheel', 'once-airplane', 'once-sewing-machine'],
    searchTerms: ['industry', 'train', 'power', 'engine'],
  },
  {
    id: 'once-refrigerator',
    section: 'once',
    title: 'Refrigerator',
    category: 'Inventions',
    subcategory: 'Household',
    description: 'The refrigerator changed how households stored food and planned meals. It reduced spoilage, reshaped shopping habits, and made freshness less dependent on weather, ice, or immediate use.',
    gallery: ['Cold storage at home', 'Food lasts longer', 'Daily routines changed'],
    relatedIds: ['once-microwave', 'once-light-bulb', 'once-vaccines'],
    searchTerms: ['cold', 'food', 'appliance', 'kitchen'],
  },
  {
    id: 'once-internet',
    section: 'once',
    title: 'Internet',
    category: 'Inventions',
    subcategory: 'Communication',
    description: 'The internet made information, communities, markets, and creative work flow through connected machines. It changed how people learn, speak, organize, publish, and find one another.',
    gallery: ['Networks connected', 'Knowledge on demand', 'Communities online'],
    relatedIds: ['humans-alan-turing', 'once-telephone', 'once-radio'],
    searchTerms: ['web', 'network', 'computer', 'online'],
  },
  {
    id: 'once-antibiotics',
    section: 'once',
    title: 'Antibiotics',
    category: 'Science',
    subcategory: 'Medicine',
    description: 'Antibiotics gave doctors a way to fight bacterial infections that once killed easily. They transformed surgery, childbirth, and ordinary wounds while also teaching caution about resistance.',
    gallery: ['Infections challenged', 'Modern surgery safer', 'Resistance matters'],
    relatedIds: ['once-vaccines', 'humans-louis-pasteur', 'humans-rosalind-franklin'],
    searchTerms: ['penicillin', 'bacteria', 'medicine', 'infection'],
  },
  {
    id: 'once-paper',
    section: 'once',
    title: 'Paper',
    category: 'Inventions',
    subcategory: 'Communication',
    description: 'Paper made writing, drawing, records, letters, and plans cheaper to carry and preserve. It became the quiet surface beneath schools, offices, books, art, and memory.',
    gallery: ['A surface for thought', 'Records travel', 'Writing becomes portable'],
    relatedIds: ['once-printing-press', 'humans-jane-austen', 'humans-william-shakespeare'],
    searchTerms: ['writing', 'books', 'documents', 'material'],
  },
  {
    id: 'once-concrete',
    section: 'once',
    title: 'Concrete',
    category: 'Art',
    subcategory: 'Design',
    description: 'Concrete let people pour stone-like structures into new shapes. Roads, bridges, homes, towers, and public spaces all changed as this practical material became a foundation of modern building.',
    gallery: ['Cities poured in place', 'Strong useful forms', 'Infrastructure material'],
    relatedIds: ['once-wheel', 'once-light-bulb', 'humans-leonardo-da-vinci'],
    searchTerms: ['building', 'architecture', 'material', 'cities'],
  },
  {
    id: 'once-calendar',
    section: 'once',
    title: 'Calendar',
    category: 'Science',
    subcategory: 'Astronomy',
    description: 'The calendar turned cycles of sky and season into shared social time. It helped people plant, gather, worship, work, remember, and coordinate life beyond the present day.',
    gallery: ['Time made shared', 'Seasons organized', 'Sky cycles counted'],
    relatedIds: ['once-telescope', 'once-compass', 'humans-galileo-galilei'],
    searchTerms: ['time', 'date', 'season', 'astronomy'],
  },
  {
    id: 'once-piano',
    section: 'once',
    title: 'Piano',
    category: 'Music',
    subcategory: 'Instruments',
    description: 'The piano gave musicians a wide expressive range under two hands. It became a tool for composing, teaching, performing, and filling rooms with both intimate songs and enormous sound.',
    gallery: ['Keys and hammers', 'Home and concert stage', 'Composition tool'],
    relatedIds: ['humans-ludwig-van-beethoven', 'once-radio', 'once-camera'],
    searchTerms: ['music', 'instrument', 'keys', 'composition'],
  },
  {
    id: 'once-sewing-machine',
    section: 'once',
    title: 'Sewing Machine',
    category: 'Inventions',
    subcategory: 'Household',
    description: 'The sewing machine sped up a task that once demanded slow handwork. It changed clothing production, home repair, factory labor, and the availability of garments.',
    gallery: ['Stitches accelerated', 'Clothing production changed', 'Home craft meets machine'],
    relatedIds: ['once-steam-engine', 'once-refrigerator', 'once-concrete'],
    searchTerms: ['clothing', 'textiles', 'factory', 'home'],
  },
  {
    id: 'humans-isaac-newton',
    section: 'humans',
    title: 'Isaac Newton',
    category: 'Scientists',
    subcategory: 'Physics',
    description: 'Isaac Newton helped describe motion, gravity, and light with a precision that reshaped science. His work gave later generations a mathematical language for forces that had always been felt but not fully explained.',
    gallery: ['Gravity described', 'Motion made mathematical', 'Light investigated'],
    relatedIds: ['humans-albert-einstein', 'humans-galileo-galilei', 'once-telescope'],
    searchTerms: ['gravity', 'motion', 'physics', 'calculus'],
  },
  {
    id: 'humans-marie-curie',
    section: 'humans',
    title: 'Marie Curie',
    category: 'Scientists',
    subcategory: 'Chemistry',
    description: 'Marie Curie worked with radioactivity in ways that opened new scientific and medical paths. Her discoveries showed that matter held energies and behaviors far stranger than everyday experience suggested.',
    gallery: ['Radioactivity named', 'New elements studied', 'Science under pressure'],
    relatedIds: ['humans-rosalind-franklin', 'once-vaccines', 'once-antibiotics'],
    searchTerms: ['radioactivity', 'chemistry', 'radium', 'science'],
  },
  {
    id: 'humans-leonardo-da-vinci',
    section: 'humans',
    title: 'Leonardo da Vinci',
    category: 'Artists',
    subcategory: 'Painters',
    description: 'Leonardo da Vinci moved between art, anatomy, engineering, and observation. His notebooks and paintings show a mind treating the world as something to study closely, draw carefully, and imagine differently.',
    gallery: ['Painter and observer', 'Anatomy in notebooks', 'Imagination as method'],
    relatedIds: ['humans-frida-kahlo', 'once-camera', 'once-concrete'],
    searchTerms: ['renaissance', 'painting', 'anatomy', 'notebooks'],
  },
  {
    id: 'humans-william-shakespeare',
    section: 'humans',
    title: 'William Shakespeare',
    category: 'Writers',
    subcategory: 'Playwrights',
    description: 'William Shakespeare wrote plays and poems that kept finding new audiences because they understood ambition, love, grief, comedy, and power with unusual force. His language still echoes through ordinary speech.',
    gallery: ['Stage language', 'Characters that endure', 'Human motives examined'],
    relatedIds: ['humans-jane-austen', 'once-printing-press', 'once-paper'],
    searchTerms: ['theater', 'plays', 'poetry', 'language'],
  },
  {
    id: 'humans-ada-lovelace',
    section: 'humans',
    title: 'Ada Lovelace',
    category: 'Engineers',
    subcategory: 'Computing',
    description: 'Ada Lovelace saw that a calculating machine could manipulate more than numbers. Her notes imagined a broader future for computation, making her a foundational figure in the story of programming.',
    gallery: ['Early programming vision', 'Numbers as symbols', 'Computing imagined broadly'],
    relatedIds: ['humans-alan-turing', 'once-internet', 'once-printing-press'],
    searchTerms: ['programming', 'computer', 'algorithm', 'engine'],
  },
  {
    id: 'humans-galileo-galilei',
    section: 'humans',
    title: 'Galileo Galilei',
    category: 'Scientists',
    subcategory: 'Astronomy',
    description: 'Galileo Galilei used observation and experiment to challenge old certainties about motion and the sky. His telescope work helped make direct evidence central to modern science.',
    gallery: ['Telescope observations', 'Motion examined', 'Evidence against certainty'],
    relatedIds: ['once-telescope', 'humans-isaac-newton', 'once-calendar'],
    searchTerms: ['astronomy', 'telescope', 'motion', 'science'],
  },
  {
    id: 'humans-charles-darwin',
    section: 'humans',
    title: 'Charles Darwin',
    category: 'Scientists',
    subcategory: 'Astronomy',
    description: 'Charles Darwin described evolution by natural selection, offering a powerful explanation for the diversity of life. His work changed biology and the way humans understood their place among living things.',
    gallery: ['Variation observed', 'Natural selection', 'Life connected'],
    relatedIds: ['humans-louis-pasteur', 'humans-rosalind-franklin', 'once-vaccines'],
    searchTerms: ['evolution', 'biology', 'species', 'natural selection'],
  },
  {
    id: 'humans-nikola-tesla',
    section: 'humans',
    title: 'Nikola Tesla',
    category: 'Engineers',
    subcategory: 'Machines',
    description: 'Nikola Tesla imagined and built electrical systems that helped define modern power. His work around alternating current made electricity easier to transmit and use at scale.',
    gallery: ['Alternating current', 'Power at distance', 'Electric imagination'],
    relatedIds: ['once-light-bulb', 'once-radio', 'once-telephone'],
    searchTerms: ['electricity', 'AC', 'power', 'invention'],
  },
  {
    id: 'humans-rosalind-franklin',
    section: 'humans',
    title: 'Rosalind Franklin',
    category: 'Scientists',
    subcategory: 'Chemistry',
    description: 'Rosalind Franklin used X-ray crystallography to reveal hidden molecular structure. Her careful images and analysis were crucial to understanding DNA and the architecture of life.',
    gallery: ['Molecules made visible', 'DNA structure clues', 'Precision in evidence'],
    relatedIds: ['humans-marie-curie', 'humans-charles-darwin', 'once-antibiotics'],
    searchTerms: ['DNA', 'chemistry', 'x-ray', 'molecular'],
  },
  {
    id: 'humans-jane-austen',
    section: 'humans',
    title: 'Jane Austen',
    category: 'Writers',
    subcategory: 'Novelists',
    description: 'Jane Austen wrote novels of manners, money, family, and perception with sharp comic intelligence. Her stories made ordinary social choices feel dramatic, revealing how much character lives in conversation.',
    gallery: ['Social observation', 'Comedy with precision', 'Novels of choice'],
    relatedIds: ['humans-william-shakespeare', 'once-paper', 'once-printing-press'],
    searchTerms: ['novels', 'literature', 'regency', 'fiction'],
  },
  {
    id: 'humans-ludwig-van-beethoven',
    section: 'humans',
    title: 'Ludwig van Beethoven',
    category: 'Performers',
    subcategory: 'Musicians',
    description: 'Ludwig van Beethoven pushed music toward new emotional scale and intensity. His work connected classical form with a more personal, stormy sense of expression that shaped later composers.',
    gallery: ['Symphonies expand', 'Piano as force', 'Emotion at scale'],
    relatedIds: ['once-piano', 'once-radio', 'humans-maya-angelou'],
    searchTerms: ['music', 'composer', 'piano', 'symphony'],
  },
  {
    id: 'humans-frida-kahlo',
    section: 'humans',
    title: 'Frida Kahlo',
    category: 'Artists',
    subcategory: 'Painters',
    description: 'Frida Kahlo turned self-portraiture into a direct language of pain, identity, memory, and symbolism. Her paintings feel intimate and mythic at the same time.',
    gallery: ['Self as subject', 'Pain and symbol', 'Identity painted boldly'],
    relatedIds: ['humans-leonardo-da-vinci', 'once-camera', 'humans-maya-angelou'],
    searchTerms: ['painting', 'self portrait', 'mexico', 'identity'],
  },
  {
    id: 'humans-aristotle',
    section: 'humans',
    title: 'Aristotle',
    category: 'Creators',
    subcategory: 'Visionaries',
    description: 'Aristotle organized questions about nature, logic, ethics, politics, art, and knowledge. His influence lasted because he built frameworks people could argue with, refine, and inherit.',
    gallery: ['Questions organized', 'Logic and ethics', 'Frameworks for thought'],
    relatedIds: ['humans-confucius', 'humans-isaac-newton', 'once-calendar'],
    searchTerms: ['philosophy', 'logic', 'ethics', 'ancient'],
  },
  {
    id: 'humans-alan-turing',
    section: 'humans',
    title: 'Alan Turing',
    category: 'Engineers',
    subcategory: 'Computing',
    description: 'Alan Turing gave computing a deep theoretical foundation and helped turn codebreaking into wartime practice. His ideas still shape how people think about machines, logic, and intelligence.',
    gallery: ['Computing defined', 'Codebreaking work', 'Machines and logic'],
    relatedIds: ['humans-ada-lovelace', 'once-internet', 'humans-katherine-johnson'],
    searchTerms: ['computer', 'AI', 'codebreaking', 'algorithm'],
  },
  {
    id: 'humans-maya-angelou',
    section: 'humans',
    title: 'Maya Angelou',
    category: 'Writers',
    subcategory: 'Poets',
    description: 'Maya Angelou wrote with a voice that joined memory, survival, dignity, and song. Her poems and autobiographical work made personal experience speak with public force.',
    gallery: ['Voice as witness', 'Memory with music', 'Dignity in language'],
    relatedIds: ['humans-jane-austen', 'humans-frida-kahlo', 'once-paper'],
    searchTerms: ['poetry', 'memoir', 'civil rights', 'voice'],
  },
  {
    id: 'humans-katherine-johnson',
    section: 'humans',
    title: 'Katherine Johnson',
    category: 'Engineers',
    subcategory: 'Computing',
    description: 'Katherine Johnson calculated flight paths that helped send astronauts into orbit and toward the Moon. Her mathematical precision made ambitious space travel safer and possible.',
    gallery: ['Orbital paths calculated', 'Spaceflight mathematics', 'Hidden work made visible'],
    relatedIds: ['humans-alan-turing', 'once-telescope', 'once-airplane'],
    searchTerms: ['NASA', 'math', 'space', 'computing'],
  },
  {
    id: 'humans-louis-pasteur',
    section: 'humans',
    title: 'Louis Pasteur',
    category: 'Scientists',
    subcategory: 'Chemistry',
    description: 'Louis Pasteur connected microscopic life to disease, fermentation, and prevention. His work helped make germ theory practical and changed medicine, food safety, and public health.',
    gallery: ['Germs made practical', 'Fermentation understood', 'Prevention advanced'],
    relatedIds: ['once-vaccines', 'once-antibiotics', 'humans-marie-curie'],
    searchTerms: ['germ theory', 'medicine', 'microbes', 'chemistry'],
  },
  {
    id: 'humans-amelia-earhart',
    section: 'humans',
    title: 'Amelia Earhart',
    category: 'Creators',
    subcategory: 'Pioneers',
    description: 'Amelia Earhart became a public symbol of flight, risk, and possibility. Her aviation records and visibility helped expand who could imagine themselves in the cockpit.',
    gallery: ['Flight as courage', 'Records in the air', 'Visibility changes possibility'],
    relatedIds: ['once-airplane', 'once-compass', 'humans-katherine-johnson'],
    searchTerms: ['aviation', 'pilot', 'flight', 'exploration', 'pioneer'],
  },
  {
    id: 'humans-confucius',
    section: 'humans',
    title: 'Confucius',
    category: 'Creators',
    subcategory: 'Visionaries',
    description: 'Confucius shaped traditions of ethics, learning, family, ritual, and government. His teachings became a long conversation about how people should live with one another.',
    gallery: ['Ethics in daily life', 'Learning as practice', 'Society through relationship'],
    relatedIds: ['humans-aristotle', 'humans-maya-angelou', 'once-paper'],
    searchTerms: ['philosophy', 'ethics', 'china', 'teaching'],
  },
  {
    id: 'humans-albert-einstein',
    section: 'humans',
    title: 'Albert Einstein',
    category: 'Scientists',
    subcategory: 'Physics',
    description: 'Albert Einstein changed physics by rethinking space, time, light, and gravity. His work made the universe feel stranger and more elegant than common sense alone could allow.',
    gallery: ['Relativity reframes time', 'Light as clue', 'Gravity reimagined'],
    relatedIds: ['humans-isaac-newton', 'humans-galileo-galilei', 'once-telescope'],
    searchTerms: ['relativity', 'physics', 'space time', 'gravity'],
  },
]

type SeedPageSpec = {
  title: string
  section: SectionType
  category: string
  subcategory: string
  note: string
  terms: string[]
  gallery?: string[]
  related?: string[]
}

function makeSeedId(section: SectionType, title: string) {
  return `${section}-${slugify(title)}`
}

function makeExpansionPage(spec: SeedPageSpec): ContentPage {
  const subject = spec.section === 'once' ? 'thing' : 'human'

  return {
    id: makeSeedId(spec.section, spec.title),
    section: spec.section,
    title: spec.title,
    category: spec.category,
    subcategory: spec.subcategory,
    description: `${spec.title} belongs in Once Humans as a familiar ${subject} shaped by ${spec.subcategory.toLowerCase()}. ${spec.note} It gives visitors a clear doorway into ${spec.category.toLowerCase()} while leaving room for photos, posts, and living conversation.`,
    gallery: spec.gallery || [
      `${spec.title} in everyday memory`,
      `${spec.subcategory} context`,
      `How ${spec.title} changed what felt possible`,
      `A closer look at ${spec.title}`,
    ],
    relatedIds: spec.related,
    searchTerms: [
      spec.category.toLowerCase(),
      spec.subcategory.toLowerCase(),
      ...spec.terms,
    ],
  }
}

const expansionSpecs: SeedPageSpec[] = [
  { section: 'once', title: 'Computer', category: 'Inventions', subcategory: 'Computing', note: 'It turned calculation, storage, communication, art, and work into programmable activity.', terms: ['digital', 'programming', 'machine', 'technology'], related: ['once-internet', 'humans-alan-turing', 'humans-ada-lovelace'] },
  { section: 'once', title: 'Smartphone', category: 'Inventions', subcategory: 'Computing', note: 'It compressed camera, telephone, map, computer, wallet, and public square into a pocket object.', terms: ['phone', 'mobile', 'apps', 'internet'], related: ['once-telephone', 'once-camera', 'once-internet'] },
  { section: 'once', title: 'Bicycle', category: 'Inventions', subcategory: 'Transportation', note: 'It made personal movement cheaper, lighter, and more independent than many older forms of transport.', terms: ['bike', 'transport', 'wheels', 'mobility'], related: ['once-wheel', 'once-automobile', 'once-railroad'] },
  { section: 'once', title: 'Automobile', category: 'Inventions', subcategory: 'Transportation', note: 'It reshaped cities, roads, work commutes, leisure travel, and the feeling of personal distance.', terms: ['car', 'engine', 'road', 'transport'], related: ['once-bicycle', 'once-railroad', 'once-electric-motor'] },
  { section: 'once', title: 'Railroad', category: 'Inventions', subcategory: 'Transportation', note: 'It gave land travel a new rhythm of timetables, freight, migration, and connected regions.', terms: ['train', 'track', 'steam', 'transport'], related: ['once-steam-engine', 'once-wheel', 'once-clock'] },
  { section: 'once', title: 'Ship', category: 'Inventions', subcategory: 'Transportation', note: 'It carried trade, migration, exploration, empire, and exchange across water for thousands of years.', terms: ['boat', 'sea', 'navigation', 'travel'], related: ['once-compass', 'once-calendar', 'once-airplane'] },
  { section: 'once', title: 'Elevator', category: 'Inventions', subcategory: 'Infrastructure', note: 'It made tall buildings practical and changed the vertical shape of modern cities.', terms: ['lift', 'building', 'city', 'vertical'], related: ['once-concrete', 'once-architecture', 'once-electric-motor'] },
  { section: 'once', title: 'Battery', category: 'Inventions', subcategory: 'Energy', note: 'It let power become portable, stored, and ready for tools far from a wall or generator.', terms: ['electricity', 'storage', 'portable', 'power'], related: ['once-electric-motor', 'once-smartphone', 'once-solar-panel'] },
  { section: 'once', title: 'Electric Motor', category: 'Inventions', subcategory: 'Energy', note: 'It turned electrical energy into motion inside factories, vehicles, appliances, and tools.', terms: ['electricity', 'motion', 'machine', 'power'], related: ['once-battery', 'humans-michael-faraday', 'once-washing-machine'] },
  { section: 'once', title: 'Solar Panel', category: 'Inventions', subcategory: 'Energy', note: 'It made sunlight into usable electricity and changed how people imagine clean power.', terms: ['sun', 'electricity', 'renewable', 'energy'], related: ['once-battery', 'once-wind-turbine', 'once-electricity'] },
  { section: 'once', title: 'Wind Turbine', category: 'Inventions', subcategory: 'Energy', note: 'It translated moving air into electricity, renewing an old relationship between wind and work.', terms: ['wind', 'renewable', 'electricity', 'power'], related: ['once-solar-panel', 'once-electric-motor', 'once-battery'] },
  { section: 'once', title: 'Plumbing', category: 'Inventions', subcategory: 'Infrastructure', note: 'It brought water movement into homes and cities, changing hygiene, comfort, and public health.', terms: ['water', 'pipes', 'sanitation', 'city'], related: ['once-toilet', 'once-concrete', 'once-germ-theory'] },
  { section: 'once', title: 'Toilet', category: 'Inventions', subcategory: 'Household', note: 'It quietly transformed sanitation and daily privacy while protecting communities from disease.', terms: ['sanitation', 'bathroom', 'health', 'plumbing'], related: ['once-plumbing', 'once-germ-theory', 'once-vaccines'] },
  { section: 'once', title: 'Washing Machine', category: 'Inventions', subcategory: 'Household', note: 'It reduced exhausting household labor and changed routines around clothing, time, and care.', terms: ['laundry', 'home', 'appliance', 'clothing'], related: ['once-sewing-machine', 'once-electric-motor', 'once-refrigerator'] },
  { section: 'once', title: 'Air Conditioning', category: 'Inventions', subcategory: 'Household', note: 'It changed architecture, work, sleep, and settlement by controlling indoor climate.', terms: ['cooling', 'air', 'climate', 'home'], related: ['once-refrigerator', 'once-electric-motor', 'once-elevator'] },
  { section: 'once', title: 'Clock', category: 'Inventions', subcategory: 'Tools', note: 'It made time more measurable, shared, and demanding in daily life.', terms: ['time', 'watch', 'schedule', 'measurement'], related: ['once-calendar', 'once-railroad', 'once-zero'] },
  { section: 'once', title: 'Eyeglasses', category: 'Inventions', subcategory: 'Tools', note: 'They extended sight, reading, craft, study, and independence for people with blurred vision.', terms: ['glasses', 'vision', 'lens', 'reading'], related: ['once-microscope', 'once-telescope', 'once-camera'] },
  { section: 'once', title: 'Plow', category: 'Inventions', subcategory: 'Agriculture', note: 'It turned soil preparation into a repeatable tool for larger harvests and settled life.', terms: ['farming', 'soil', 'field', 'food'], related: ['once-irrigation', 'once-tractor', 'once-wheel'] },
  { section: 'once', title: 'Irrigation', category: 'Inventions', subcategory: 'Agriculture', note: 'It moved water to crops and helped communities grow where rain alone was unreliable.', terms: ['water', 'farming', 'crops', 'food'], related: ['once-plow', 'once-plumbing', 'once-tractor'] },
  { section: 'once', title: 'Tractor', category: 'Inventions', subcategory: 'Agriculture', note: 'It brought engine power into fields and changed the scale of modern farming.', terms: ['farm', 'engine', 'machine', 'food'], related: ['once-plow', 'once-irrigation', 'once-steam-engine'] },
  { section: 'once', title: 'Microscope', category: 'Science', subcategory: 'Biology', note: 'It opened a hidden world of cells, microbes, tissue, and structures too small to see unaided.', terms: ['cells', 'microbes', 'lens', 'biology'], related: ['once-germ-theory', 'humans-ibn-al-haytham', 'once-eyeglasses'] },
  { section: 'once', title: 'X-Ray', category: 'Science', subcategory: 'Medicine', note: 'It let doctors and researchers see inside bodies and materials without cutting them open.', terms: ['medical imaging', 'bones', 'radiology', 'medicine'], related: ['humans-dorothy-hodgkin', 'humans-rosalind-franklin', 'once-dna-double-helix'] },
  { section: 'once', title: 'Periodic Table', category: 'Science', subcategory: 'Chemistry', note: 'It organized elements into a pattern that made chemistry easier to teach, predict, and extend.', terms: ['elements', 'chemistry', 'mendeleev', 'atoms'], related: ['humans-dmitri-mendeleev', 'once-atom', 'humans-marie-curie'] },
  { section: 'once', title: 'DNA Double Helix', category: 'Science', subcategory: 'Biology', note: 'It gave biology a powerful image of heredity, structure, copying, and life at molecular scale.', terms: ['DNA', 'genetics', 'molecule', 'biology'], related: ['humans-rosalind-franklin', 'humans-barbara-mcclintock', 'once-evolution'] },
  { section: 'once', title: 'Germ Theory', category: 'Science', subcategory: 'Medicine', note: 'It connected invisible organisms to disease and transformed prevention, surgery, and public health.', terms: ['microbes', 'disease', 'medicine', 'health'], related: ['humans-louis-pasteur', 'once-vaccines', 'once-antibiotics'] },
  { section: 'once', title: 'Evolution', category: 'Science', subcategory: 'Biology', note: 'It explained how living forms change over generations through inheritance, variation, and selection.', terms: ['biology', 'species', 'natural selection', 'darwin'], related: ['humans-charles-darwin', 'once-dna-double-helix', 'humans-rachel-carson'] },
  { section: 'once', title: 'Gravity', category: 'Science', subcategory: 'Physics', note: 'It names the attraction that shapes falling bodies, orbits, tides, and the structure of the cosmos.', terms: ['force', 'physics', 'motion', 'orbit'], related: ['humans-isaac-newton', 'humans-albert-einstein', 'once-telescope'] },
  { section: 'once', title: 'Electricity', category: 'Science', subcategory: 'Physics', note: 'It became both a subject of science and a practical force running through modern life.', terms: ['power', 'charge', 'current', 'energy'], related: ['humans-michael-faraday', 'humans-nikola-tesla', 'once-light-bulb'] },
  { section: 'once', title: 'Atom', category: 'Science', subcategory: 'Physics', note: 'It gave matter a hidden architecture and opened questions about energy, chemistry, and the universe.', terms: ['matter', 'physics', 'chemistry', 'particle'], related: ['humans-niels-bohr', 'once-periodic-table', 'humans-max-planck'] },
  { section: 'once', title: 'Plate Tectonics', category: 'Science', subcategory: 'Earth Science', note: 'It explained continents, earthquakes, volcanoes, and the restless movement of Earth beneath us.', terms: ['earth', 'geology', 'continents', 'earthquakes'], related: ['once-scientific-method', 'once-calendar', 'humans-rachel-carson'] },
  { section: 'once', title: 'Zero', category: 'Science', subcategory: 'Mathematics', note: 'It made absence into a number and helped unlock place value, algebra, computing, and abstraction.', terms: ['number', 'math', 'nothing', 'place value'], related: ['once-algebra', 'once-computer', 'humans-hypatia'] },
  { section: 'once', title: 'Algebra', category: 'Science', subcategory: 'Mathematics', note: 'It turned unknown quantities into things that could be reasoned about, solved, and generalized.', terms: ['math', 'equations', 'symbols', 'unknowns'], related: ['once-zero', 'once-calculus', 'humans-hypatia'] },
  { section: 'once', title: 'Calculus', category: 'Science', subcategory: 'Mathematics', note: 'It gave change, motion, curves, and accumulation a precise mathematical language.', terms: ['math', 'change', 'motion', 'derivative'], related: ['humans-isaac-newton', 'once-algebra', 'once-gravity'] },
  { section: 'once', title: 'Thermometer', category: 'Science', subcategory: 'Methods', note: 'It made temperature visible as a measurement rather than only a feeling.', terms: ['temperature', 'measurement', 'science', 'heat'], related: ['once-scientific-method', 'once-microscope', 'once-refrigerator'] },
  { section: 'once', title: 'Scientific Method', category: 'Science', subcategory: 'Methods', note: 'It gave curiosity a discipline of observation, testing, evidence, and revision.', terms: ['experiment', 'evidence', 'science', 'testing'], related: ['humans-galileo-galilei', 'once-thermometer', 'once-microscope'] },
  { section: 'once', title: 'Photography', category: 'Art', subcategory: 'Photography', note: 'It made images from light and changed memory, art, journalism, science, and everyday identity.', terms: ['photo', 'camera', 'image', 'art'], related: ['once-camera', 'humans-ansel-adams', 'once-newspaper'] },
  { section: 'once', title: 'Oil Paint', category: 'Art', subcategory: 'Painting', note: 'It gave painters luminous color, slow blending, and durable surfaces for portraits and worlds.', terms: ['painting', 'canvas', 'color', 'art'], related: ['humans-vincent-van-gogh', 'humans-claude-monet', 'humans-leonardo-da-vinci'] },
  { section: 'once', title: 'Mosaic', category: 'Art', subcategory: 'Ceramics', note: 'It built images from small pieces, turning walls and floors into durable stories.', terms: ['tile', 'ceramic', 'image', 'art'], related: ['once-pottery', 'once-architecture', 'once-stained-glass'] },
  { section: 'once', title: 'Pottery', category: 'Art', subcategory: 'Ceramics', note: 'It joined utility and beauty through clay, fire, storage, ritual, and daily handling.', terms: ['clay', 'ceramic', 'vessel', 'craft'], related: ['once-mosaic', 'once-glasswork', 'once-plow'] },
  { section: 'once', title: 'Architecture', category: 'Art', subcategory: 'Architecture', note: 'It shapes how bodies move through space, how cities feel, and how power becomes visible.', terms: ['building', 'design', 'city', 'space'], related: ['once-concrete', 'humans-zaha-hadid', 'humans-gustave-eiffel'] },
  { section: 'once', title: 'Perspective', category: 'Art', subcategory: 'Painting', note: 'It gave flat surfaces a convincing sense of depth and changed visual storytelling.', terms: ['painting', 'depth', 'renaissance', 'drawing'], related: ['humans-leonardo-da-vinci', 'once-photography', 'once-architecture'] },
  { section: 'once', title: 'Typeface', category: 'Art', subcategory: 'Typography', note: 'It makes letters carry tone, structure, and identity before words are even read.', terms: ['font', 'letters', 'design', 'printing'], related: ['once-printing-press', 'once-paper', 'once-dictionary'] },
  { section: 'once', title: 'Stained Glass', category: 'Art', subcategory: 'Glasswork', note: 'It turned colored light into story, atmosphere, devotion, and architectural memory.', terms: ['glass', 'color', 'church', 'art'], related: ['once-glasswork', 'once-architecture', 'once-mosaic'] },
  { section: 'once', title: 'Glasswork', category: 'Art', subcategory: 'Glasswork', note: 'It shaped molten material into vessels, windows, lenses, instruments, and art.', terms: ['glass', 'craft', 'lens', 'material'], related: ['once-stained-glass', 'once-eyeglasses', 'once-telescope'] },
  { section: 'once', title: 'Violin', category: 'Music', subcategory: 'Instruments', note: 'It became one of music’s most expressive bowed instruments, carrying melody across folk and concert worlds.', terms: ['strings', 'instrument', 'orchestra', 'music'], related: ['once-piano', 'once-guitar', 'humans-ludwig-van-beethoven'] },
  { section: 'once', title: 'Drum', category: 'Music', subcategory: 'Instruments', note: 'It made rhythm physical, communal, ceremonial, military, and central to countless musical traditions.', terms: ['percussion', 'rhythm', 'beat', 'music'], related: ['once-jazz', 'once-guitar', 'once-sheet-music'] },
  { section: 'once', title: 'Guitar', category: 'Music', subcategory: 'Instruments', note: 'It became a portable engine for song, accompaniment, virtuosity, and popular music.', terms: ['strings', 'instrument', 'rock', 'music'], related: ['once-violin', 'once-jazz', 'once-radio'] },
  { section: 'once', title: 'Phonograph', category: 'Music', subcategory: 'Recording', note: 'It made recorded sound a household experience and changed how music could travel through time.', terms: ['recording', 'sound', 'record', 'music'], related: ['once-radio', 'once-jazz', 'once-telephone'] },
  { section: 'once', title: 'Sheet Music', category: 'Music', subcategory: 'Notation', note: 'It allowed music to move across rooms, teachers, performers, and generations on paper.', terms: ['notation', 'score', 'music', 'paper'], related: ['once-piano', 'once-printing-press', 'once-paper'] },
  { section: 'once', title: 'Jazz', category: 'Music', subcategory: 'Genres', note: 'It brought improvisation, swing, blues feeling, and collective invention into a global musical language.', terms: ['improvisation', 'swing', 'blues', 'music'], related: ['once-drum', 'once-guitar', 'once-radio'] },
  { section: 'once', title: 'Epic of Gilgamesh', category: 'Literature', subcategory: 'Epics', note: 'It preserves one of humanity’s oldest literary journeys through friendship, power, grief, and mortality.', terms: ['epic', 'ancient', 'story', 'literature'], related: ['once-paper', 'humans-homer', 'once-myths'] },
  { section: 'once', title: 'Dictionary', category: 'Literature', subcategory: 'Reference', note: 'It organizes language so words can be found, compared, taught, and argued over.', terms: ['words', 'reference', 'language', 'book'], related: ['once-paper', 'once-printing-press', 'once-typeface'] },
  { section: 'once', title: 'Newspaper', category: 'Literature', subcategory: 'Journalism', note: 'It gave public events a recurring printed form and helped create shared civic attention.', terms: ['news', 'journalism', 'printing', 'public'], related: ['once-printing-press', 'once-photography', 'humans-james-baldwin'] },
  { section: 'once', title: 'Myths', category: 'Literature', subcategory: 'Myths', note: 'They carried explanations, warnings, heroes, gods, and community memory before modern records.', terms: ['story', 'mythology', 'tradition', 'belief'], related: ['once-epic-of-gilgamesh', 'humans-homer', 'humans-confucius'] },
  { section: 'once', title: 'Folktale', category: 'Literature', subcategory: 'Folklore', note: 'It carried lessons, humor, fear, and wisdom through repeated telling rather than fixed authorship.', terms: ['folklore', 'story', 'oral tradition', 'culture'], related: ['once-myths', 'once-epic-of-gilgamesh', 'humans-chinua-achebe'] },
  { section: 'once', title: 'Cinema', category: 'Performance', subcategory: 'Film', note: 'It made moving images into a shared modern art of acting, editing, music, light, and time.', terms: ['film', 'movies', 'screen', 'performance'], related: ['once-camera', 'humans-charlie-chaplin', 'humans-meryl-streep'] },
  { section: 'once', title: 'Ballet', category: 'Performance', subcategory: 'Ballet', note: 'It shaped disciplined movement into a theatrical language of line, effort, story, and grace.', terms: ['dance', 'stage', 'movement', 'performance'], related: ['humans-misty-copeland', 'once-opera', 'once-theater'] },
  { section: 'once', title: 'Olympic Games', category: 'Performance', subcategory: 'Sport', note: 'It made athletic excellence into a recurring global ritual of competition and spectacle.', terms: ['sports', 'athletics', 'competition', 'games'], related: ['once-calendar', 'humans-amelia-earhart', 'once-cinema'] },
  { section: 'once', title: 'Opera', category: 'Performance', subcategory: 'Opera', note: 'It combines voice, orchestra, theater, costume, and scale into one dramatic form.', terms: ['singing', 'theater', 'music', 'stage'], related: ['once-ballet', 'once-piano', 'humans-aretha-franklin'] },
  { section: 'once', title: 'Stand-Up Comedy', category: 'Performance', subcategory: 'Comedy', note: 'It turns observation, timing, voice, and discomfort into public laughter.', terms: ['comedy', 'jokes', 'stage', 'humor'], related: ['humans-charlie-chaplin', 'once-theater', 'once-radio'] },
  { section: 'humans', title: 'Niels Bohr', category: 'Scientists', subcategory: 'Physics', note: 'His atomic model helped make quantum physics easier to picture and debate.', terms: ['atom', 'quantum', 'physics', 'denmark'], related: ['once-atom', 'humans-max-planck', 'humans-albert-einstein'] },
  { section: 'humans', title: 'Max Planck', category: 'Scientists', subcategory: 'Physics', note: 'His work on quanta opened one of the strangest and most powerful turns in modern physics.', terms: ['quantum', 'physics', 'energy', 'theory'], related: ['humans-niels-bohr', 'humans-albert-einstein', 'once-atom'] },
  { section: 'humans', title: 'James Clerk Maxwell', category: 'Scientists', subcategory: 'Physics', note: 'His equations joined electricity, magnetism, and light into one deep framework.', terms: ['electromagnetism', 'light', 'physics', 'equations'], related: ['once-electricity', 'humans-michael-faraday', 'humans-nikola-tesla'] },
  { section: 'humans', title: 'Michael Faraday', category: 'Scientists', subcategory: 'Physics', note: 'His experiments made electricity and magnetism practical, visible, and world-changing.', terms: ['electricity', 'magnetism', 'motor', 'experiment'], related: ['once-electric-motor', 'once-electricity', 'humans-james-clerk-maxwell'] },
  { section: 'humans', title: 'Dmitri Mendeleev', category: 'Scientists', subcategory: 'Chemistry', note: 'His periodic arrangement made chemistry feel patterned rather than scattered.', terms: ['periodic table', 'elements', 'chemistry', 'russia'], related: ['once-periodic-table', 'once-atom', 'humans-marie-curie'] },
  { section: 'humans', title: 'Rachel Carson', category: 'Scientists', subcategory: 'Biology', note: 'Her writing helped modern environmental awareness become public and urgent.', terms: ['environment', 'ecology', 'biology', 'silent spring'], related: ['once-evolution', 'once-plate-tectonics', 'humans-charles-darwin'] },
  { section: 'humans', title: 'Barbara McClintock', category: 'Scientists', subcategory: 'Biology', note: 'Her genetics work revealed mobile elements and showed how lively genomes could be.', terms: ['genetics', 'corn', 'biology', 'DNA'], related: ['once-dna-double-helix', 'humans-rosalind-franklin', 'once-evolution'] },
  { section: 'humans', title: 'Chien-Shiung Wu', category: 'Scientists', subcategory: 'Physics', note: 'Her experiments challenged assumptions about symmetry and deepened particle physics.', terms: ['physics', 'experiment', 'parity', 'nuclear'], related: ['humans-niels-bohr', 'humans-max-planck', 'once-atom'] },
  { section: 'humans', title: 'Carl Sagan', category: 'Scientists', subcategory: 'Astronomy', note: 'He made cosmic science feel public, poetic, skeptical, and shared.', terms: ['space', 'astronomy', 'cosmos', 'science communication'], related: ['once-telescope', 'humans-galileo-galilei', 'humans-henrietta-leavitt'] },
  { section: 'humans', title: 'Hypatia', category: 'Scientists', subcategory: 'Mathematics', note: 'She became a lasting symbol of ancient learning, mathematics, philosophy, and teaching.', terms: ['math', 'alexandria', 'philosophy', 'ancient'], related: ['once-zero', 'once-algebra', 'humans-aristotle'] },
  { section: 'humans', title: 'Henrietta Leavitt', category: 'Scientists', subcategory: 'Astronomy', note: 'Her work on variable stars gave astronomers a way to measure cosmic distance.', terms: ['stars', 'astronomy', 'distance', 'space'], related: ['once-telescope', 'humans-carl-sagan', 'humans-galileo-galilei'] },
  { section: 'humans', title: 'Ibn al-Haytham', category: 'Scientists', subcategory: 'Physics', note: 'His studies of optics helped explain vision, light, experiment, and lenses.', terms: ['optics', 'light', 'vision', 'experiment'], related: ['once-eyeglasses', 'once-camera', 'once-scientific-method'] },
  { section: 'humans', title: 'Alexander Fleming', category: 'Scientists', subcategory: 'Medicine', note: 'His discovery of penicillin helped open the antibiotic age.', terms: ['penicillin', 'antibiotics', 'medicine', 'infection'], related: ['once-antibiotics', 'once-germ-theory', 'humans-louis-pasteur'] },
  { section: 'humans', title: 'Jonas Salk', category: 'Scientists', subcategory: 'Medicine', note: 'His polio vaccine helped turn a feared disease into something preventable.', terms: ['vaccine', 'polio', 'medicine', 'public health'], related: ['once-vaccines', 'humans-louis-pasteur', 'once-germ-theory'] },
  { section: 'humans', title: 'Dorothy Hodgkin', category: 'Scientists', subcategory: 'Chemistry', note: 'Her crystallography work revealed the shapes of important biological molecules.', terms: ['chemistry', 'crystallography', 'x-ray', 'molecules'], related: ['once-x-ray', 'humans-rosalind-franklin', 'once-dna-double-helix'] },
  { section: 'humans', title: 'Grace Hopper', category: 'Engineers', subcategory: 'Software', note: 'She helped make programming languages more approachable and practical.', terms: ['software', 'compiler', 'programming', 'computer'], related: ['once-computer', 'humans-ada-lovelace', 'humans-alan-turing'] },
  { section: 'humans', title: 'Hedy Lamarr', category: 'Engineers', subcategory: 'Electrical', note: 'Her frequency-hopping idea became part of the story of wireless communication.', terms: ['wireless', 'signal', 'radio', 'invention'], related: ['once-radio', 'once-smartphone', 'once-internet'] },
  { section: 'humans', title: 'Tim Berners-Lee', category: 'Engineers', subcategory: 'Software', note: 'He created the World Wide Web, making linked information easier to publish and browse.', terms: ['web', 'internet', 'software', 'html'], related: ['once-internet', 'once-computer', 'once-smartphone'] },
  { section: 'humans', title: 'Steve Wozniak', category: 'Engineers', subcategory: 'Computing', note: 'His personal computer designs helped make computing feel reachable and playful.', terms: ['computer', 'apple', 'hardware', 'personal computer'], related: ['once-computer', 'humans-steve-jobs', 'humans-grace-hopper'] },
  { section: 'humans', title: 'Isambard Kingdom Brunel', category: 'Engineers', subcategory: 'Civil', note: 'His bridges, ships, tunnels, and railways embodied engineering ambition at industrial scale.', terms: ['railway', 'bridge', 'ship', 'engineering'], related: ['once-railroad', 'once-ship', 'once-steam-engine'] },
  { section: 'humans', title: 'Gustave Eiffel', category: 'Engineers', subcategory: 'Structures', note: 'His iron structures made engineering itself visible as public spectacle.', terms: ['tower', 'structure', 'iron', 'architecture'], related: ['once-architecture', 'once-elevator', 'once-concrete'] },
  { section: 'humans', title: 'Fazlur Rahman Khan', category: 'Engineers', subcategory: 'Structures', note: 'His structural systems helped make modern skyscrapers taller and more efficient.', terms: ['skyscraper', 'structure', 'architecture', 'engineering'], related: ['once-elevator', 'once-concrete', 'once-architecture'] },
  { section: 'humans', title: 'Wright Brothers', category: 'Engineers', subcategory: 'Aerospace', note: 'Their powered flight experiments helped turn aviation from dream into machine.', terms: ['flight', 'airplane', 'aviation', 'aerospace'], related: ['once-airplane', 'humans-amelia-earhart', 'once-bicycle'] },
  { section: 'humans', title: 'Mary Jackson', category: 'Engineers', subcategory: 'Aerospace', note: 'Her engineering work at NASA helped open paths in aerospace and representation.', terms: ['NASA', 'aerospace', 'engineer', 'space'], related: ['humans-katherine-johnson', 'once-airplane', 'once-telescope'] },
  { section: 'humans', title: 'Margaret Hamilton', category: 'Engineers', subcategory: 'Software', note: 'Her Apollo software work helped make moon missions safer and more reliable.', terms: ['software', 'Apollo', 'NASA', 'space'], related: ['humans-katherine-johnson', 'once-computer', 'once-telescope'] },
  { section: 'humans', title: 'Benjamin Franklin', category: 'Creators', subcategory: 'Inventors', note: 'He moved between science, printing, politics, invention, and public life with restless curiosity.', terms: ['electricity', 'printer', 'inventor', 'founder'], related: ['once-electricity', 'once-printing-press', 'once-light-bulb'] },
  { section: 'humans', title: 'Thomas Edison', category: 'Creators', subcategory: 'Inventors', note: 'His laboratories turned invention into organized development and public technology.', terms: ['inventor', 'light bulb', 'phonograph', 'electricity'], related: ['once-light-bulb', 'once-phonograph', 'once-electricity'] },
  { section: 'humans', title: 'George Washington Carver', category: 'Creators', subcategory: 'Makers', note: 'His agricultural work connected science, soil, education, and practical invention.', terms: ['agriculture', 'peanuts', 'farming', 'science'], related: ['once-plow', 'once-irrigation', 'once-tractor'] },
  { section: 'humans', title: 'Johannes Gutenberg', category: 'Creators', subcategory: 'Inventors', note: 'His printing innovations helped scale books and public knowledge.', terms: ['printing', 'books', 'type', 'press'], related: ['once-printing-press', 'once-paper', 'once-typeface'] },
  { section: 'humans', title: 'Walt Disney', category: 'Creators', subcategory: 'Entrepreneurs', note: 'He built a modern entertainment world around animation, characters, parks, and story systems.', terms: ['animation', 'film', 'entertainment', 'business'], related: ['once-cinema', 'once-camera', 'humans-charlie-chaplin'] },
  { section: 'humans', title: 'Steve Jobs', category: 'Creators', subcategory: 'Entrepreneurs', note: 'He shaped how personal technology could feel designed, desirable, and culturally central.', terms: ['apple', 'computer', 'smartphone', 'design'], related: ['once-smartphone', 'once-computer', 'humans-steve-wozniak'] },
  { section: 'humans', title: 'Sacagawea', category: 'Creators', subcategory: 'Explorers', note: 'Her knowledge and presence became central to one of the best-known journeys across North America.', terms: ['exploration', 'guide', 'journey', 'north america'], related: ['once-compass', 'once-ship', 'humans-amelia-earhart'] },
  { section: 'humans', title: 'Yuri Gagarin', category: 'Creators', subcategory: 'Pioneers', note: 'He became the first human in space and changed the public imagination of Earth from above.', terms: ['space', 'cosmonaut', 'orbit', 'flight'], related: ['once-telescope', 'humans-neil-armstrong', 'once-airplane'] },
  { section: 'humans', title: 'Neil Armstrong', category: 'Creators', subcategory: 'Pioneers', note: 'His first steps on the Moon turned spaceflight into a shared human memory.', terms: ['moon', 'astronaut', 'apollo', 'space'], related: ['humans-yuri-gagarin', 'humans-margaret-hamilton', 'once-telescope'] },
  { section: 'humans', title: 'Jacques Cousteau', category: 'Creators', subcategory: 'Explorers', note: 'He brought underwater exploration and ocean life into public view.', terms: ['ocean', 'diving', 'exploration', 'film'], related: ['once-ship', 'once-camera', 'humans-rachel-carson'] },
  { section: 'humans', title: 'Pablo Picasso', category: 'Artists', subcategory: 'Painters', note: 'His work helped fracture and rebuild visual form for modern art.', terms: ['painting', 'cubism', 'modern art', 'artist'], related: ['humans-vincent-van-gogh', 'humans-claude-monet', 'once-perspective'] },
  { section: 'humans', title: 'Vincent van Gogh', category: 'Artists', subcategory: 'Painters', note: 'His color and brushwork made inner intensity visible on canvas.', terms: ['painting', 'post impressionism', 'sunflowers', 'art'], related: ['once-oil-paint', 'humans-claude-monet', 'humans-frida-kahlo'] },
  { section: 'humans', title: 'Georgia O Keeffe', category: 'Artists', subcategory: 'Painters', note: 'Her enlarged flowers, bones, and landscapes made American modernism feel intimate and monumental.', terms: ['painting', 'modernism', 'flowers', 'artist'], related: ['humans-frida-kahlo', 'humans-yayoi-kusama', 'once-oil-paint'] },
  { section: 'humans', title: 'Michelangelo', category: 'Artists', subcategory: 'Sculptors', note: 'His sculpture and painting made the human body feel heroic, tense, and spiritual.', terms: ['sculpture', 'renaissance', 'painting', 'sistine'], related: ['humans-leonardo-da-vinci', 'once-sculpture', 'once-architecture'] },
  { section: 'humans', title: 'Claude Monet', category: 'Artists', subcategory: 'Painters', note: 'His studies of light helped make impressionism a new way of seeing time and atmosphere.', terms: ['impressionism', 'painting', 'water lilies', 'light'], related: ['humans-vincent-van-gogh', 'once-oil-paint', 'once-photography'] },
  { section: 'humans', title: 'Yayoi Kusama', category: 'Artists', subcategory: 'Designers', note: 'Her dots, rooms, repetition, and immersive spaces made infinity feel playful and intense.', terms: ['installation', 'dots', 'contemporary art', 'design'], related: ['humans-georgia-o-keeffe', 'once-mosaic', 'once-architecture'] },
  { section: 'humans', title: 'Ansel Adams', category: 'Artists', subcategory: 'Photographers', note: 'His landscape photographs shaped how wilderness could be seen, preserved, and admired.', terms: ['photography', 'landscape', 'camera', 'wilderness'], related: ['once-photography', 'once-camera', 'humans-rachel-carson'] },
  { section: 'humans', title: 'Zaha Hadid', category: 'Artists', subcategory: 'Architects', note: 'Her buildings made curves, motion, and futuristic form part of public architecture.', terms: ['architecture', 'buildings', 'design', 'city'], related: ['once-architecture', 'once-concrete', 'humans-fazlur-rahman-khan'] },
  { section: 'humans', title: 'Homer', category: 'Writers', subcategory: 'Poets', note: 'His epics became deep sources for Western storytelling about war, homecoming, gods, and memory.', terms: ['epic', 'poetry', 'iliad', 'odyssey'], related: ['once-epic-of-gilgamesh', 'once-myths', 'once-paper'] },
  { section: 'humans', title: 'Virginia Woolf', category: 'Writers', subcategory: 'Novelists', note: 'Her fiction explored consciousness, time, gender, and the interior life with unusual fluidity.', terms: ['novel', 'modernism', 'essay', 'literature'], related: ['humans-jane-austen', 'humans-mary-shelley', 'once-novels'] },
  { section: 'humans', title: 'Toni Morrison', category: 'Writers', subcategory: 'Novelists', note: 'Her novels gave history, memory, beauty, and trauma a powerful literary voice.', terms: ['novel', 'literature', 'beloved', 'memory'], related: ['humans-james-baldwin', 'humans-maya-angelou', 'once-paper'] },
  { section: 'humans', title: 'James Baldwin', category: 'Writers', subcategory: 'Essayists', note: 'His essays and fiction cut into race, love, nation, sexuality, and moral honesty.', terms: ['essay', 'civil rights', 'literature', 'voice'], related: ['humans-maya-angelou', 'humans-toni-morrison', 'once-newspaper'] },
  { section: 'humans', title: 'Emily Dickinson', category: 'Writers', subcategory: 'Poets', note: 'Her compact poems made thought, death, nature, and inwardness feel startlingly alive.', terms: ['poetry', 'poem', 'literature', 'language'], related: ['humans-maya-angelou', 'once-paper', 'once-poetry'] },
  { section: 'humans', title: 'Mary Shelley', category: 'Writers', subcategory: 'Novelists', note: 'Her Frankenstein joined science, fear, creation, responsibility, and modern myth.', terms: ['frankenstein', 'novel', 'science fiction', 'literature'], related: ['humans-virginia-woolf', 'once-electricity', 'once-novels'] },
  { section: 'humans', title: 'Chinua Achebe', category: 'Writers', subcategory: 'Novelists', note: 'His fiction helped reshape how colonial encounter and African life were read globally.', terms: ['novel', 'african literature', 'things fall apart', 'story'], related: ['humans-toni-morrison', 'once-folktale', 'once-paper'] },
  { section: 'humans', title: 'Charlie Chaplin', category: 'Performers', subcategory: 'Actors', note: 'His silent film comedy made gesture, pathos, and timing globally legible.', terms: ['film', 'comedy', 'actor', 'cinema'], related: ['once-cinema', 'once-stand-up-comedy', 'humans-walt-disney'] },
  { section: 'humans', title: 'Meryl Streep', category: 'Performers', subcategory: 'Actors', note: 'Her screen performances became known for precision, range, voice, and transformation.', terms: ['actor', 'film', 'performance', 'cinema'], related: ['once-cinema', 'humans-charlie-chaplin', 'once-theater'] },
  { section: 'humans', title: 'Michael Jackson', category: 'Performers', subcategory: 'Singers', note: 'His music videos, dancing, voice, and spectacle helped define global pop performance.', terms: ['pop', 'singer', 'dance', 'music'], related: ['once-popular-music', 'once-radio', 'once-cinema'] },
  { section: 'humans', title: 'Aretha Franklin', category: 'Performers', subcategory: 'Singers', note: 'Her voice carried soul, gospel force, technical command, and cultural authority.', terms: ['soul', 'singer', 'music', 'voice'], related: ['once-radio', 'once-opera', 'humans-maya-angelou'] },
  { section: 'humans', title: 'Misty Copeland', category: 'Performers', subcategory: 'Dancers', note: 'Her ballet career expanded visibility and possibility inside a demanding classical form.', terms: ['ballet', 'dance', 'performer', 'stage'], related: ['once-ballet', 'once-olympic-games', 'humans-amelia-earhart'] },
]

const expansionPages = expansionSpecs.map(makeExpansionPage)

function applyContentCorrections(page: ContentPage): ContentPage {
  if (page.id === 'humans-charles-darwin') {
    return normalizeHumanTaxonomy({
      ...page,
      category: 'Thinkers',
      subcategory: 'Biology',
      relatedIds: ['once-evolution', 'once-dna-double-helix', 'once-germ-theory', 'humans-rachel-carson', 'humans-rosalind-franklin'],
      searchTerms: ['evolution', 'biology', 'species', 'natural selection', 'darwin'],
    })
  }

  return normalizeHumanTaxonomy(page)
}

function normalizeHumanTaxonomy(page: ContentPage): ContentPage {
  if (page.section !== 'humans') return page

    const categoryMap: Record<string, string> = {
      Engineers: 'Builders',
      Scientists: 'Thinkers',
      Writers: 'Thinkers',
      Teachers: 'Leaders',
    }

  return {
    ...page,
    category: categoryMap[page.category] || page.category,
  }
}

function fillRelatedIds(pages: ContentPage[]) {
  return pages.map((page) => {
    const explicitRelatedIds = page.relatedIds || []
    const relatedIds = [
      ...explicitRelatedIds,
      ...pages
        .filter((candidate) => candidate.id !== page.id)
        .filter((candidate) => (
          candidate.subcategory === page.subcategory ||
          candidate.category === page.category ||
          candidate.section !== page.section
        ))
        .map((candidate) => candidate.id),
    ]
      .filter((id, index, ids) => ids.indexOf(id) === index)
      .filter((id) => pages.some((candidate) => candidate.id === id))
      .slice(0, 10)

    return { ...page, relatedIds }
  })
}

export const seededPages: ContentPage[] = fillRelatedIds([
  ...baseSeededPages,
  ...expansionPages,
].map(applyContentCorrections))

export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function getCategoryBySlug(section: SectionType, categorySlug: string) {
  return categories[section].find((category) => slugify(category.title) === categorySlug)
}

export function getSubcategoryBySlug(section: SectionType, categorySlug: string, subcategorySlug: string) {
  const category = getCategoryBySlug(section, categorySlug)
  const subcategory = category?.subcategories.find((candidate) => slugify(candidate.title) === subcategorySlug)

  return category && subcategory ? { category, subcategory } : undefined
}

export function getPagesForSubcategory(section: SectionType, category: string, subcategory: string) {
  return seededPages.filter((page) => (
    page.section === section &&
    page.category === category &&
    page.subcategory === subcategory
  ))
}

export function findPageById(id: string) {
  return seededPages.find((page) => page.id === id)
}

export function getRelatedPages(page: ContentPage) {
  return (page.relatedIds || [])
    .slice(0, 10)
    .map((id) => findPageById(id))
    .filter((relatedPage): relatedPage is ContentPage => Boolean(relatedPage))
}

function getSearchRank(page: ContentPage, query: string) {
  const normalizedTitle = page.title.toLowerCase()
  const normalizedCategory = page.category.toLowerCase()
  const normalizedSubcategory = page.subcategory.toLowerCase()
  const normalizedTerms = (page.searchTerms || []).join(' ').toLowerCase()
  const normalizedDescription = page.description.toLowerCase()

  if (normalizedTitle === query) return 0
  if (normalizedTitle.startsWith(query)) return 1
  if (normalizedTitle.includes(query)) return 2
  if (normalizedCategory.includes(query) || normalizedSubcategory.includes(query)) return 3
  if (normalizedTerms.includes(query)) return 4
  if (normalizedDescription.includes(query)) return 5

  return 99
}

export function searchPages(query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return seededPages

  return seededPages
    .filter((page) => getSearchRank(page, normalizedQuery) < 99)
    .sort((firstPage, secondPage) => {
      const rankDifference = getSearchRank(firstPage, normalizedQuery) - getSearchRank(secondPage, normalizedQuery)
      if (rankDifference !== 0) return rankDifference
      return firstPage.title.localeCompare(secondPage.title)
    })
}

export function autocompletePages(query: string, limit = 8) {
  return searchPages(query).slice(0, limit)
}
