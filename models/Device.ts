
export interface Device {
    id: number,
    type?: string,
    name?: string,
    status?: "online" | "offline",
    lastUpdatedAt?: Date
}