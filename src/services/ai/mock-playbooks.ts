import { Playbook, IncidentType } from '@/types';

/** Shape of a single mock playbook entry before it is mapped to a Playbook. */
interface MockPlaybookEntry {
  title: string;
  problem: string;
  rootCause: string;
  risk: string;
  actions: string[];
  impact: string;
  lessons: string;
  confidence: number;
  alt: string;
}

/** Pre-defined heuristic playbook data keyed by incident type. */
const MOCK_PLAYBOOK_DATA: Record<IncidentType, MockPlaybookEntry> = {
  'Heavy Rain': {
    title: 'Active Storm Rain Management Protocol',
    problem: 'Sudden rainstorm causes spectators to evacuate seating sections and crowd into covered walkways, creating choke points.',
    rootCause: 'Lack of transition shelter canopies and slow weather routing communication.',
    risk: 'Lobby density overcrowding, slip hazards, and food stand queue gridlocks.',
    actions: [
      'Switch concourse digital signboards to directional evacuation indicators.',
      'Transition food stalls on levels 1 and 2 to quick-grab menu sets.',
      'Deploy wet-weather floor mats and fans at main concourse access doors.',
    ],
    impact: 'Reduces food hall congestion by 40% in under 15 minutes.',
    lessons: 'Integrate live Doppler radar monitoring directly into the security gate operation dashboard.',
    confidence: 94,
    alt: 'Open secondary covered stadium corridors to double pedestrian surface area.',
  },
  'Medical Emergency': {
    title: 'Triage Response & Lane Clearing SOP',
    problem: 'Medical emergency in high-altitude/heat zone requires urgent transport while pathways are packed with fans.',
    rootCause: 'Elevated temperature index combined with slow dispatch response to seat location.',
    risk: 'Delayed medical attention leading to severe injury, corridor blocks by onlookers.',
    actions: [
      'Deploy a volunteer squad to form a physical corridor for responders.',
      'Dispatch local Zone 2 paramedic squad on foot with visual guidance beacons.',
      'Prepare emergency elevator 3 for immediate express evacuation.',
    ],
    impact: 'Reduces time-to-paramedic arrival to under 4 minutes.',
    lessons: 'Position paramedic nodes at opposite quadrants of the stadium ring on days with temperatures above 28\u00B0C.',
    confidence: 96,
    alt: 'Use main pitch borders to run medical transports directly to the stadium emergency ambulance dock.',
  },
  'Food Queue': {
    title: 'Auxiliary Concession Balancing Protocol',
    problem: 'Food queue wait times at East Concourse exceed 35 minutes, blocking fire exits.',
    rootCause: 'High concentration of popular local vendors and slow card reader connections.',
    risk: 'Exit pathway blockage, crowd frustration, and lost food revenue.',
    actions: [
      'Send mobile cart vendors to the East Concourse outer ring to intercept waiting fans.',
      'Distribute app notification offering 15% discount at less crowded West Concourse stalls.',
      'Reassign 2 queue managers to regulate crowd spacing and expedite cash lanes.',
    ],
    impact: 'Balances queue wait times across all quadrants to under 12 minutes.',
    lessons: 'Introduce preorder kiosks and multi-point cashiers during high-capacity matches.',
    confidence: 88,
    alt: 'Set up temporary draft beverage stations outside the main lobby area.',
  },
  'Parking Jam': {
    title: 'Gridlock Diversion & Egress Optimization',
    problem: 'Post-match exit from Lot C is gridlocked, causing tailbacks onto surrounding expressways.',
    rootCause: 'Simultaneous exit attempts with poor coordination of traffic control lights.',
    risk: 'Pedestrian safety hazards, idling emissions violations, and emergency vehicle blockage.',
    actions: [
      'Switch Lot C outbound flow to double-lane exit routing.',
      'Coordinate with municipal control center to extend local green light phases to 90 seconds.',
      'Deploy mobile traffic directors to block secondary incoming roads and clear exit corridors.',
    ],
    impact: 'Reduces total stadium parking evacuation time by 25 minutes.',
    lessons: 'Pre-sell zoned parking passes to distribute vehicle exit directions before the match starts.',
    confidence: 90,
    alt: 'Hold outbound vehicles in Lot C for 10-minute staggered intervals to prevent street crowding.',
  },
  'Gate Closed': {
    title: 'Offline Entry Protocol & Queue Redirection',
    problem: 'Gate B scanner systems offline; incoming crowds backing up and creating an entry squeeze.',
    rootCause: 'Local switch hardware failure preventing cloud connection validation.',
    risk: 'Crush hazard at security gate, delayed match kickoff, and ticket authentication failures.',
    actions: [
      'Shift scanner devices to local storage offline verification mode.',
      'Deploy volunteers with megaphone instructions to redirect incoming flow to Gate A and C.',
      'Authorize manual barcode scanning using back-up mobile devices.',
    ],
    impact: 'Resolves gate backup and clears the entry plaza before the start of the match.',
    lessons: 'Build local cached databases on entry scanners updated 2 hours before gates open.',
    confidence: 92,
    alt: 'Perform physical ticket verification stub checks with temporary gate passes.',
  },
  'Lost Child': {
    title: 'Zone Lockdown & Unified Search System',
    problem: 'A child was reported separated from parents near Section 104 during mid-match rush.',
    rootCause: 'High density crowd flow during half-time concession run.',
    risk: 'Child safety, parent panic, and exit-entry point security alerts.',
    actions: [
      'Initiate visual sweeps at all exits and scan match ticket records for parent seating zone.',
      'Transmit description and photo to all stadium security and volunteer tablets.',
      'Establish a secure meeting point in Section 104 and assign a welfare officer.',
    ],
    impact: 'Locates and reunites child with parents in under 9 minutes.',
    lessons: 'Provide child safety wristbands at stadium entrance gates for families with children.',
    confidence: 97,
    alt: 'Execute stadium-wide announcer broadcast if zone sweeps do not resolve the search in 15 minutes.',
  },
  'Volunteer Shortage': {
    title: 'Dynamic Resource Re-allocation SOP',
    problem: 'Concourse information booths and accessible gates are understaffed, leading to confusion.',
    rootCause: 'Public transport delay causing 15 volunteers to arrive late.',
    risk: 'Poor customer experience, compliance issues at accessibility gates, and visitor delay.',
    actions: [
      'Re-assign non-essential concessions volunteers to primary accessibility points.',
      'Switch information booths to self-serve kiosks with digital map screens.',
      'Deploy mobile floor coordinators to cover dual-zones in rotating teams.',
    ],
    impact: 'Maintains critical gate support operations at 100% status.',
    lessons: 'Schedule volunteers to arrive in staggered shifts beginning 3 hours before kickoff.',
    confidence: 85,
    alt: 'Utilize stadium administration staff to cover major customer-facing checkpoints.',
  },
  'Metro Delay': {
    title: 'Post-Match Egress Delay Mitigation',
    problem: 'Local metro line 1 experiencing 30-minute delays, leaving 12,000 fans stranded on transit platforms.',
    rootCause: 'Train mechanical failure at municipal intersection.',
    risk: 'Transit platform crushing, station shutdowns, and street riots.',
    actions: [
      'Open stadium exit gates in waves to regulate flow toward the metro station.',
      'Coordinate with local transit authority to dispatch 10 backup diesel shuttle buses.',
      'Extend stadium concourse food stall hours and display matches on screens to retain fans inside.',
    ],
    impact: 'Maintains transit platform densities below critical thresholds.',
    lessons: 'Establish a direct communication channel with the city transit command room.',
    confidence: 91,
    alt: 'Route crowd toward secondary bus and taxi pickup zones 400m away.',
  },
  'Accessibility Request': {
    title: 'Wheelchair Transfer & Elevator Routing Plan',
    problem: 'Sudden influx of spectators requiring wheelchair assistance at Gate D, exhausting local supply.',
    rootCause: 'Group reservation arrival without pre-arranged transport support.',
    risk: 'Severe gate entry delay and Americans with Disabilities Act (ADA) / accessibility compliance breaches.',
    actions: [
      'Dispatch 4 extra wheelchairs from the central medical room to Gate D.',
      'Designate Elevator 2 for exclusive accessibility use during the peak hour.',
      'Assign a dedicated volunteer escort to assist each party to their seats.',
    ],
    impact: 'Processes all accessibility requests within 10 minutes of arrival.',
    lessons: 'Request ticket reservation portals to prompt fans for accessibility requirements during purchasing.',
    confidence: 89,
    alt: 'Set up a temporary waiting lounge with refreshments near Gate D until transports arrive.',
  },
  'Power Failure': {
    title: 'Auxiliary Power Cutover & Security Lockout',
    problem: 'Concourse lighting and ticketing power grid fails during peak entry hour.',
    rootCause: 'Local transformer overload due to air conditioning demand.',
    risk: 'Total darkness in corridors, crowd panic, scanner downtime, and security breaches.',
    actions: [
      'Activate emergency battery backup lighting in all corridors and stairwells.',
      'Engage backup diesel generators 1 and 2 for concession and gate validation terminals.',
      'Deploy security details with flashlights to secure entry portals.',
    ],
    impact: 'Restores essential systems within 8 seconds and avoids crowd panic.',
    lessons: 'Perform monthly full-load generator cutover tests under match-day conditions.',
    confidence: 98,
    alt: 'Transition gates to visual ticket checks and restrict stadium entry to single-file queues.',
  },
  'Large Crowd': {
    title: 'Overcrowding Gate Pressure Release Plan',
    problem: 'Ticket check plaza at Gate F is congested, causing high pressure on the turnstiles.',
    rootCause: 'Late arrival of 8,000 fans within 15 minutes of kickoff.',
    risk: 'Crowd crushing, turnstile damage, and fence breaches.',
    actions: [
      'Form outer holding lines using queue ropes to break up direct pressure.',
      'Open 4 auxiliary ticket gates to accelerate the processing rate.',
      'Authorize security to bypass digital checks and conduct manual bag checks only.',
    ],
    impact: 'Reduces crowd pressure at turnstiles to normal level within 7 minutes.',
    lessons: 'Offer early entry incentives (food discounts) to spread out arrivals.',
    confidence: 93,
    alt: 'Deploy mounted security/police officers to safely partition the queue.',
  },
};

/**
 * Generates a heuristic playbook object when the Gemini API is unavailable.
 * Pure function — no side effects, no API calls.
 */
export function generateMockPlaybookData(
  stadiumId: string,
  stadiumName: string,
  eventType: IncidentType,
  description: string,
): Omit<Playbook, 'id' | 'createdAt'> {
  const entry = MOCK_PLAYBOOK_DATA[eventType];

  return {
    title: `${stadiumName} - ${entry.title}`,
    eventType,
    stadiumId,
    stadiumName,
    problem: `${entry.problem} Details: ${description || ''}`,
    rootCause: entry.rootCause,
    operationalRisk: entry.risk,
    recommendedActions: entry.actions,
    expectedImpact: entry.impact,
    lessonsLearned: entry.lessons,
    confidenceScore: entry.confidence,
    alternativeStrategy: entry.alt,
  };
}
