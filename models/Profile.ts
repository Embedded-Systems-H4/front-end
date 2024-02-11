import { Role } from "./Role"

export interface Profile {
    name: string
    birthday: Date
    email: string
    gender?: "m" | "f"
    roles?: Role[]
    status?: "enabled" | "disabled"
}