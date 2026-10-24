import { MysteryCase, Achievement } from '../types/mystery';

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_clue',
    title: 'Keen Eye',
    description: 'Discovered your first physical clue at a crime scene.',
    icon: 'Search',
    xpValue: 100,
    criteria: 'Discover 1 clue'
  },
  {
    id: 'first_contradiction',
    title: 'Truth Unmasked',
    description: 'Caught a suspect in a verified factual lie.',
    icon: 'AlertTriangle',
    xpValue: 250,
    criteria: 'Detect 1 contradiction'
  },
  {
    id: 'evidence_weaver',
    title: 'Evidence Weaver',
    description: 'Connected 5 clues on the interactive pinboard.',
    icon: 'GitFork',
    xpValue: 200,
    criteria: 'Create 5 evidence links'
  },
  {
    id: 'timeline_architect',
    title: 'Timeline Architect',
    description: 'Successfully reconstructed the exact chronological sequence of events.',
    icon: 'Clock',
    xpValue: 300,
    criteria: 'Align timeline correctly'
  },
  {
    id: 'iron_deduction',
    title: 'Pure Intuition',
    description: 'Solved a complex case without using any hints.',
    icon: 'Zap',
    xpValue: 500,
    criteria: 'Finish case with 0 hints used'
  },
  {
    id: 'first_case_solved',
    title: 'Case Closed',
    description: 'Delivered a verified accusation and brought the culprit to justice.',
    icon: 'Award',
    xpValue: 600,
    criteria: 'Score 75+ on a case'
  },
  {
    id: 'master_detective',
    title: 'Master Detective',
    description: 'Achieved a perfect 90+ investigation score with flawless methodology.',
    icon: 'ShieldCheck',
    xpValue: 1000,
    criteria: 'Score 90+ on any investigation'
  }
];

