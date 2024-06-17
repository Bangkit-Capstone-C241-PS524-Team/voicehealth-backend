export interface DrugDetail {
    id: string;
    name: string;
    image_url: string;
    description: string;
}

export interface MlResponse {
    category: string;
    drugs: string[];
}
