export interface Country {
    [key: string]: string | number;
    id: number;
    name: string;
    flag: string;
    area: string;
    population: number;
    pendingWith: string;
    status: string;
}
