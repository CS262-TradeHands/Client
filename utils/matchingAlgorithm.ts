// Define clear types for our data and search criteria
export interface Profile {
  id: number;
  attributes: {
    age: number;
    location: string;
    interests: string[];
  };
}

export interface MatchCriteria {
  minAge?: number;
  maxAge?: number;
  location?: string;
  requiredInterests?: string[];
}

// Hardcoded data (can be replaced with a database call)
const mockProfiles: Profile[] = [
  { id: 1, attributes: { age: 25, location: 'NY', interests: ['tech', 'finance'] } },
  { id: 2, attributes: { age: 30, location: 'CA', interests: ['art', 'music'] } },
  { id: 3, attributes: { age: 28, location: 'NY', interests: ['tech', 'sports'] } },
  { id: 4, attributes: { age: 35, location: 'CA', interests: ['finance', 'real estate'] } },
  { id: 5, attributes: { age: 26, location: 'NY', interests: ['tech', 'music'] } },
];

/**
 * Finds and scores matching profiles based on given criteria.
 */
export function findMatches(criteria: MatchCriteria): (Profile & { score: number })[] {
  const matches = mockProfiles
    .map(profile => {
      let score = 0;
      let isMatch = true;

      // --- Filtering and Scoring Logic ---

      // Location check
      if (criteria.location) {
        if (profile.attributes.location === criteria.location) {
          score += 10; // Higher score for matching location
        } else {
          isMatch = false; // Exclude if location doesn't match
        }
      }

      // Age range check
      if (criteria.minAge && profile.attributes.age < criteria.minAge) isMatch = false;
      if (criteria.maxAge && profile.attributes.age > criteria.maxAge) isMatch = false;
      if (isMatch && (criteria.minAge || criteria.maxAge)) {
        score += 5; // Add score if age is within range
      }

      // Interests check
      if (criteria.requiredInterests && criteria.requiredInterests.length > 0) {
        const commonInterests = profile.attributes.interests.filter(interest =>
          criteria.requiredInterests!.includes(interest)
        );

        if (commonInterests.length === 0) {
          isMatch = false; // Exclude if no common interests
        } else {
          score += commonInterests.length * 5; // Add score for each matching interest
        }
      }

      // Return the profile with its score if it's a match, otherwise null
      return isMatch ? { ...profile, score } : null;
    })
    .filter((result): result is Profile & { score: number } => result !== null); // Remove non-matches

  // Sort matches by score in descending order
  return matches.sort((a, b) => b.score - a.score);
}

// --- Example Usage ---
async function runExample() {
  console.log('Running matching algorithm...');

  // Define the criteria for the search
  const searchCriteria: MatchCriteria = {
    location: 'NY',
    minAge: 20,
    maxAge: 30,
    requiredInterests: ['tech'],
  };

  console.log('\nSearching for:', searchCriteria);

  const results = findMatches(searchCriteria);

  if (results.length > 0) {
    console.log('\nFound Matches (sorted by score):');
    results.forEach(match => {
      console.log(
        `- ID: ${match.id}, Score: ${match.score}, Attributes:`,
        match.attributes
      );
    });
  } else {
    console.log('\nNo matches found.');
  }
}

// To run the example, you could call this function from another file.
// runExample();
