import { Card } from "./Card"
import { Device } from "./Device"
import { Profile } from "./Profile"
import { Role } from "./Role"

export interface Log {
    type: "role_creation" | "role_deletion" | "role_assignation" | "role_removal" | "device_access_update" | "device_register"
    profileId?: number
    profile?: Profile
    deviceId?: number
    device?: Device
    cardId?: number
    card?: Card
    role?: Role
    access?: string
    timestamp: Date
}