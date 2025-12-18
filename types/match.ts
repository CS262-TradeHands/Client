/**
 *  Type definitions for the TradeHands database
 * 
 * @author: Hayden Stob
 * @date: Fall 2025
 */

export interface Match {
    interest_id: number;
    buyer_id: number;
    business_id: number;
    sent_from_bus_to_buy: boolean;
    created_at: string;
}

export interface MatchInput {
    buyer_id: number;
    business_id: number;
    sent_from_bus_to_buy: boolean;
}