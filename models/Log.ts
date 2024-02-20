import { Card } from "./Card"
import { Device } from "./Device"
import { Profile } from "./Profile"
import { Role } from "./Role"

export interface Log {
    type: "role_creation" | "role_deletion" | "user_role_set" | "user_role_unset" | "device_role_set" | "device_role_unset" | "device_access_update" | "device_register" | "device_online" | "device_offline" | "card_link"
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