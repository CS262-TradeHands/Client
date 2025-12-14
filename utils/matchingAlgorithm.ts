import { Buyer } from '../types/buyer';
import { Listing } from '../types/listing';

/**
 * This function implements an algorithm to match an input buyer to potential listings.
 *
 * @param buyerProfile: the buyer to search the listings for
 * @param listingsToSearch: the listings array to find matches inside of
 * @returns: the array of highest rated listings for that buyer
 */
export function findMatchedListingsForBuyer(buyerProfile: Buyer, listingsToSearch: Listing[]): Listing[] {

  let employees: number;
  let monthlyRevenue: number;
  if (buyerProfile.size_preference === "Small") {
    employees = 20;
    monthlyRevenue = 15000;
  }
  if (buyerProfile.size_preference === "Small-Medium") {
    employees = 50;
    monthlyRevenue = 40000;
  }
  if (buyerProfile.size_preference === "Medium") {
    employees = 200;
    monthlyRevenue = 150000;
  }
  if (buyerProfile.size_preference === "Large") {
    employees = 9999999999999;
    monthlyRevenue = 100000000;
  }

const matches = listingsToSearch
  .map(listing => {
    let score = 0;
    // Location matching (20 points)
    if (buyerProfile.country && listing.country && buyerProfile.country.toLowerCase() === listing.country.toLowerCase()) {
      score += 3;
    }
    if (buyerProfile.state && listing.state && buyerProfile.state.toLowerCase() === listing.state.toLowerCase()) {
      score += 7;
    }
    if (buyerProfile.city && listing.city && buyerProfile.city.toLowerCase() === listing.city.toLowerCase()) {
      score += 10;
    }
    
    // Industry matching (15 points)
    if (buyerProfile.industries && buyerProfile.industries.length > 0) {
      for(const industry of buyerProfile.industries) {
        if (listing.industry && industry && industry.toLowerCase() === listing.industry.toLowerCase()) {
          score += 15;
          break;
        }
      }
    }
    
    // Budget vs Price matching (30 points)
    if (buyerProfile.budget_range_lower !== undefined && buyerProfile.budget_range_higher !== undefined && 
      listing.asking_price_lower_bound !== undefined && listing.asking_price_upper_bound !== undefined) {
      // Check for overlap between buyer's budget range and listing's price range
      const overlapStart = Math.max(buyerProfile.budget_range_lower, listing.asking_price_lower_bound);
      const overlapEnd = Math.min(buyerProfile.budget_range_higher, listing.asking_price_upper_bound);
      
      if (overlapStart <= overlapEnd) {
      // There is overlap - calculate score based on overlap size
      const overlapSize = overlapEnd - overlapStart;
      const buyerBudgetRange = buyerProfile.budget_range_higher - buyerProfile.budget_range_lower;
      const listingPriceRange = listing.asking_price_upper_bound - listing.asking_price_lower_bound;
      const avgRange = (buyerBudgetRange + listingPriceRange) / 2;
      
      // Full score if perfect overlap, scaled down based on overlap percentage
      const overlapPercentage = avgRange > 0 ? overlapSize / avgRange : 1;
      score += Math.floor(30 * Math.min(overlapPercentage, 1));
      }
    }

    // Size/Scale matching (15 points)
    if (buyerProfile.size_preference && listing.employees && listing.monthly_revenue) {
    if (listing.employees <= employees) {
      score += 7;
    }
    if (listing.monthly_revenue <= monthlyRevenue) {
      score += 8;
    }
    }

    // Additional criteria (10 points)
    if (buyerProfile.about && listing.description) {
    // Simple text matching for strings
    const aboutLower = buyerProfile.about.toLowerCase();
    const descriptionLower = listing.description.toLowerCase();
    const keywords = aboutLower.split(/\s+/).filter(word => word.length > 3);
    const matchingKeywords = keywords.filter(keyword =>
      descriptionLower.includes(keyword)
    );
    score += Math.min(matchingKeywords.length * 2, 10);
    }

    // Timeline Matching (10 points)
    if (buyerProfile.timeline !== undefined && listing.timeline !== undefined) {
      const timelineDiff = Math.abs(buyerProfile.timeline - listing.timeline);
      if (timelineDiff === 0) {
        score += 10;
      } else if (timelineDiff <= 1) {
        score += 7;
      } else if (timelineDiff <= 3) {
        score += 4;
      } else if (timelineDiff <= 6) {
        score += 2;
      }
    }

    console.log(listing.name, score);
    return { listing, score };
  })
  .filter(result => result.score >= 50)
  .sort((a, b) => b.score - a.score)
  .map(result => result.listing);

  return matches;
}

