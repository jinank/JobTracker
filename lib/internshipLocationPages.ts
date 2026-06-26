export type InternshipLocationKind = "state" | "city";

export type InternshipLocationPage = {
  slug: string;
  path: string;
  title: string;
  heading: string;
  description: string;
  intro: string;
  keywords: string[];
  kind: InternshipLocationKind;
  /** Shorter label for footer navigation. */
  footerLabel?: string;
  /** Substrings matched against listing location (any match counts). */
  locationMatchers: string[];
  relatedLinks: { href: string; label: string }[];
};

const BASE_RELATED_LINKS: { href: string; label: string }[] = [
  { href: "/find-internships", label: "All Summer 2027 internships" },
  { href: "/blog/summer-2027-internships", label: "Summer 2027 internship timeline" },
  {
    href: "/blog/2027-summer-internships-practical-guide",
    label: "2027 summer internships guide",
  },
];

function locationPage(
  config: Omit<InternshipLocationPage, "path" | "relatedLinks" | "kind"> &
    Partial<Pick<InternshipLocationPage, "kind" | "footerLabel">> & {
      extraRelatedLinks?: { href: string; label: string }[];
    }
): InternshipLocationPage {
  const { kind = "state", footerLabel, extraRelatedLinks, ...rest } = config;
  return {
    ...rest,
    kind,
    footerLabel,
    path: `/${rest.slug}`,
    relatedLinks: [...BASE_RELATED_LINKS, ...(extraRelatedLinks ?? [])],
  };
}

