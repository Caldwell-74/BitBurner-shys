import React from "react";

interface IProps {
	key: DeviceType;
	handleOpen: (param: DeviceType | null) => void;
	width: number;
}

function Tab(props: IProps) {
	return (
		<button
			role="tab"
			id={`tab:${props.key}`}
			className="tab-btn"
			onClick={() => props.handleOpen(props.key)}
			style={{ width: `${props.width}%` }}
		>
			{props.key}
		</button>
	);
}
export default Tab;
