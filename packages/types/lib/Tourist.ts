export interface TouristProfile {
    id: string;
    nickname: string;
    email: string;
    website?: string;
    avatar_style: string;
    avatar_search?: string;
}

export interface TouristEntity extends TouristProfile {
    last_visit_token: string;
}