export const INTERNSHIP_LOCATION_PAGES: InternshipLocationPage[] = [
  locationPage({
    slug: "new-york-summer-2027-internships",
    title: "New York Summer 2027 Internships",
    heading: "New York Summer 2027 Internships",
    description:
      "Looking for a New York summer 2027 internship? Browse current US opportunities in NYC and New York State from company career pages. Find your perfect internship.",
    intro:
      "Browse summer 2027 internships in New York City and across New York State, synced from company career pages, not crowded job boards. Apply directly and track every application in SuperInterns.",
    keywords: [
      "new york summer 2027 internships",
      "nyc summer 2027 internships",
      "summer 2027 internships new york",
      "2027 summer internships",
      "New York internships",
      "NYC internships",
      "student internships",
    ],
    locationMatchers: [
      "new york",
      ", ny",
      "manhattan",
      "brooklyn",
      "queens",
      "bronx",
      "staten island",
    ],
  }),
  locationPage({
    slug: "california-summer-2027-internships",
    title: "California Summer 2027 Internships",
    heading: "California Summer 2027 Internships",
    description:
      "Looking for a California summer 2027 internship? Browse internships in San Francisco, Los Angeles, San Diego, and across the state from company career pages.",
    intro:
      "Browse summer 2027 internships in California, from Bay Area tech hubs to LA and San Diego, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "california summer 2027 internships",
      "summer 2027 internships california",
      "san francisco summer 2027 internships",
      "los angeles summer 2027 internships",
      "California internships",
      "Bay Area internships",
      "student internships",
    ],
    locationMatchers: [
      "california",
      ", ca",
      "san francisco",
      "los angeles",
      "san diego",
      "san jose",
      "oakland",
      "palo alto",
      "mountain view",
      "sunnyvale",
      "irvine",
      "santa clara",
      "sacramento",
    ],
  }),
  locationPage({
    slug: "texas-summer-2027-internships",
    title: "Texas Summer 2027 Internships",
    heading: "Texas Summer 2027 Internships",
    description:
      "Looking for a Texas summer 2027 internship? Browse roles in Austin, Dallas, Houston, and across Texas from company career pages.",
    intro:
      "Browse summer 2027 internships in Texas, including Austin, Dallas, and Houston, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "texas summer 2027 internships",
      "summer 2027 internships texas",
      "austin summer 2027 internships",
      "dallas summer 2027 internships",
      "houston summer 2027 internships",
      "Texas internships",
      "student internships",
    ],
    locationMatchers: [
      "texas",
      ", tx",
      "austin",
      "dallas",
      "houston",
      "san antonio",
      "fort worth",
      "plano",
      "irving",
    ],
  }),
  locationPage({
    slug: "florida-summer-2027-internships",
    title: "Florida Summer 2027 Internships",
    heading: "Florida Summer 2027 Internships",
    description:
      "Looking for a Florida summer 2027 internship? Browse internships in Miami, Tampa, Orlando, and across Florida from company career pages.",
    intro:
      "Browse summer 2027 internships in Florida, from Miami and Tampa to Orlando and Jacksonville, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "florida summer 2027 internships",
      "summer 2027 internships florida",
      "miami summer 2027 internships",
      "tampa summer 2027 internships",
      "orlando summer 2027 internships",
      "Florida internships",
      "student internships",
    ],
    locationMatchers: [
      "florida",
      ", fl",
      "miami",
      "tampa",
      "orlando",
      "jacksonville",
      "fort lauderdale",
      "st. petersburg",
    ],
  }),
  locationPage({
    slug: "illinois-summer-2027-internships",
    title: "Illinois Summer 2027 Internships",
    heading: "Illinois Summer 2027 Internships",
    description:
      "Looking for an Illinois summer 2027 internship? Browse internships in Chicago, Champaign, and across Illinois from company career pages.",
    intro:
      "Browse summer 2027 internships in Illinois, including Chicago and university towns like Champaign, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "illinois summer 2027 internships",
      "summer 2027 internships illinois",
      "chicago summer 2027 internships",
      "2027 summer internships chicago",
      "Illinois internships",
      "Chicago internships",
      "student internships",
    ],
    locationMatchers: [
      "illinois",
      ", il",
      "chicago",
      "champaign",
      "urbana",
      "naperville",
      "evanston",
    ],
  }),
  locationPage({
    slug: "massachusetts-summer-2027-internships",
    title: "Massachusetts Summer 2027 Internships",
    heading: "Massachusetts Summer 2027 Internships",
    description:
      "Looking for a Massachusetts summer 2027 internship? Browse internships in Boston, Cambridge, and across the state from company career pages.",
    intro:
      "Browse summer 2027 internships in Massachusetts, including Boston and Cambridge, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "massachusetts summer 2027 internships",
      "boston summer 2027 internships",
      "summer 2027 internships boston",
      "Boston internships",
      "Massachusetts internships",
      "student internships",
    ],
    locationMatchers: [
      "massachusetts",
      ", ma",
      "boston",
      "cambridge",
      "somerville",
      "waltham",
      "burlington",
    ],
  }),
  locationPage({
    slug: "washington-summer-2027-internships",
    title: "Washington Summer 2027 Internships",
    heading: "Washington Summer 2027 Internships",
    description:
      "Looking for a Washington summer 2027 internship? Browse internships in Seattle, Bellevue, and across Washington State from company career pages.",
    intro:
      "Browse summer 2027 internships in Washington State, including Seattle and the Eastside tech corridor, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "washington summer 2027 internships",
      "seattle summer 2027 internships",
      "summer 2027 internships seattle",
      "Washington State internships",
      "Seattle internships",
      "student internships",
    ],
    locationMatchers: [
      ", wa",
      "seattle",
      "bellevue",
      "redmond",
      "kirkland",
      "tacoma",
      "spokane",
      "washington state",
    ],
  }),
  locationPage({
    slug: "georgia-summer-2027-internships",
    title: "Georgia Summer 2027 Internships",
    heading: "Georgia Summer 2027 Internships",
    description:
      "Looking for a Georgia summer 2027 internship? Browse internships in Atlanta and across Georgia from company career pages.",
    intro:
      "Browse summer 2027 internships in Georgia, centered on Atlanta and synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "georgia summer 2027 internships",
      "atlanta summer 2027 internships",
      "summer 2027 internships atlanta",
      "Georgia internships",
      "Atlanta internships",
      "student internships",
    ],
    locationMatchers: [
      "georgia",
      ", ga",
      "atlanta",
      "alpharetta",
      "sandy springs",
      "marietta",
    ],
  }),
  locationPage({
    slug: "pennsylvania-summer-2027-internships",
    title: "Pennsylvania Summer 2027 Internships",
    heading: "Pennsylvania Summer 2027 Internships",
    description:
      "Looking for a Pennsylvania summer 2027 internship? Browse internships in Philadelphia, Pittsburgh, and across the state from company career pages.",
    intro:
      "Browse summer 2027 internships in Pennsylvania, including Philadelphia and Pittsburgh, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "pennsylvania summer 2027 internships",
      "philadelphia summer 2027 internships",
      "pittsburgh summer 2027 internships",
      "Pennsylvania internships",
      "Philadelphia internships",
      "student internships",
    ],
    locationMatchers: [
      "pennsylvania",
      ", pa",
      "philadelphia",
      "pittsburgh",
      "harrisburg",
      "malvern",
      "conshohocken",
    ],
  }),
  locationPage({
    slug: "new-jersey-summer-2027-internships",
    title: "New Jersey Summer 2027 Internships",
    heading: "New Jersey Summer 2027 Internships",
    description:
      "Looking for a New Jersey summer 2027 internship? Browse internships in Jersey City, Newark, Princeton, and across the state from company career pages.",
    intro:
      "Browse summer 2027 internships in New Jersey, from NYC-adjacent hubs to Princeton, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "new jersey summer 2027 internships",
      "summer 2027 internships new jersey",
      "jersey city summer 2027 internships",
      "New Jersey internships",
      "NJ internships",
      "student internships",
    ],
    locationMatchers: [
      "new jersey",
      ", nj",
      "jersey city",
      "newark",
      "hoboken",
      "princeton",
      "morristown",
      "iselin",
    ],
  }),
  locationPage({
    slug: "colorado-summer-2027-internships",
    title: "Colorado Summer 2027 Internships",
    heading: "Colorado Summer 2027 Internships",
    description:
      "Looking for a Colorado summer 2027 internship? Browse internships in Denver, Boulder, and across Colorado from company career pages.",
    intro:
      "Browse summer 2027 internships in Colorado, including Denver and Boulder, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "colorado summer 2027 internships",
      "denver summer 2027 internships",
      "boulder summer 2027 internships",
      "Colorado internships",
      "Denver internships",
      "student internships",
    ],
    locationMatchers: [
      "colorado",
      ", co",
      "denver",
      "boulder",
      "aurora",
      "fort collins",
      "colorado springs",
    ],
  }),
  locationPage({
    slug: "north-carolina-summer-2027-internships",
    title: "North Carolina Summer 2027 Internships",
    heading: "North Carolina Summer 2027 Internships",
    description:
      "Looking for a North Carolina summer 2027 internship? Browse internships in Charlotte, Raleigh, Durham, and across the state from company career pages.",
    intro:
      "Browse summer 2027 internships in North Carolina, including Charlotte and the Research Triangle, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "north carolina summer 2027 internships",
      "charlotte summer 2027 internships",
      "raleigh summer 2027 internships",
      "North Carolina internships",
      "Charlotte internships",
      "student internships",
    ],
    locationMatchers: [
      "north carolina",
      ", nc",
      "charlotte",
      "raleigh",
      "durham",
      "cary",
      "morrisville",
      "chapel hill",
    ],
  }),
  locationPage({
    slug: "virginia-summer-2027-internships",
    title: "Virginia Summer 2027 Internships",
    heading: "Virginia Summer 2027 Internships",
    description:
      "Looking for a Virginia summer 2027 internship? Browse internships in Northern Virginia, Richmond, and across the state from company career pages.",
    intro:
      "Browse summer 2027 internships in Virginia, including Arlington, Alexandria, and Richmond, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "virginia summer 2027 internships",
      "northern virginia summer 2027 internships",
      "arlington summer 2027 internships",
      "Virginia internships",
      "NoVA internships",
      "student internships",
    ],
    locationMatchers: [
      ", va",
      "arlington",
      "alexandria",
      "fairfax",
      "mclean",
      "reston",
      "herndon",
      "virginia beach",
      "norfolk",
      "richmond",
    ],
  }),
  locationPage({
    slug: "ohio-summer-2027-internships",
    title: "Ohio Summer 2027 Internships",
    heading: "Ohio Summer 2027 Internships",
    description:
      "Looking for an Ohio summer 2027 internship? Browse internships in Columbus, Cincinnati, Cleveland, and across Ohio from company career pages.",
    intro:
      "Browse summer 2027 internships in Ohio, including Columbus, Cincinnati, and Cleveland, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "ohio summer 2027 internships",
      "columbus summer 2027 internships",
      "cincinnati summer 2027 internships",
      "Ohio internships",
      "Columbus internships",
      "student internships",
    ],
    locationMatchers: [
      "ohio",
      ", oh",
      "columbus",
      "cincinnati",
      "cleveland",
      "dayton",
      "akron",
    ],
  }),
  locationPage({
    slug: "michigan-summer-2027-internships",
    title: "Michigan Summer 2027 Internships",
    heading: "Michigan Summer 2027 Internships",
    description:
      "Looking for a Michigan summer 2027 internship? Browse internships in Detroit, Ann Arbor, and across Michigan from company career pages.",
    intro:
      "Browse summer 2027 internships in Michigan, including Detroit and Ann Arbor, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "michigan summer 2027 internships",
      "detroit summer 2027 internships",
      "ann arbor summer 2027 internships",
      "Michigan internships",
      "Detroit internships",
      "student internships",
    ],
    locationMatchers: [
      "michigan",
      ", mi",
      "detroit",
      "ann arbor",
      "dearborn",
      "grand rapids",
      "troy",
    ],
  }),
  locationPage({
    slug: "arizona-summer-2027-internships",
    title: "Arizona Summer 2027 Internships",
    heading: "Arizona Summer 2027 Internships",
    description:
      "Looking for an Arizona summer 2027 internship? Browse internships in Phoenix, Scottsdale, Tempe, and across Arizona from company career pages.",
    intro:
      "Browse summer 2027 internships in Arizona, including Phoenix and the greater Valley, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "arizona summer 2027 internships",
      "phoenix summer 2027 internships",
      "scottsdale summer 2027 internships",
      "Arizona internships",
      "Phoenix internships",
      "student internships",
    ],
    locationMatchers: [
      "arizona",
      ", az",
      "phoenix",
      "scottsdale",
      "tempe",
      "chandler",
      "mesa",
      "tucson",
    ],
  }),
  locationPage({
    slug: "minnesota-summer-2027-internships",
    title: "Minnesota Summer 2027 Internships",
    heading: "Minnesota Summer 2027 Internships",
    description:
      "Looking for a Minnesota summer 2027 internship? Browse internships in Minneapolis, St. Paul, and across Minnesota from company career pages.",
    intro:
      "Browse summer 2027 internships in Minnesota, including Minneapolis and St. Paul, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "minnesota summer 2027 internships",
      "minneapolis summer 2027 internships",
      "st paul summer 2027 internships",
      "Minnesota internships",
      "Minneapolis internships",
      "student internships",
    ],
    locationMatchers: [
      "minnesota",
      ", mn",
      "minneapolis",
      "st. paul",
      "saint paul",
      "bloomington",
      "eden prairie",
    ],
  }),
  locationPage({
    slug: "connecticut-summer-2027-internships",
    title: "Connecticut Summer 2027 Internships",
    heading: "Connecticut Summer 2027 Internships",
    description:
      "Looking for a Connecticut summer 2027 internship? Browse internships in Hartford, Stamford, New Haven, and across Connecticut from company career pages.",
    intro:
      "Browse summer 2027 internships in Connecticut, from Stamford and Hartford to New Haven, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "connecticut summer 2027 internships",
      "stamford summer 2027 internships",
      "hartford summer 2027 internships",
      "Connecticut internships",
      "Stamford internships",
      "student internships",
    ],
    locationMatchers: [
      "connecticut",
      ", ct",
      "hartford",
      "stamford",
      "new haven",
      "norwalk",
      "greenwich",
      "fairfield",
    ],
  }),
  locationPage({
    slug: "maryland-summer-2027-internships",
    title: "Maryland Summer 2027 Internships",
    heading: "Maryland Summer 2027 Internships",
    description:
      "Looking for a Maryland summer 2027 internship? Browse internships in Baltimore, Bethesda, and across Maryland from company career pages.",
    intro:
      "Browse summer 2027 internships in Maryland, including Baltimore and the DC suburbs, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "maryland summer 2027 internships",
      "baltimore summer 2027 internships",
      "bethesda summer 2027 internships",
      "Maryland internships",
      "Baltimore internships",
      "student internships",
    ],
    locationMatchers: [
      "maryland",
      ", md",
      "baltimore",
      "bethesda",
      "rockville",
      "columbia",
      "annapolis",
      "silver spring",
    ],
  }),
  locationPage({
    slug: "oregon-summer-2027-internships",
    title: "Oregon Summer 2027 Internships",
    heading: "Oregon Summer 2027 Internships",
    description:
      "Looking for an Oregon summer 2027 internship? Browse internships in Portland and across Oregon from company career pages.",
    intro:
      "Browse summer 2027 internships in Oregon, centered on Portland and synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "oregon summer 2027 internships",
      "portland summer 2027 internships",
      "Oregon internships",
      "Portland internships",
      "student internships",
    ],
    locationMatchers: [
      "oregon",
      ", or",
      "portland",
      "beaverton",
      "hillsboro",
      "lake oswego",
      "tigard",
    ],
  }),
  locationPage({
    slug: "tennessee-summer-2027-internships",
    title: "Tennessee Summer 2027 Internships",
    heading: "Tennessee Summer 2027 Internships",
    description:
      "Looking for a Tennessee summer 2027 internship? Browse internships in Nashville, Memphis, and across Tennessee from company career pages.",
    intro:
      "Browse summer 2027 internships in Tennessee, including Nashville and Memphis, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "tennessee summer 2027 internships",
      "nashville summer 2027 internships",
      "memphis summer 2027 internships",
      "Tennessee internships",
      "Nashville internships",
      "student internships",
    ],
    locationMatchers: [
      "tennessee",
      ", tn",
      "nashville",
      "memphis",
      "knoxville",
      "chattanooga",
      "franklin",
    ],
  }),
  locationPage({
    slug: "indiana-summer-2027-internships",
    title: "Indiana Summer 2027 Internships",
    heading: "Indiana Summer 2027 Internships",
    description:
      "Looking for an Indiana summer 2027 internship? Browse internships in Indianapolis, Carmel, and across Indiana from company career pages.",
    intro:
      "Browse summer 2027 internships in Indiana, including Indianapolis and Bloomington, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "indiana summer 2027 internships",
      "indianapolis summer 2027 internships",
      "Indiana internships",
      "Indianapolis internships",
      "student internships",
    ],
    locationMatchers: [
      "indiana",
      ", in",
      "indianapolis",
      "carmel",
      "bloomington",
      "fort wayne",
    ],
  }),
  locationPage({
    slug: "wisconsin-summer-2027-internships",
    title: "Wisconsin Summer 2027 Internships",
    heading: "Wisconsin Summer 2027 Internships",
    description:
      "Looking for a Wisconsin summer 2027 internship? Browse internships in Milwaukee, Madison, and across Wisconsin from company career pages.",
    intro:
      "Browse summer 2027 internships in Wisconsin, including Milwaukee and Madison, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "wisconsin summer 2027 internships",
      "milwaukee summer 2027 internships",
      "madison summer 2027 internships",
      "Wisconsin internships",
      "Milwaukee internships",
      "student internships",
    ],
    locationMatchers: [
      "wisconsin",
      ", wi",
      "milwaukee",
      "madison",
      "green bay",
      "waukesha",
    ],
  }),
  locationPage({
    slug: "missouri-summer-2027-internships",
    title: "Missouri Summer 2027 Internships",
    heading: "Missouri Summer 2027 Internships",
    description:
      "Looking for a Missouri summer 2027 internship? Browse internships in St. Louis, Kansas City, and across Missouri from company career pages.",
    intro:
      "Browse summer 2027 internships in Missouri, including St. Louis and Kansas City, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "missouri summer 2027 internships",
      "st louis summer 2027 internships",
      "kansas city summer 2027 internships",
      "Missouri internships",
      "St. Louis internships",
      "student internships",
    ],
    locationMatchers: [
      "missouri",
      ", mo",
      "st. louis",
      "saint louis",
      "kansas city",
      "st louis",
      "columbia",
    ],
  }),
  locationPage({
    slug: "utah-summer-2027-internships",
    title: "Utah Summer 2027 Internships",
    heading: "Utah Summer 2027 Internships",
    description:
      "Looking for a Utah summer 2027 internship? Browse internships in Salt Lake City, Lehi, and across Utah from company career pages.",
    intro:
      "Browse summer 2027 internships in Utah, including Salt Lake City and the Silicon Slopes corridor, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "utah summer 2027 internships",
      "salt lake city summer 2027 internships",
      "Utah internships",
      "Salt Lake City internships",
      "student internships",
    ],
    locationMatchers: [
      "utah",
      ", ut",
      "salt lake city",
      "lehi",
      "draper",
      "provo",
      "orem",
    ],
  }),
  locationPage({
    slug: "san-francisco-summer-2027-internships",
    kind: "city",
    footerLabel: "San Francisco",
    title: "San Francisco Summer 2027 Internships",
    heading: "San Francisco Summer 2027 Internships",
    description:
      "Looking for a San Francisco summer 2027 internship? Browse SF internships from company career pages in tech, finance, and more.",
    intro:
      "Browse summer 2027 internships in San Francisco, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "san francisco summer 2027 internships",
      "sf summer 2027 internships",
      "summer 2027 internships san francisco",
      "San Francisco internships",
      "SF internships",
      "student internships",
    ],
    locationMatchers: ["san francisco"],
    extraRelatedLinks: [
      { href: "/california-summer-2027-internships", label: "California internships" },
    ],
  }),
  locationPage({
    slug: "los-angeles-summer-2027-internships",
    kind: "city",
    footerLabel: "Los Angeles",
    title: "Los Angeles Summer 2027 Internships",
    heading: "Los Angeles Summer 2027 Internships",
    description:
      "Looking for a Los Angeles summer 2027 internship? Browse LA internships in entertainment, tech, and more from company career pages.",
    intro:
      "Browse summer 2027 internships in Los Angeles and nearby areas, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "los angeles summer 2027 internships",
      "la summer 2027 internships",
      "summer 2027 internships los angeles",
      "Los Angeles internships",
      "LA internships",
      "student internships",
    ],
    locationMatchers: [
      "los angeles",
      "santa monica",
      "culver city",
      "pasadena",
      "el segundo",
      "beverly hills",
    ],
    extraRelatedLinks: [
      { href: "/california-summer-2027-internships", label: "California internships" },
    ],
  }),
  locationPage({
    slug: "seattle-summer-2027-internships",
    kind: "city",
    footerLabel: "Seattle",
    title: "Seattle Summer 2027 Internships",
    heading: "Seattle Summer 2027 Internships",
    description:
      "Looking for a Seattle summer 2027 internship? Browse internships from Amazon, Microsoft, startups, and more on company career pages.",
    intro:
      "Browse summer 2027 internships in Seattle and nearby tech hubs, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "seattle summer 2027 internships",
      "summer 2027 internships seattle",
      "Seattle internships",
      "student internships",
    ],
    locationMatchers: ["seattle", "bellevue", "redmond", "kirkland"],
    extraRelatedLinks: [
      { href: "/washington-summer-2027-internships", label: "Washington internships" },
    ],
  }),
  locationPage({
    slug: "austin-summer-2027-internships",
    kind: "city",
    footerLabel: "Austin",
    title: "Austin Summer 2027 Internships",
    heading: "Austin Summer 2027 Internships",
    description:
      "Looking for an Austin summer 2027 internship? Browse roles at Texas tech companies and startups from company career pages.",
    intro:
      "Browse summer 2027 internships in Austin, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "austin summer 2027 internships",
      "summer 2027 internships austin",
      "Austin internships",
      "student internships",
    ],
    locationMatchers: ["austin"],
    extraRelatedLinks: [
      { href: "/texas-summer-2027-internships", label: "Texas internships" },
    ],
  }),
  locationPage({
    slug: "boston-summer-2027-internships",
    kind: "city",
    footerLabel: "Boston",
    title: "Boston Summer 2027 Internships",
    heading: "Boston Summer 2027 Internships",
    description:
      "Looking for a Boston summer 2027 internship? Browse internships in biotech, finance, and tech from company career pages.",
    intro:
      "Browse summer 2027 internships in Boston and Cambridge, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "boston summer 2027 internships",
      "summer 2027 internships boston",
      "Boston internships",
      "student internships",
    ],
    locationMatchers: ["boston", "cambridge", "somerville"],
    extraRelatedLinks: [
      { href: "/massachusetts-summer-2027-internships", label: "Massachusetts internships" },
    ],
  }),
  locationPage({
    slug: "chicago-summer-2027-internships",
    kind: "city",
    footerLabel: "Chicago",
    title: "Chicago Summer 2027 Internships",
    heading: "Chicago Summer 2027 Internships",
    description:
      "Looking for a Chicago summer 2027 internship? Browse internships in finance, consulting, and tech from company career pages.",
    intro:
      "Browse summer 2027 internships in Chicago, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "chicago summer 2027 internships",
      "summer 2027 internships chicago",
      "Chicago internships",
      "student internships",
    ],
    locationMatchers: ["chicago", "evanston"],
    extraRelatedLinks: [
      { href: "/illinois-summer-2027-internships", label: "Illinois internships" },
    ],
  }),
  locationPage({
    slug: "atlanta-summer-2027-internships",
    kind: "city",
    footerLabel: "Atlanta",
    title: "Atlanta Summer 2027 Internships",
    heading: "Atlanta Summer 2027 Internships",
    description:
      "Looking for an Atlanta summer 2027 internship? Browse internships from Fortune 500 companies and startups on company career pages.",
    intro:
      "Browse summer 2027 internships in Atlanta, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "atlanta summer 2027 internships",
      "summer 2027 internships atlanta",
      "Atlanta internships",
      "student internships",
    ],
    locationMatchers: ["atlanta", "alpharetta", "sandy springs"],
    extraRelatedLinks: [
      { href: "/georgia-summer-2027-internships", label: "Georgia internships" },
    ],
  }),
  locationPage({
    slug: "dallas-summer-2027-internships",
    kind: "city",
    footerLabel: "Dallas",
    title: "Dallas Summer 2027 Internships",
    heading: "Dallas Summer 2027 Internships",
    description:
      "Looking for a Dallas summer 2027 internship? Browse internships in finance, tech, and energy from company career pages.",
    intro:
      "Browse summer 2027 internships in Dallas and Fort Worth, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "dallas summer 2027 internships",
      "summer 2027 internships dallas",
      "Dallas internships",
      "student internships",
    ],
    locationMatchers: ["dallas", "fort worth", "plano", "irving"],
    extraRelatedLinks: [
      { href: "/texas-summer-2027-internships", label: "Texas internships" },
    ],
  }),
  locationPage({
    slug: "houston-summer-2027-internships",
    kind: "city",
    footerLabel: "Houston",
    title: "Houston Summer 2027 Internships",
    heading: "Houston Summer 2027 Internships",
    description:
      "Looking for a Houston summer 2027 internship? Browse internships in energy, healthcare, and tech from company career pages.",
    intro:
      "Browse summer 2027 internships in Houston, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "houston summer 2027 internships",
      "summer 2027 internships houston",
      "Houston internships",
      "student internships",
    ],
    locationMatchers: ["houston"],
    extraRelatedLinks: [
      { href: "/texas-summer-2027-internships", label: "Texas internships" },
    ],
  }),
  locationPage({
    slug: "miami-summer-2027-internships",
    kind: "city",
    footerLabel: "Miami",
    title: "Miami Summer 2027 Internships",
    heading: "Miami Summer 2027 Internships",
    description:
      "Looking for a Miami summer 2027 internship? Browse internships in finance, hospitality, and tech from company career pages.",
    intro:
      "Browse summer 2027 internships in Miami and South Florida, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "miami summer 2027 internships",
      "summer 2027 internships miami",
      "Miami internships",
      "student internships",
    ],
    locationMatchers: ["miami", "fort lauderdale"],
    extraRelatedLinks: [
      { href: "/florida-summer-2027-internships", label: "Florida internships" },
    ],
  }),
  locationPage({
    slug: "washington-dc-summer-2027-internships",
    kind: "city",
    footerLabel: "Washington DC",
    title: "Washington DC Summer 2027 Internships",
    heading: "Washington DC Summer 2027 Internships",
    description:
      "Looking for a Washington DC summer 2027 internship? Browse internships in government, policy, and tech from company career pages.",
    intro:
      "Browse summer 2027 internships in Washington DC and the surrounding metro, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "washington dc summer 2027 internships",
      "dc summer 2027 internships",
      "summer 2027 internships washington dc",
      "Washington DC internships",
      "DC internships",
      "student internships",
    ],
    locationMatchers: [
      "washington, dc",
      "washington dc",
      "washington, d.c.",
      "district of columbia",
      ", dc",
    ],
    extraRelatedLinks: [
      { href: "/virginia-summer-2027-internships", label: "Virginia internships" },
      { href: "/maryland-summer-2027-internships", label: "Maryland internships" },
    ],
  }),
  locationPage({
    slug: "san-diego-summer-2027-internships",
    kind: "city",
    footerLabel: "San Diego",
    title: "San Diego Summer 2027 Internships",
    heading: "San Diego Summer 2027 Internships",
    description:
      "Looking for a San Diego summer 2027 internship? Browse internships in biotech, defense, and tech from company career pages.",
    intro:
      "Browse summer 2027 internships in San Diego, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "san diego summer 2027 internships",
      "summer 2027 internships san diego",
      "San Diego internships",
      "student internships",
    ],
    locationMatchers: ["san diego"],
    extraRelatedLinks: [
      { href: "/california-summer-2027-internships", label: "California internships" },
    ],
  }),
  locationPage({
    slug: "denver-summer-2027-internships",
    kind: "city",
    footerLabel: "Denver",
    title: "Denver Summer 2027 Internships",
    heading: "Denver Summer 2027 Internships",
    description:
      "Looking for a Denver summer 2027 internship? Browse internships in tech, finance, and energy from company career pages.",
    intro:
      "Browse summer 2027 internships in Denver and Boulder, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "denver summer 2027 internships",
      "summer 2027 internships denver",
      "Denver internships",
      "student internships",
    ],
    locationMatchers: ["denver", "boulder", "aurora"],
    extraRelatedLinks: [
      { href: "/colorado-summer-2027-internships", label: "Colorado internships" },
    ],
  }),
  locationPage({
    slug: "philadelphia-summer-2027-internships",
    kind: "city",
    footerLabel: "Philadelphia",
    title: "Philadelphia Summer 2027 Internships",
    heading: "Philadelphia Summer 2027 Internships",
    description:
      "Looking for a Philadelphia summer 2027 internship? Browse internships in healthcare, finance, and tech from company career pages.",
    intro:
      "Browse summer 2027 internships in Philadelphia, synced from company career pages. Apply directly and track every application in SuperInterns.",
    keywords: [
      "philadelphia summer 2027 internships",
      "summer 2027 internships philadelphia",
      "Philadelphia internships",
      "student internships",
    ],
    locationMatchers: ["philadelphia", "malvern", "conshohocken"],
    extraRelatedLinks: [
      { href: "/pennsylvania-summer-2027-internships", label: "Pennsylvania internships" },
    ],
  }),
];

