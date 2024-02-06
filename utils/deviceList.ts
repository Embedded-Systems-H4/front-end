import { hookstate } from '@hookstate/core';

import { Device } from '@models/Device';

const deviceListState = hookstate<Device[]>([]);

export const getDeviceList = () => deviceListState.get();

export const getDeviceById = (id: string) => deviceListState.get({ noproxy: true }).filter((device) => device.id === id)[0]

export const setDeviceList = (newDeviceList: Device[]) => deviceListState.set(newDeviceList);
