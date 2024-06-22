import MyrianHandler from "../../myridian/myrian";
/** @param {NS} ns */
export async function main(ns: NS) {
	ns.disableLog("ALL");
	ns.tail();
	ns.clearLog();
	/*
	ns.myrian.getDevice;
	ns.myrian.getDeviceCost;
	ns.myrian.getDevices;
	ns.myrian.getUpgradeMaxContentCost;
	ns.myrian.getVulns;
	ns.myrian.reset;
	ns.myrian.upgradeMaxContent;

	ns.myrian.installDevice;
	ns.myrian.moveBus;
	ns.myrian.reduce;
	ns.myrian.transfer;
	ns.myrian.uninstallDevice;
	*/
	const myr = new MyrianHandler(ns);
	ns.printRaw(myr.UI);
	return new Promise(() => {});
}
