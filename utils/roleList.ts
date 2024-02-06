import { hookstate } from '@hookstate/core';

import { Role } from '@models/Role';

const roleListState = hookstate<Role[]>([]);

// export const getRoleList = async () => {
//     const res = await fetch("/api/database/getRoles", {})
//     const data = await res.json()
//     const roles = data?.roles
//     if (roles) {
//         setRoleList(roles)
//     }
//     return roleListState.get({ noproxy: true });
// }
export const getRoleList = () => roleListState.get({ noproxy: true });

export const getRoleById = (id: string) => roleListState.get({ noproxy: true }).filter((role) => role.id === id)[0]

export const setRoleList = (newRoleList: Role[]) => roleListState.set(newRoleList);

export const mergeRole = (newRole: Role) => roleListState.set((prevRoleList) => [...prevRoleList, newRole]);