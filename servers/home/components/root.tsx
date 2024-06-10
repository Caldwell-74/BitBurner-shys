import React, { createContext, useState } from "react";
import { EntitiesTopBar } from "./topbar";
import { DeviceType } from "NetscriptDefinitions";

interface IProps {
	getDevices: () => SortedDevices;
}
export const DeviceContext = createContext({ bus: [] } as SortedDevices);

export function Root(props: IProps) {
	const [devices, setDevices] = useState(props.getDevices);
	const [entity, setEntity] = useState(
		devices["bus"][0] ?? (defaultDevice as unknown as Device)
	);
	return (
		<div className="root">
			<DeviceContext.Provider value={devices}>
				<EntitiesTopBar setEntity={setEntity} />
			</DeviceContext.Provider>
		</div>
	);
}

const defaultDevice = {
	name: "default",
	type: DeviceType.Bus,
	x: 0,
	y: 0,
	moveLvl: 0,
	transferLvl: 0,
	reduceLvl: 0,
	installLvl: 0,
	content: [],
	maxContent: 0,
	isBusy: false,
	energy: 0,
	maxEnergy: 0,
};