export const INTERNSHIP_STATE_LOCATION_PAGES = INTERNSHIP_LOCATION_PAGES.filter(
  (page) => page.kind === "state"
);

export const INTERNSHIP_CITY_LOCATION_PAGES = INTERNSHIP_LOCATION_PAGES.filter(
  (page) => page.kind === "city"
);

export const INTERNSHIP_LOCATION_INDEX_PATH = "/internships-by-state";

const FOOTER_FEATURED_STATE_SLUGS = [
  "new-york-summer-2027-internships",
  "california-summer-2027-internships",
  "texas-summer-2027-internships",
  "illinois-summer-2027-internships",
  "florida-summer-2027-internships",
] as const;

export function getFooterFeaturedStatePages(): InternshipLocationPage[] {
  return FOOTER_FEATURED_STATE_SLUGS.flatMap((slug) => {
    const page = getInternshipLocationPage(slug);
    return page ? [page] : [];
  });
}

export function getInternshipLocationPage(slug: string): InternshipLocationPage | undefined {
  return INTERNSHIP_LOCATION_PAGES.find((page) => page.slug === slug);
}

export function matchesInternshipLocation(
  locationRaw: string,
  matchers: string[]
): boolean {
  const loc = locationRaw.toLowerCase();
  return matchers.some((matcher) => loc.includes(matcher.toLowerCase()));
}
