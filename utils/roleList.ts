import { hookstate } from '@hookstate/core';

import { Role } from '@models/Role';

const roleListState = hookstate<Role[]>([]);

export const getRoleList = () => roleListState.get({ noproxy: true });

export const getRoleById = (name: string) => roleListState.get({ noproxy: true }).filter((role) => role.name === name)[0]

export const setRoleList = (newRoleList: Role[]) => roleListState.set(newRoleList);

export const mergeRole = (newRole: Role) => roleListState.set((prevRoleList) => [...prevRoleList, newRole]);