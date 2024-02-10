import { hookstate } from '@hookstate/core';

import { Door } from '@models/Door';
import { Role } from '@models/Role';


export const doorsGlobalState = hookstate<Door[]>([]);
export const rolesGlobalState = hookstate<Role[]>([]);
export const deviceRolesGlobalState = hookstate<Role[]>([]);