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
      ],
    },
    {
      title: 'Engineers',
      description: 'Builders of machines, systems, and practical progress.',
      accent: 'from-slate-200 via-slate-300 to-slate-400',
      subcategories: [
        { title: 'Computing', description: 'People who shaped digital systems.' },
        { title: 'Machines', description: 'Builders of physical mechanisms.' },
        { title: 'Structures', description: 'People who made durable environments.' },
      ],
    },
    {
      title: 'Scientists',
      description: 'Thinkers who turned curiosity into knowledge.',
      accent: 'from-cyan-200 via-sky-200 to-blue-200',
      subcategories: [
        { title: 'Physics', description: 'People who studied matter and motion.' },
        { title: 'Chemistry', description: 'People who studied substances and change.' },
        { title: 'Astronomy', description: 'People who studied worlds beyond Earth.' },
      ],
    },
    {
      title: 'Writers',
      description: 'Authors of poems, essays, and stories of humanity.',
      accent: 'from-lime-200 via-emerald-200 to-teal-200',
      subcategories: [
        { title: 'Playwrights', description: 'Writers for performance.' },
        { title: 'Novelists', description: 'Writers of long fiction.' },
        { title: 'Poets', description: 'Writers of concentrated language.' },
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
      ],
    },
  ],
}

export const seededPages: ContentPage[] = [
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

export function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
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
