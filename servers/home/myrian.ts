import { Root } from "./components/root";

class MyrianHandler {
	myrian: Myrian;
	constructor(ns: NS) {
		Object.assign(this, ns);
	}
	getUI() {
		return Root({
			getDevices: this.devices(),
		});
	}
	devices() {
		return () => this.myrian.getDevices().reduce(DeviceReduce, {});
	}
}
function DeviceReduce(acc: SortedDevices, curr: Device): SortedDevices {
	acc[curr.type] ??= [];
	acc[curr.type].push(curr);
	return acc;
}
export default MyrianHandler;
