import React from "react";
import { Root } from "./components/root";
import { ReactNode } from "NetscriptDefinitions";

class MyrianHandler {
	myrian: Myrian;
	constructor(ns: NS) {
		Object.assign(this, ns);
	}

	get UI(): ReactNode {
		//@ts-ignore
		return React.createElement(Root, {
			getDevices: this.devices,
		});
	}
	get devices() {
		return () => this.myrian.getDevices().reduce(DeviceReduce, {});
	}
}
function DeviceReduce(acc: SortedDevices, curr: Device): SortedDevices {
	acc[curr.type] ??= [];
	acc[curr.type].push(curr);
	return acc;
}
export default MyrianHandler;
