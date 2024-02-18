import { Profile } from "./Profile"
import { Role } from "./Role"

export interface Log {
    type: "role_creation" | "role_deletion" | "role_assignation" | "role_removal"
    authorId: number
    author?: Profile
    role?: Role
    timestamp: Date
}