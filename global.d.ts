import * as BB from "NetscriptDefinitions";

declare global {
	type NS = BB.NS;
	type Myrian = BB.Myrian;
	type DeviceID = BB.DeviceID;
	type Device = BB.Device;
	type DeviceType = BB.DeviceType;
	type Bus = BB.Bus;
	type Component = BB.Component;
	type Recipe = BB.Recipe;
	type BaseDevice = BB.BaseDevice;
	type Server = BB.Server;
	type SortedDevices = {
		[key in DeviceType]?: Device[];
	};
}
