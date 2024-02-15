import { Role } from "./Role"

export interface Profile {
    _id?: string,
    id?: number,
    name: string
    birthday: Date
    email: string
    gender?: "m" | "f"
    roles?: Role[]
    status?: "enabled" | "disabled"
}