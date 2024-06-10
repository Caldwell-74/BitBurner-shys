import React, { useContext, useState } from "react";
import { DeviceContext } from "./root";
import { Tab } from "./tab";
interface IProps {
	setEntity: (entity: Device) => void;
}
function Tablist(props: IProps) {
	const devices = useContext(DeviceContext);
	return (
		<ul
			className="entitiesNavList"
			role="tablist"
			aria-orientation="horizontal"
		>
			{Object.keys(devices).map((key, i) => {
				return (
					<Tab
						name={key}
						id={i}
						items={devices[key]}
						setEntity={props.setEntity}
					/>
				);
			})}
		</ul>
	);
}
export default Tablist;
