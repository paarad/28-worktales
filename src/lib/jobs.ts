export const jobs = [
  // Healthcare & Emergency
  "Nurse",
  "Paramedic", 
  "Ambulance Driver",
  "Emergency Room Doctor",
  "Night Shift Nurse",
  "Medical Examiner",
  "Pharmacy Technician",
  "Dental Assistant",
  "Veterinarian",
  "Animal Shelter Worker",

  // Food & Service
  "Barista",
  "Night Shift Cashier",
  "Fast Food Worker",
  "Restaurant Server",
  "Pizza Delivery Driver",
  "Food Truck Operator",
  "Hotel Receptionist",
  "Housekeeper",
  "Wedding Planner",
  "Bartender",

  // Transportation & Delivery
  "Uber Driver",
  "Taxi Driver",
  "Bus Driver",
  "Subway Conductor",
  "Airport Security",
  "Flight Attendant",
  "Tow Truck Driver",
  "Moving Company Worker",
  "Mail Carrier",
  "Package Delivery Driver",

  // Maintenance & Labor
  "Janitor",
  "Office Cleaner",
  "Mechanic",
  "Construction Worker",
  "Electrician",
  "Plumber",
  "Locksmith",
  "Landscaper",
  "Pool Cleaner",
  "HVAC Technician",

  // Education & Childcare
  "School Teacher",
  "Substitute Teacher",
  "School Janitor",
  "School Bus Driver",
  "Daycare Worker",
  "Tutor",
  "Librarian",
  "Museum Guide",
  "Camp Counselor",

  // Retail & Customer Service
  "Cashier",
  "Gas Station Attendant",
  "Grocery Store Clerk",
  "Department Store Associate",
  "Call Center Agent",
  "Bank Teller",
  "Pharmacy Clerk",
  "Electronics Store Employee",
  "Thrift Store Worker",

  // Entertainment & Events
  "Theme Park Mascot",
  "Movie Theater Usher",
  "Concert Security",
  "DJ",
  "Wedding Photographer",
  "Escape Room Guide",
  "Haunted House Actor",
  "Street Performer",
  "Casino Dealer",

  // Unique & Specialized
  "Tarot Reader",
  "Funeral Director",
  "Crime Scene Cleaner",
  "Private Investigator",
  "Dog Walker",
  "Pet Groomer",
  "Personal Trainer",
  "Massage Therapist",
  "Life Coach",
  "Real Estate Agent",
  "Insurance Adjuster",
  "Pawn Shop Employee",
  "Antique Appraiser",
  "Storage Unit Manager",
  "Lost and Found Officer"
];

export const tones = [
  "Spooky",
  "Emotional", 
  "Wholesome",
  "Weird",
  "Ironic",
  "Mysterious",
  "Heartwarming",
  "Dramatic"
] as const;

export type Tone = typeof tones[number]; 