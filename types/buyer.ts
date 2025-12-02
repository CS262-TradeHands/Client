/**
 *  Type definitions for the TradeHands database
 * 
 * @author: Hayden Stob
 * @date: Fall 2025
 */

export interface Buyer {
    id: number;
    user_id: number;
    title: string;
    about: string;
    experience: number;
    budget_range_lower: number;
    budget_range_higher: number;
    city: string;
    state: string;
    country: string;
    industries: string[];
    size_preference: string;
    timeline: number;
    linkedin_url: string;
    created_at: string;
}

export interface BuyerInput {
    user_id: number;
    title: string;
    about: string;
    experience: number;
    budget_range_lower: number;
    budget_range_higher: number;
    city: string;
    state: string;
    country: string;
    industries: string[];
    size_preference: string;
    timeline: number;
    linkedin_url: string;
}