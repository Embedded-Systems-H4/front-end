
export interface Device {
    id: string,
    type?: string,
    name?: string,
    status?: "online" | "offline",
    lastUpdatedAt?: Date
}