export const INITIAL_CASES: MysteryCase[] = [
  {
    id: 'the-midnight-diamond',
    title: 'The Midnight Diamond',
    tagline: 'A 45-carat sapphire-blue jewel vanishes in a locked Scottish manor during the gala.',
    crimeCategory: 'Grand Theft',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    location: 'Harrington Manor, Scottish Highlands',
    setting: 'Gilded age manor surrounded by torrential coastal rain during the 50th Harrington Jubilee.',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    description: 'At 10:45 PM, Lord Alistair Harrington discovered the reinforced biometric vault in his private study pried ajar. The heirloom "Blue Sovereign Diamond" was replaced with a synthetic glass facsimile. Four guests and staff possessed access or opportunity.',
    incidentTime: 'Between 10:15 PM and 10:45 PM',
    victim: {
      name: 'Lord Alistair Harrington',
      description: 'Wealthy aristocrat and collector of rare colonial gems, hosting 80 high-society guests.'
    },
    isOfficial: true,
    authorName: 'MysteryOS Archives',
    createdAt: '2026-10-01T00:00:00Z',
    locations: [
      {
        id: 'loc_study',
        caseId: 'the-midnight-diamond',
        name: "Lord Harrington's Study",
        description: 'Heavy mahogany desk, oil portraits, rain battering diamond-paned windows, and the wall vault.',
        roomType: 'crime_scene',
        ambientImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
        objects: [
          {
            id: 'obj_vault',
            name: 'Reinforced Wall Vault',
            xPercent: 78,
            yPercent: 38,
            revealsClueId: 'clue_synthetic_gem',
            inspectMessage: 'The heavy steel door stands ajar. Inside lies a velvet pedestal holding an uncanny fake gem. Grease marks on the internal hinges silenced the alarm mechanism.',
            inspectActionLabel: 'Inspect Safe Interior'
          },
          {
            id: 'obj_study_desk',
            name: 'Mahogany Writing Desk',
            xPercent: 44,
            yPercent: 62,
            revealsClueId: 'clue_security_ledger',
            inspectMessage: 'A leather-bound registry records digital card swipes for the study door. Page corner turned over.',
            inspectActionLabel: 'Examine Door Logbook'
          },
          {
            id: 'obj_fireplace',
            name: 'Stone Hearth Fireplace',
            xPercent: 18,
            yPercent: 54,
            revealsClueId: 'clue_burned_telegram',
            inspectMessage: 'Among glowing embers sits a half-charred telegram paper. Someone hastily attempted to incinerate it.',
            inspectActionLabel: 'Retrieve Charred Paper'
          },
          {
            id: 'obj_carpet_corner',
            name: 'Persian Rug Near Vault',
            xPercent: 72,
            yPercent: 76,
            revealsClueId: 'clue_dropped_cufflink',
            inspectMessage: 'Gleaming near the wainscoting is an engraved gold cufflink bearing the initials "J.C."',
            inspectActionLabel: 'Collect Golden Object'
          }
        ]
      },
      {
        id: 'loc_ballroom',
        caseId: 'the-midnight-diamond',
        name: 'The Grand Ballroom',
        description: 'Crystal chandeliers, chamber orchestra, champagne flutes, and swirling masquerade dresses.',
        roomType: 'common_area',
        ambientImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80',
        objects: [
          {
            id: 'obj_champagne_table',
            name: 'Buffet & Drink Station',
            xPercent: 28,
            yPercent: 70,
            revealsClueId: 'clue_broken_glass',
            inspectMessage: 'A vintage champagne glass knocked against a silver platter at exactly 10:20 PM, causing a commotion that drew the guards away.',
            inspectActionLabel: 'Examine Spill & Timestamp'
          },
          {
            id: 'obj_orchestra_podium',
            name: 'Orchestra Master Podium',
            xPercent: 82,
            yPercent: 42,
            inspectMessage: 'The maestro confirms: "A striking woman in dark emerald satin stepped out into the north gallery corridor right as the waltz crescendo hit around 10:18 PM."',
            inspectActionLabel: 'Ask Bandleader'
          }
        ]
      },
      {
        id: 'loc_conservatory',
        caseId: 'the-midnight-diamond',
        name: 'East Glass Conservatory',
        description: 'Exotic orchids and ferns under steamy glass. A side door leads out to the drenched rose garden.',
        roomType: 'restricted',
        ambientImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1600&q=80',
        objects: [
          {
            id: 'obj_side_french_door',
            name: 'L-Shaped French Doors',
            xPercent: 88,
            yPercent: 55,
            revealsClueId: 'clue_garden_mud_footprints',
            inspectMessage: 'The latch was taped with clear electrical tape from the inside to prevent automatic deadbolting.',
            inspectActionLabel: 'Inspect Door Latch'
          },
          {
            id: 'obj_flower_pot',
            name: 'Large Terracotta Palm Pot',
            xPercent: 32,
            yPercent: 68,
            revealsClueId: 'clue_emerald_silk_glove',
            requiresClueId: 'clue_broken_glass',
            lockedMessage: 'You need a specific lead before digging through the exotic soil.',
            inspectMessage: 'Tucked beneath wet fern moss is a single tailored emerald silk evening glove smeared with vault grease and microscopic diamond dust.',
            inspectActionLabel: 'Search Hidden Soil'
          }
        ]
      },
      {
        id: 'loc_butler_pantry',
        caseId: 'the-midnight-diamond',
        name: "Butler's Pantry & Service Quarters",
        description: 'Polished silver shelves, key cabinets, and house intercom switches.',
        roomType: 'suspect_room',
        ambientImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80',
        objects: [
          {
            id: 'obj_key_board',
            name: 'Brass Master Key Cabinet',
            xPercent: 50,
            yPercent: 35,
            revealsClueId: 'clue_master_key_log',
            inspectMessage: 'The master skeleton key to the north corridor was checked out at 6:00 PM by Butler Gray, but returned to its hook by 11:00 PM.',
            inspectActionLabel: 'Review Key Slots'
          }
        ]
      }
    ],
    clues: [
      {
        id: 'clue_synthetic_gem',
        caseId: 'the-midnight-diamond',
        name: 'Synthetic Cubic Zirconia Replica',
        description: 'A precision-cut replica of the Blue Sovereign Diamond left in place of the real 45-carat jewel. Only a trained gemologist could produce such exact refractive faceting.',
        evidenceType: 'physical',
        locationId: 'loc_study',
        locationName: "Lord Harrington's Study",
        reliability: 'verified_fact',
        significance: 'crucial',
        tags: ['vault', 'gemology', 'replica', 'method'],
        imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT A-1: Refractive facet test confirms artificial synthetic crystal. Micro-laser score lines visible along rim.',
        details: 'Lab tests show high-grade laser cutting calibrated for Harrington jewelry measurements. Traces of jeweler loupe grease around the bezel.'
      },
      {
        id: 'clue_security_ledger',
        caseId: 'the-midnight-diamond',
        name: 'Electronic Study Access Card Log',
        description: 'Digital electronic swipe card log stamped: 09:15 PM (Lord Harrington), 10:22 PM (Guest Badge #04 - Appraiser Pass), 10:46 PM (Lord Harrington).',
        evidenceType: 'digital',
        locationId: 'loc_study',
        locationName: "Lord Harrington's Study",
        reliability: 'verified_fact',
        significance: 'crucial',
        tags: ['timestamps', 'alibi_break', 'access_card'],
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT B-4: Encrypted RFID electronic strike log. Hex timestamp 22:22:18 corresponds to Appraiser Guest Badge #04.',
        details: 'Guest Badge #04 was officially assigned to Evelyn Vance for evaluating the estate jewels prior to exhibition.'
      },
      {
        id: 'clue_burned_telegram',
        caseId: 'the-midnight-diamond',
        name: 'Half-Burned Zurich Cablegram',
        description: 'Recovered from study fireplace: "...VANCE ANTIQUITIES FORECLOSURE IMMINENT... BUYER IN ZURICH WAITING 2.4M CHF CONTINGENT ON BLUE SOVEREIGN DELIVERY BY OCT 26..."',
        evidenceType: 'document',
        locationId: 'loc_study',
        locationName: "Lord Harrington's Study",
        reliability: 'verified_fact',
        significance: 'crucial',
        tags: ['motive', 'financial', 'vance', 'switzerland'],
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT C-2: Forensic ash reconstruction. Telegram dispatch originating from Zurich Syndicate black-market escrow.',
        details: 'Proves Evelyn Vance faces bankruptcy in London and had already secured a private black-market buyer for this specific stone.'
      },
      {
        id: 'clue_dropped_cufflink',
        caseId: 'the-midnight-diamond',
        name: 'Engraved "J.C." Gold Cufflink',
        description: 'Julian Croft\'s expensive gold cufflink found directly beneath the wall safe.',
        evidenceType: 'physical',
        locationId: 'loc_study',
        locationName: "Lord Harrington's Study",
        reliability: 'unverified_claim',
        significance: 'red_herring',
        tags: ['framing', 'julian_croft', 'cufflink'],
        imageUrl: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT D-1: Solid 18K engraved cufflink. No vault lubricant residue present; consistent with deliberate planting.',
        details: 'Julian Croft claims he lost his cufflink in the dining salon at 8:00 PM during the toast. Micro-fiber analysis shows no matching dust from the vault.'
      },
      {
        id: 'clue_broken_glass',
        caseId: 'the-midnight-diamond',
        name: 'Ballroom Distraction Timestamp',
        description: 'At 10:20 PM, a champagne pyramid crashed near the orchestra, pulling the two security guards away from the north corridor for 8 critical minutes.',
        evidenceType: 'timeline',
        locationId: 'loc_ballroom',
        locationName: 'The Grand Ballroom',
        reliability: 'verified_fact',
        significance: 'supporting',
        tags: ['distraction', 'timing', 'guards'],
        imageUrl: 'https://images.unsplash.com/photo-1572945281869-702e5db4f4e2?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT E-3: Shattered crystal stemware. Acoustic diversion timing accurately synchronized with corridor breach.',
        details: 'The crash occurred 2 minutes prior to Badge #04 swiping into the study.'
      },
      {
        id: 'clue_emerald_silk_glove',
        caseId: 'the-midnight-diamond',
        name: 'Grease-Stained Emerald Silk Glove',
        description: 'Found hidden under conservatory soil. It matches Evelyn Vance\'s couture gala dress and is coated with synthetic lubricant matching the silent vault hinges.',
        evidenceType: 'physical',
        locationId: 'loc_conservatory',
        locationName: 'East Glass Conservatory',
        reliability: 'verified_fact',
        significance: 'crucial',
        tags: ['forensics', 'evelyn', 'vault_grease', 'smoking_gun'],
        imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT F-7: Soil-embedded couture silk glove. Saturated with high-grade lithium safe grease and micro-diamond dust.',
        details: 'The right-hand glove had its tip trimmed to manipulate fine dial combinations and handle glass cutters.'
      },
      {
        id: 'clue_garden_mud_footprints',
        caseId: 'the-midnight-diamond',
        name: 'Womens Evening Stiletto Tread in Mud',
        description: 'Size 6 high-heeled shoe prints leading from the study side-exit to the conservatory flowerbed and back to the ballroom patio.',
        evidenceType: 'environmental',
        locationId: 'loc_conservatory',
        locationName: 'East Glass Conservatory',
        reliability: 'verified_fact',
        significance: 'supporting',
        tags: ['footprints', 'escape_route'],
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT G-2: Forensic plaster cast. 3.5-inch stiletto heel impression depth indicates hurried exit into conservatory.',
        details: 'Matches high heels worn by female guests; distinctly rules out Lucas Gray (size 11 boots) and Julian Croft (size 10 oxfords).'
      },
      {
        id: 'clue_master_key_log',
        caseId: 'the-midnight-diamond',
        name: "Butler's Key Accountability Record",
        description: 'Lucas Gray kept rigorous track of servant keys. The north corridor lock had scratches showing it was opened with an authorized guest card rather than the butler skeleton key.',
        evidenceType: 'document',
        locationId: 'loc_butler_pantry',
        locationName: "Butler's Pantry & Service Quarters",
        reliability: 'verified_fact',
        significance: 'supporting',
        tags: ['alibi', 'butler', 'clearance'],
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT H-5: Butler registry book and key brass ring. Verified unblemished seals; lock bypassed electronically.',
        details: 'Lucas Gray was serving champagne toasts continuously between 10:15 and 10:35 PM in the ballroom in front of 40 witnesses.'
      }
    ],
    suspects: [
      {
        id: 'suspect_evelyn_vance',
        caseId: 'the-midnight-diamond',
        name: 'Evelyn Vance',
        role: 'Master Gemologist & Appraiser',
        age: 38,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Elegantly composed London jewelry consultant hired by Lord Harrington to verify the Blue Sovereign before its museum handover.',
        personality: 'Cool, razor-sharp intellect, calculating under pressure, pretends aristocratic nonchalance.',
        temperament: 'composed',
        possibleMotive: 'Facing catastrophic financial ruin; private Zurich syndicate offered 2.4 million Swiss Francs.',
        alibi: 'Claims she was peacefully seated in the library with Lord Harrington’s rare folios between 10:00 PM and 10:40 PM, never entering the study.',
        initialStatement: '“I spent the entire hour between ten and quarter to eleven alone in the west library reviewing Lord Harrington’s historical monographs. I adore gemstones, Inspector, but I would never sully my professional reputation.”',
        relationships: [
          { characterName: 'Lord Alistair Harrington', relationship: 'Client who commissioned her appraisal' },
          { characterName: 'Julian Croft', relationship: 'Social acquaintance who flirted with her at dinner' }
        ],
        knownFacts: [
          'She had access to the jewel 3 days prior for optical scanning.',
          'She knows the exact density, facets, and refractive index of the real stone.',
          'She wore an emerald silk couture dress with matching opera gloves.'
        ],
        hiddenFacts: [
          'Her antique dealership in Mayfair is bankrupt with debts totaling £400,000.',
          'She personally manufactured the cubic zirconia substitute in her laboratory two weeks ago.',
          'She stole Julian Croft\'s cufflink during dinner to stage as an incriminating clue.',
          'She swiped her Badge #04 into the study at 10:22 PM during the champagne distraction.'
        ],
        authorizedDisclosures: [
          'Admits the fake stone is extraordinarily well crafted: "Whoever made this understood high-pressure gem synthesis."',
          'Admits she noticed Julian Croft having a heated argument about money earlier.'
        ],
        contradictionTriggers: [
          {
            keywordOrClue: 'clue_security_ledger',
            revealedStatement: '“That card swipe at 10:22 PM must be a malfunction! Or someone must have snatched my evening reticule while I went to powder my nose!”'
          },
          {
            keywordOrClue: 'clue_emerald_silk_glove',
            revealedStatement: '“I... I dropped that glove earlier in the garden! Anyone could have found it and wiped grease on it to frame me!”'
          }
        ]
      },
      {
        id: 'suspect_julian_croft',
        caseId: 'the-midnight-diamond',
        name: 'Julian Croft',
        role: 'Nephew & Antiques Speculator',
        age: 31,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Lord Harrington’s charismatic but profligate nephew. Owe huge gambling debts to London bookmakers.',
        personality: 'Charming, defensive, quick-tempered when pressed on debts.',
        temperament: 'defensive',
        possibleMotive: 'Disinherited from the family trust; desperately needed cash to pay off dangerous loan sharks.',
        alibi: 'Claims he was outside on the terrace smoking Turkish cigarettes between 10:15 PM and 10:35 PM.',
        initialStatement: '“Look, Uncle Alistair and I have had our spats, sure. But I was freezing my ears off on the terrace smoking all through that ghastly waltz. Ask anyone who saw my cigarette glow!”',
        relationships: [
          { characterName: 'Lord Harrington', relationship: 'Uncle who cut his allowance' },
          { characterName: 'Victoria Harrington', relationship: 'Cousin whom he resents' }
        ],
        knownFacts: [
          'He arrived without his usual luxury watch, which he pawned last month.',
          'He knows his way around the manor grounds intimately.'
        ],
        hiddenFacts: [
          'His cufflink went missing around 8:30 PM when Evelyn Vance sat beside him.',
          'He was indeed on the terrace smoking, where he saw a shadowy figure slip into the conservatory.'
        ],
        authorizedDisclosures: [
          'Confirms he lost his cufflink early: "I noticed my sleeve cuff flapping right after the soup course!"'
        ]
      },
      {
        id: 'suspect_lucas_gray',
        caseId: 'the-midnight-diamond',
        name: 'Lucas Gray',
        role: 'Head Butler of Harrington Manor',
        age: 59,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bio: 'Dignified steward of Harrington Manor for 32 years. Knows every secret passage and locked pantry.',
        personality: 'Impeccable decorum, stoic, fiercely protective of the estate dignity.',
        temperament: 'composed',
        possibleMotive: 'Discovered Lord Harrington planned to sell the estate and dismiss all long-term staff.',
        alibi: 'Supervising the ballroom service and pouring champagne continuously from 10:00 to 11:00 PM.',
        initialStatement: '“I have dedicated thirty-two years of honorable service to the Harrington family, Inspector. At twenty past ten, I was attending to guests near the orchestra when the crystal glasses fell.”',
        relationships: [
          { characterName: 'Lord Harrington', relationship: 'Employer of three decades' }
        ],
        knownFacts: [
          'Has keys to every mechanical door except the personal electronic study vault.',
          'Knows the combination to the study door lock, but not the biometric code.'
        ],
        hiddenFacts: [
          'He noticed Evelyn Vance slipping grease canisters out of her evening bag into her cloak earlier in the afternoon.'
        ],
        authorizedDisclosures: [
          'Confirms he observed Evelyn Vance leaving the ballroom right before the champagne pyramid tumbled.'
        ]
      },
      {
        id: 'suspect_victoria_harrington',
        caseId: 'the-midnight-diamond',
        name: 'Victoria Harrington',
        role: 'Heiress & Environmental Activist',
        age: 26,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        bio: 'Lord Harrington’s idealistic daughter. Vowed to prevent colonial blood diamonds from being flaunted.',
        personality: 'Passionate, defiant, intellectually honest, deeply dislikes her father’s materialism.',
        temperament: 'nervous',
        possibleMotive: 'Wanted to steal the diamond and donate it to repatriation charities or lock it away.',
        alibi: 'Arguing with guests in the drawing room about carbon taxes from 10:10 PM until 10:50 PM.',
        initialStatement: '“That stone represents centuries of imperial looting. I wish it were gone, frankly! But I spent that entire waltz debating three fossil-fuel investors in the drawing room.”',
        relationships: [
          { characterName: 'Lord Harrington', relationship: 'Father whose lifestyle she opposes' }
        ],
        knownFacts: [
          'Has no mechanical or gemological training to produce synthetic replicas.',
          'Never entered the study corridor that evening.'
        ],
        hiddenFacts: [
          'Saw Evelyn Vance pacing outside the study door at 9:00 PM examining the digital lock.'
        ],
        authorizedDisclosures: [
          'Can corroborate that Julian Croft was indeed outside shivering on the terrace when she looked through the glass.'
        ]
      }
    ],
    timelineEvents: [
      {
        id: 'evt_0930',
        caseId: 'the-midnight-diamond',
        timeString: '09:30 PM',
        sortTimestamp: 2130,
        title: 'Lord Harrington Vault Verification',
        description: 'Lord Harrington opens the wall safe to show the authentic Blue Sovereign to Evelyn Vance for initial display setup.',
        source: 'physical_record',
        involvedSuspects: ['suspect_evelyn_vance'],
        location: "Lord Harrington's Study",
        isVerified: true
      },
      {
        id: 'evt_1015',
        caseId: 'the-midnight-diamond',
        timeString: '10:15 PM',
        sortTimestamp: 2215,
        title: 'Julian Croft Steps to Smoke on Terrace',
        description: 'Julian Croft excuses himself to the smoking terrace; claims he stayed there until 10:35 PM.',
        source: 'suspect_claim',
        involvedSuspects: ['suspect_julian_croft'],
        location: 'Smoking Terrace',
        isVerified: true
      },
      {
        id: 'evt_1020',
        caseId: 'the-midnight-diamond',
        timeString: '10:20 PM',
        sortTimestamp: 2220,
        title: 'Ballroom Champagne Glass Crash',
        description: 'A sudden crash of champagne glasses creates chaos in the ballroom, drawing both corridor guards away.',
        source: 'witness',
        involvedSuspects: ['suspect_lucas_gray'],
        location: 'The Grand Ballroom',
        isVerified: true
      },
      {
        id: 'evt_1022',
        caseId: 'the-midnight-diamond',
        timeString: '10:22 PM',
        sortTimestamp: 2222,
        title: 'Badge #04 Swiped at Study Door',
        description: 'Study digital electronic swipe records Evelyn Vance\'s Appraiser Badge #04 opening the study lock.',
        source: 'physical_record',
        involvedSuspects: ['suspect_evelyn_vance'],
        location: "Lord Harrington's Study",
        isVerified: true,
        conflictingEventId: 'evt_vance_alibi_claim',
        conflictReason: 'Directly contradicts Evelyn Vance\'s claim of being in the library until 10:45 PM.'
      },
      {
        id: 'evt_1045',
        caseId: 'the-midnight-diamond',
        timeString: '10:45 PM',
        sortTimestamp: 2245,
        title: 'Theft Discovered by Lord Harrington',
        description: 'Lord Harrington returns to the study, finds the wall safe cracked and the counterfeit stone sitting in place.',
        source: 'surveillance',
        involvedSuspects: [],
        location: "Lord Harrington's Study",
        isVerified: true
      }
    ],
    contradictions: [
      {
        id: 'contra_vance_alibi',
        caseId: 'the-midnight-diamond',
        title: 'Evelyn Vance Study Presence vs Library Alibi',
        suspectId: 'suspect_evelyn_vance',
        suspectName: 'Evelyn Vance',
        claimedStatement: '“I spent the entire hour between ten and quarter to eleven alone in the west library, never entering the study.”',
        contradictingClueId: 'clue_security_ledger',
        contradictingClueName: 'Electronic Study Access Card Log',
        explanation: 'Evelyn claimed she was isolated in the library from 10:00 to 10:45 PM, but the digital lock recorded her registered Appraiser Badge #04 swiping into the study at 10:22 PM.',
        suggestedFollowUp: 'Confront Evelyn Vance with the exact electronic swipe timestamp.',
        isConfirmed: true
      },
      {
        id: 'contra_vance_motive',
        caseId: 'the-midnight-diamond',
        title: 'Disinterested Professional vs Secret Zurich Syndicate Sale',
        suspectId: 'suspect_evelyn_vance',
        suspectName: 'Evelyn Vance',
        claimedStatement: '“I would never sully my professional reputation. I have no financial interest in Lord Harrington’s heirlooms.”',
        contradictingClueId: 'clue_burned_telegram',
        contradictingClueName: 'Half-Burned Zurich Cablegram',
        explanation: 'The scorched cablegram recovered from the hearth exposes that her gallery was bankrupt and she had already agreed to sell the Blue Sovereign for 2.4M CHF.',
        suggestedFollowUp: 'Demand she explain her urgent debts in Zurich.',
        isConfirmed: true
      },
      {
        id: 'contra_cufflink_framing',
        caseId: 'the-midnight-diamond',
        title: 'Julian Croft’s Cufflink vs Stiletto Footprints',
        suspectId: 'suspect_julian_croft',
        suspectName: 'Julian Croft',
        claimedStatement: '“I wasn\'t near that vault; I lost that cufflink at dinner!”',
        contradictingClueId: 'clue_garden_mud_footprints',
        contradictingClueName: 'Womens Evening Stiletto Tread in Mud',
        explanation: 'While Julian’s cufflink was found by the safe, the physical escape trail has size 6 stiletto treads. Julian wears size 10 oxfords, proving the cufflink was deliberately planted.',
        suggestedFollowUp: 'Identify who had access to Julian during dinner to lift his cufflink.',
        isConfirmed: true
      }
    ],
    hints: [
      {
        tier: 1,
        penaltyPoints: 2,
        title: 'Initial Lead: Access & Alibis',
        content: 'Check the digital door records in the Study desk. Compare the timestamps of who entered the room with where each suspect claimed to be during the waltz.',
        focusArea: 'general_direction'
      },
      {
        tier: 2,
        penaltyPoints: 5,
        title: 'Key Location: The East Conservatory',
        content: 'The culprit fled through the side garden into the East Conservatory. Look closely at the flowerbeds for physical evidence discarded during the escape.',
        focusArea: 'room_or_character'
      },
      {
        tier: 3,
        penaltyPoints: 10,
        title: 'Crucial Connection: The Gem & The Grease',
        content: 'Only a trained gemologist could craft the synthetic cubic zirconia replica. The grease on the vault hinges matches the tailored emerald silk glove buried in the conservatory soil.',
        focusArea: 'key_connection'
      }
    ],
    verifiedSolution: {
      culpritId: 'suspect_evelyn_vance',
      culpritName: 'Evelyn Vance',
      motive: 'Bankruptcy and urgent foreclosure of her London gallery; pre-arranged a 2.4M CHF sale to a private buyer in Zurich.',
      method: 'Created a synthetic cubic zirconia replica in advance, swiped her appraiser card at 10:22 PM during the champagne commotion, silenced vault hinges with grease, swapped the diamond, planted Julian Croft’s cufflink, and hid her stained glove in the conservatory.',
      requiredClueIds: [
        'clue_synthetic_gem',
        'clue_security_ledger',
        'clue_burned_telegram',
        'clue_emerald_silk_glove'
      ],
      keyContradictionIds: ['contra_vance_alibi', 'contra_vance_motive'],
      timelineVerificationOrder: ['evt_0930', 'evt_1015', 'evt_1020', 'evt_1022', 'evt_1045'],
      solutionNarrative: 'Evelyn Vance used her trusted position as Lord Harrington\'s accredited appraiser to prepare the heist weeks in advance. Facing total ruin from London creditors, she fabricated a chemically identical cubic zirconia substitute. During the gala waltz, when a champagne crash distracted guards at 10:20 PM, she swiped into the study with Appraiser Badge #04. She greased the safe hinges to silence the alarm bell, swapped the gems, and planted Julian Croft\'s gold cufflink to frame him. Rushing back through the gardens, she concealed her stained silk glove in the conservatory before re-entering the party with an innocent smile.',
      commonFalseTheories: [
        {
          suspectId: 'suspect_julian_croft',
          reasonWhyIncorrect: 'Julian was framed; his cufflink was stolen at dinner, and he could not fit into the size 6 stiletto tracks left by the vault intruder.'
        },
        {
          suspectId: 'suspect_lucas_gray',
          reasonWhyIncorrect: 'Lucas Gray had 40 ballroom witnesses confirming he served champagne during the exact minute the study card was swiped.'
        }
      ]
    }
  },
  {
    id: 'the-silent-alibi',
    title: 'The Silent Alibi',
    tagline: 'A biotech pioneer poisoned by his automated coffee dispenser at midnight in a smart high-rise.',
    crimeCategory: 'Homicide',
    difficulty: 'Expert',
    estimatedMinutes: 30,
    location: 'CyberPeak Executive Tower, Neo-London',
    setting: 'A 60th-floor biometric corporate penthouse with automated IoT dispensers and encrypted terminals.',
    coverImage: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=80',
    description: 'Tech CEO Marcus Vance collapsed from lethal aconitine poisoning while working alone in his locked smart-office. The smart espresso maker delivered the toxin at 11:42 PM, yet all suspect keycards registered elsewhere.',
    incidentTime: '11:42 PM',
    victim: {
      name: 'Marcus Vance',
      description: 'Founder of NeuralCore Biotech, notoriously ruthless with patents.'
    },
    isOfficial: true,
    authorName: 'MysteryOS Archives',
    createdAt: '2026-10-05T00:00:00Z',
    locations: [
      {
        id: 'loc_exec_office',
        caseId: 'the-silent-alibi',
        name: 'Executive Corner Suite',
        description: 'Panoramic glass overlooking rainy city lights, executive desk, and smart coffee bar.',
        roomType: 'crime_scene',
        ambientImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
        objects: [
          {
            id: 'obj_smart_brewer',
            name: 'IoT Espresso Station',
            xPercent: 72,
            yPercent: 48,
            revealsClueId: 'clue_poisoned_capsule',
            inspectMessage: 'The automated dispenser shows a remote API call executed at 11:40 PM from inside the local subnet, dispensing a custom water-soluble capsule.',
            inspectActionLabel: 'Inspect Firmware Log'
          },
          {
            id: 'obj_workstation',
            name: 'Marcus Vance Terminal',
            xPercent: 40,
            yPercent: 58,
            revealsClueId: 'clue_altered_patent',
            inspectMessage: 'An opened legal notice showing that Dr. Aris Thorne was about to be terminated and his patent rights revoked.',
            inspectActionLabel: 'Read Screen Document'
          }
        ]
      },
      {
        id: 'loc_server_room',
        caseId: 'the-silent-alibi',
        name: 'Core Server Sub-Vault',
        description: 'Humming server racks with cool neon blue LED indicators.',
        roomType: 'restricted',
        ambientImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
        objects: [
          {
            id: 'obj_cron_server',
            name: 'Network Switch Rack 04',
            xPercent: 55,
            yPercent: 62,
            revealsClueId: 'clue_cron_script',
            inspectMessage: 'A scheduled background bash daemon was loaded at 8:00 PM to transmit the brewer trigger command at 11:40 PM while faking a continuous ping from the gym lobby.',
            inspectActionLabel: 'Extract Server Script'
          }
        ]
      }
    ],
    clues: [
      {
        id: 'clue_poisoned_capsule',
        caseId: 'the-silent-alibi',
        name: 'Aconitine Residue in Reservoir #3',
        description: 'Lethal aconitine extract injected through a micro-needle puncture into the sealed coffee capsule reservoir.',
        evidenceType: 'physical',
        locationId: 'loc_exec_office',
        locationName: 'Executive Corner Suite',
        reliability: 'verified_fact',
        significance: 'crucial',
        tags: ['poison', 'chemistry', 'method'],
        imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT AC-01: Lethal monkshood aconitine neurotoxin detected via gas chromatography. Needle perforation in seal.',
        details: 'Requires laboratory grade micro-pipettes only stocked in the 5th floor pharmaceutical lab.'
      },
      {
        id: 'clue_altered_patent',
        caseId: 'the-silent-alibi',
        name: 'Draft Patent Revocation Notice',
        description: 'Document stripping Dr. Aris Thorne of his 40% equity in NeuralCore effective midnight.',
        evidenceType: 'document',
        locationId: 'loc_exec_office',
        locationName: 'Executive Corner Suite',
        reliability: 'verified_fact',
        significance: 'crucial',
        tags: ['motive', 'financial', 'thorne'],
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT LG-08: Revocation contract signed by victim Marcus Vance. Termination scheduled for 23:59:59.',
        details: 'Gives Dr. Thorne an urgent life-or-death deadline to prevent the filing.'
      },
      {
        id: 'clue_cron_script',
        caseId: 'the-silent-alibi',
        name: 'Automated IoT Trigger Script',
        description: 'Python daemon configured on Switch 04 to trigger the coffee dispenser via REST API at 11:40 PM.',
        evidenceType: 'digital',
        locationId: 'loc_server_room',
        locationName: 'Core Server Sub-Vault',
        reliability: 'verified_fact',
        significance: 'crucial',
        tags: ['digital', 'script', 'alibi_break'],
        imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT CR-99: Network packet dump. Remote IoT curl request executed from server rack switch via PGP authorization.',
        details: 'Script author git commit signed with PGP key belonging to Dr. Aris Thorne.'
      }
    ],
    suspects: [
      {
        id: 'suspect_aris_thorne',
        caseId: 'the-silent-alibi',
        name: 'Dr. Aris Thorne',
        role: 'Chief Cryptographer & Pharmacologist',
        age: 44,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        bio: 'Brilliant researcher who created NeuralCore’s proprietary bio-sensors.',
        personality: 'Cerebral, detached, smugly confident in digital alibis.',
        temperament: 'arrogant',
        possibleMotive: 'Losing his multi-million patent rights at midnight.',
        alibi: 'Claims he was logged into the building gym from 10:30 PM to 12:15 AM (smart badge on turnstile).',
        initialStatement: '“I was bench-pressing in the fitness center all night. Check the biometric turnstile logs if you doubt my presence.”',
        relationships: [],
        knownFacts: ['Possesses root access to all server switches.'],
        hiddenFacts: ['He left his smart badge on a gym fan to generate movement pings while running a script.'],
        authorizedDisclosures: ['Admits Marcus was a difficult partner, but denies violence.'],
        contradictionTriggers: []
      },
      {
        id: 'suspect_clara_ross',
        caseId: 'the-silent-alibi',
        name: 'Clara Ross',
        role: 'Chief Financial Officer',
        age: 39,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        bio: 'Ruthless executive overseeing the upcoming public IPO.',
        personality: 'Sharp, corporate, guarded.',
        temperament: 'composed',
        possibleMotive: 'Marcus threatened to disclose offshore tax irregularities.',
        alibi: 'Hosting a video conference with Tokyo underwriters until midnight.',
        initialStatement: '“I was on Zoom with eight Japanese bankers. Every second is recorded in the cloud.”',
        relationships: [],
        knownFacts: [],
        hiddenFacts: [],
        authorizedDisclosures: []
      }
    ],
    timelineEvents: [
      {
        id: 'evt_silent_1',
        caseId: 'the-silent-alibi',
        timeString: '08:00 PM',
        sortTimestamp: 2000,
        title: 'Cron Daemon Deployed',
        description: 'Cron task injected into Server Rack Switch 04.',
        source: 'physical_record',
        involvedSuspects: ['suspect_aris_thorne'],
        location: 'Core Server Sub-Vault',
        isVerified: true
      },
      {
        id: 'evt_silent_2',
        caseId: 'the-silent-alibi',
        timeString: '11:40 PM',
        sortTimestamp: 2340,
        title: 'Espresso Dispenser Activated Remotely',
        description: 'Brewer dispenses poisoned aconitine espresso capsule.',
        source: 'digital',
        involvedSuspects: [],
        location: 'Executive Corner Suite',
        isVerified: true
      },
      {
        id: 'evt_silent_3',
        caseId: 'the-silent-alibi',
        timeString: '11:42 PM',
        sortTimestamp: 2342,
        title: 'Marcus Vance Collapses',
        description: 'Vance ingests the coffee and suffers fatal cardiac arrest.',
        source: 'surveillance',
        involvedSuspects: [],
        location: 'Executive Corner Suite',
        isVerified: true
      }
    ],
    contradictions: [
      {
        id: 'contra_thorne_script',
        caseId: 'the-silent-alibi',
        title: 'Gym Alibi vs PGP-Signed Cron Execution',
        suspectId: 'suspect_aris_thorne',
        suspectName: 'Dr. Aris Thorne',
        claimedStatement: '“I was bench-pressing in the fitness center all night. Check the turnstile logs.”',
        contradictingClueId: 'clue_cron_script',
        contradictingClueName: 'Automated IoT Trigger Script',
        explanation: 'Thorne used an automated cron script with his personal cryptographic key to trigger the poisoning remotely while his badge sat in the gym.',
        suggestedFollowUp: 'Subpoena Thorne’s cryptographic private key.',
        isConfirmed: true
      }
    ],
    hints: [
      {
        tier: 1,
        penaltyPoints: 2,
        title: 'Network Traffic',
        content: 'Check the server logs to see how the coffee dispenser received its brew instruction.',
        focusArea: 'general_direction'
      },
      {
        tier: 2,
        penaltyPoints: 5,
        title: 'The Toxin Source',
        content: 'Aconitine requires bio-lab credentials to synthesize.',
        focusArea: 'room_or_character'
      },
      {
        tier: 3,
        penaltyPoints: 10,
        title: 'Cryptographic Signature',
        content: 'The script was signed with Dr. Aris Thorne\'s personal PGP key.',
        focusArea: 'key_connection'
      }
    ],
    verifiedSolution: {
      culpritId: 'suspect_aris_thorne',
      culpritName: 'Dr. Aris Thorne',
      motive: 'Prevent Marcus Vance from revoking his patent rights at midnight.',
      method: 'Injected aconitine into the coffee capsule and scheduled an automated network script from the server switch to brew it at 11:40 PM while faking an alibi at the gym.',
      requiredClueIds: ['clue_poisoned_capsule', 'clue_altered_patent', 'clue_cron_script'],
      keyContradictionIds: ['contra_thorne_script'],
      timelineVerificationOrder: ['evt_silent_1', 'evt_silent_2', 'evt_silent_3'],
      solutionNarrative: 'Dr. Thorne programmed an automated script to poison Vance at distance, relying on IoT devices to execute the murder while he created a spoofed badge alibi in the fitness center.'
    }
  },
  {
    id: 'echoes-in-the-fog',
    title: 'Echoes in the Fog',
    tagline: 'A priceless 17th-century brass astrolabe disappears during a coastal lighthouse blackout.',
    crimeCategory: 'Grand Theft',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    location: 'Saint-Malo Maritime Museum, Brittany',
    setting: 'A fortified stone rampart museum overlooking stormy Atlantic swells and thick sea mist.',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    description: 'During a 12-minute lightning-induced blackout, the museum’s glass gallery was breached and the rare Royal Astrolabe was stolen.',
    incidentTime: '01:15 AM',
    victim: {
      name: 'Curator Jean-Paul Moreau',
      description: 'Senior maritime historian.'
    },
    isOfficial: true,
    authorName: 'MysteryOS Archives',
    createdAt: '2026-10-10T00:00:00Z',
    locations: [
      {
        id: 'loc_astronomy_hall',
        caseId: 'echoes-in-the-fog',
        name: 'Navigation & Astronomy Hall',
        description: 'Shattered reinforced vitrine where the brass astrolabe rested on velvet.',
        roomType: 'crime_scene',
        ambientImage: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1600&q=80',
        objects: [
          {
            id: 'obj_broken_vitrine',
            name: 'Shattered Display Vitrine',
            xPercent: 50,
            yPercent: 45,
            revealsClueId: 'clue_glass_cutter_diamond',
            inspectMessage: 'Circular scored cut made with professional diamond glass suction tool.',
            inspectActionLabel: 'Inspect Vitrine Edge'
          }
        ]
      }
    ],
    clues: [
      {
        id: 'clue_glass_cutter_diamond',
        caseId: 'echoes-in-the-fog',
        name: 'Specialist Suction Glass Cutter',
        description: 'Heavy duty suction cup glass cutter left in the gutter below the seawall.',
        evidenceType: 'physical',
        locationId: 'loc_astronomy_hall',
        locationName: 'Navigation & Astronomy Hall',
        reliability: 'verified_fact',
        significance: 'crucial',
        tags: ['tool', 'harbor'],
        imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
        forensicNotes: 'EXHIBIT SL-14: Industrial diamond suction apparatus recovered from stone seawall sewer. Serial #HL-882.',
        details: 'Engraved with serial number belonging to Harbor Master Henri Laurent\'s salvage toolkit.'
      }
    ],
    suspects: [
      {
        id: 'suspect_henri_laurent',
        caseId: 'echoes-in-the-fog',
        name: 'Captain Henri Laurent',
        role: 'Harbor Master & Diver',
        age: 52,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        bio: 'Veteran seafaring diver with profound knowledge of underwater currents.',
        personality: 'Gruff, weathered, laconic.',
        temperament: 'defensive',
        possibleMotive: 'His salvage vessel was about to be impounded for back taxes.',
        alibi: 'Claims he was inspecting the jetty lanterns during the storm.',
        initialStatement: '“I was out on the breakwater making sure the channel buoys didn’t break loose.”',
        relationships: [],
        knownFacts: ['Owns deep water diving gear.'],
        hiddenFacts: ['He hid the astrolabe in a waterproof canister tethered below the tide line.'],
        authorizedDisclosures: [],
        contradictionTriggers: []
      }
    ],
    timelineEvents: [
      {
        id: 'evt_fog_1',
        caseId: 'echoes-in-the-fog',
        timeString: '01:10 AM',
        sortTimestamp: 110,
        title: 'Generator Power Surge',
        description: 'Lightning strikes harbor substation; emergency generator fails.',
        source: 'physical_record',
        involvedSuspects: [],
        location: 'Harbor Substation',
        isVerified: true
      },
      {
        id: 'evt_fog_2',
        caseId: 'echoes-in-the-fog',
        timeString: '01:15 AM',
        sortTimestamp: 115,
        title: 'Glass Vitrine Cut',
        description: 'Display glass excised and astrolabe extracted.',
        source: 'physical_record',
        involvedSuspects: ['suspect_henri_laurent'],
        location: 'Navigation & Astronomy Hall',
        isVerified: true
      }
    ],
    contradictions: [],
    hints: [
      {
        tier: 1,
        penaltyPoints: 2,
        title: 'The Tools of the Trade',
        content: 'Check the tool marks on the glass display case.',
        focusArea: 'general_direction'
      }
    ],
    verifiedSolution: {
      culpritId: 'suspect_henri_laurent',
      culpritName: 'Captain Henri Laurent',
      motive: 'Raise funds to pay impound penalties on his salvage ship.',
      method: 'Used commercial diving suction tools to score glass and submerge the astrolabe in the harbor.',
      requiredClueIds: ['clue_glass_cutter_diamond'],
      keyContradictionIds: [],
      timelineVerificationOrder: ['evt_fog_1', 'evt_fog_2'],
      solutionNarrative: 'Captain Laurent used his nautical diving salvage tools to cut the glass case during the harbor blackout.'
    }
  }
];
