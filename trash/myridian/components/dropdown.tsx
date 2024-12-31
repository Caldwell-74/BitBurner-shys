import React from "react";
interface IProps {
	items: Device[];
	visible: boolean;
	setEntity: (item: Device) => void;
}

function Dropdown(props: IProps) {
	return props.visible ? <></> : null;
}
export default Dropdown;
