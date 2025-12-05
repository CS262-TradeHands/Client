
/**
 *  Type definitions for the TradeHands database
 * 
 * @author: Hayden Stob
 * @date: Fall 2025
 */

export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password_hash: string;
    profile_image_url?: string;
    verified: boolean;
    private: boolean;
    created_at: string;
}

export interface UserInput {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    password_hash: string;
    profile_image_url?: string;
}
