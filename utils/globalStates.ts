import { hookstate } from '@hookstate/core';

import { Door } from '@models/Door';
import { Profile } from '@models/Profile';
import { Role } from '@models/Role';


export const doorsGlobalState = hookstate<Door[]>([]);
export const rolesGlobalState = hookstate<Role[]>([]);
export const deviceRolesGlobalState = hookstate<Role[]>([]);
export const profilesGlobalState = hookstate<Profile[]>([]);