/**
 * This function implements an algorithm to match an input listing to potential buyers.
 *
 * @param listing: the listing to search the buyers for
 * @param buyersToSearch: the buyer array to find matches inside of
 * @returns: the array of highest rated buyers for that listing
 */
export function findMatchedBuyersForListing(listing: Listing, buyersToSearch: Buyer[]): Buyer[] {

  let employees: number = 0;
  let monthlyRevenue: number = 0;
  if (listing.employees && listing.monthly_revenue) {
    employees = listing.employees;
    monthlyRevenue = listing.monthly_revenue;
  }

  const matches = buyersToSearch
    .map(buyer => {
      let score = 0;
      
      // Location matching (20 points)
      if (listing.country && buyer.country && listing.country.toLowerCase() === buyer.country.toLowerCase()) {
        score += 3;
      }
      if (listing.state && buyer.state && listing.state.toLowerCase() === buyer.state.toLowerCase()) {
        score += 7;
      }
      if (listing.city && buyer.city && listing.city.toLowerCase() === buyer.city.toLowerCase()) {
        score += 10;
      }
      
      // Industry matching (15 points)
      if (buyer.industries && buyer.industries.length > 0) {
        for(const industry of buyer.industries) {
          if (listing.industry && industry && industry.toLowerCase() === listing.industry.toLowerCase()) {
            score += 15;
            break;
          }
        }
      }
      
      // Budget vs Price matching (30 points)
      if (buyer.budget_range_lower !== undefined && buyer.budget_range_higher !== undefined && 
        listing.asking_price_lower_bound !== undefined && listing.asking_price_upper_bound !== undefined) {
        const overlapStart = Math.max(buyer.budget_range_lower, listing.asking_price_lower_bound);
        const overlapEnd = Math.min(buyer.budget_range_higher, listing.asking_price_upper_bound);
        
        if (overlapStart <= overlapEnd) {
          const overlapSize = overlapEnd - overlapStart;
          const buyerBudgetRange = buyer.budget_range_higher - buyer.budget_range_lower;
          const listingPriceRange = listing.asking_price_upper_bound - listing.asking_price_lower_bound;
          const avgRange = (buyerBudgetRange + listingPriceRange) / 2;
          
          const overlapPercentage = avgRange > 0 ? overlapSize / avgRange : 1;
          score += Math.floor(30 * Math.min(overlapPercentage, 1));
        }
      }

      // Size/Scale matching (15 points)
      if (buyer.size_preference && employees && monthlyRevenue) {
        let buyerEmployees: number = 0;
        let buyerMonthlyRevenue: number = 0;
        if (buyer.size_preference === "Small") {
          buyerEmployees = 20;
          buyerMonthlyRevenue = 15000;
        } else if (buyer.size_preference === "Small-Medium") {
          buyerEmployees = 50;
          buyerMonthlyRevenue = 40000;
        } else if (buyer.size_preference === "Medium") {
          buyerEmployees = 200;
          buyerMonthlyRevenue = 150000;
        } else if (buyer.size_preference === "Large") {
          buyerEmployees = 9999999999999;
          buyerMonthlyRevenue = 100000000;
        }
        
        if (employees <= buyerEmployees) {
          score += 7;
        }
        if (monthlyRevenue <= buyerMonthlyRevenue) {
          score += 8;
        }
      }

      // Additional criteria (10 points)
      if (buyer.about && listing.description) {
        const aboutLower = buyer.about.toLowerCase();
        const descriptionLower = listing.description.toLowerCase();
        const keywords = aboutLower.split(/\s+/).filter(word => word.length > 3);
        const matchingKeywords = keywords.filter(keyword =>
          descriptionLower.includes(keyword)
        );
        score += Math.min(matchingKeywords.length * 2, 10);
      }

      // Timeline Matching (10 points)
      if (buyer.timeline !== undefined && listing.timeline !== undefined) {
        const timelineDiff = Math.abs(buyer.timeline - listing.timeline);
        if (timelineDiff === 0) {
          score += 10;
        } else if (timelineDiff <= 1) {
          score += 7;
        } else if (timelineDiff <= 3) {
          score += 4;
        } else if (timelineDiff <= 6) {
          score += 2;
        }
      }

      console.log(buyer.title, score);
      return { buyer, score };
    })
    .filter(result => result.score >= 50)
    .sort((a, b) => b.score - a.score)
    .map(result => result.buyer);
    
  return matches;
}