import React, { useContext, useState } from "react";
import { DeviceContext } from "./root";
import Tab from "./tab";
import Dropdown from "./dropdown";
interface IProps {
	setEntity: (entity: Device) => void;
}
function Tablist(props: IProps) {
	const devices = useContext(DeviceContext);
	const [open, setOpen] = React.useState(null as DeviceType);

	const handleOpen = (param: DeviceType) => {
		if (open === param) setOpen(null);
		else setOpen(param);
	};
	return (
		<ul className="entitiesNavList" role="tablist">
			{Object.keys(devices).map((key: DeviceType, i) => {
				return (
					<>
						<Tab key={key} handleOpen={handleOpen} width={100 / 3} />
						<Dropdown
							items={devices[key]}
							visible={open === key}
							setEntity={props.setEntity}
						></Dropdown>
					</>
				);
			})}
		</ul>
	);
}
export default Tablist;
