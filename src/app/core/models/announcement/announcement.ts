import { User } from "../user";
import { Category } from "./category";
import { Photo } from "./photo";

// ANNOUNCEMENT MODEL RESPONSE
export interface Announcement {
    id : number;
    title: string;
    description: string;
    operation_type: string,
    state: string;
    price: number | null;
    is_completed: number;
    is_cancelled: number;
    exchange_location_address: string;
    exchange_location_lng : string;
    exchange_location_lat : string;
    category : Category;
    photos : Photo[];
    created_by : User;
    created_at : string;
    updated_at : string;
}

//ANNOUNCEMENT MODEL REQUEST
export interface AnnouncementData {
    title: string;
    description: string;
    category_id: number;
    operation_type: 'don' | 'sale' | 'exchange';
    state: 'new' | 'good' | 'damaged' | 'like new';
    price?: number | null;
    is_completed?: boolean | null;
    is_cancelled?: boolean | null;
    exchange_location_address: string;
    exchange_location_lng: number;
    exchange_location_lat: number;
    photos: File[];
}

