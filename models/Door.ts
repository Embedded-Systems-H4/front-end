import { Device } from "./Device"
import { Role } from "./Role"

export interface Door extends Device {
    allowedRoles?: Role[]
    locked?: boolean
}