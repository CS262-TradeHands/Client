
/**
 *  Type definitions for the TradeHands database
 * 
 * @author: Hayden Stob
 * @date: Fall 2025
 */

export interface Listing {
    business_id: number;
    owner_id: number;
    name: string;
    industry: string;
    city: string;
    state: string;
    country: string;
    image_url?: string;
    asking_price_upper_bound: number;
    asking_price_lower_bound: number;
    description: string;
    employees: string;
    years_in_operation: number;
    annual_revenue: number;
    monthly_revenue: number;
    profit_margin: number;
    timeline: number;
    website?: string;
    created_at: string;
}

export interface ListingInput {
    owner_id: number;
    name: string;
    industry: string;
    city: string;
    state: string;
    country: string;
    image_url?: string;
    asking_price_upper_bound: number;
    asking_price_lower_bound: number;
    description: string;
    employees: string;
    years_in_operation: number;
    annual_revenue: number;
    monthly_revenue: number;
    profit_margin: number;
    timeline: number;
    website?: string;
}
