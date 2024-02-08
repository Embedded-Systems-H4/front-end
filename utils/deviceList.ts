import { hookstate } from '@hookstate/core';

import { Door } from '@models/Door';

export const deviceListState = hookstate<Door[]>([]);

export const getDeviceList = () => deviceListState.get({ noproxy: true });

export const getDeviceById = (id: string) => deviceListState.get({ noproxy: true }).filter((device) => device.id === id)

export const setDeviceList = (newDeviceList: Door[]) => deviceListState.set(newDeviceList);
