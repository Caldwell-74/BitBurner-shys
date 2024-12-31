import React from "react";
import Tablist from "./tablist";

interface IProps_TopBar {
	setEntity: (entity: Device) => void;
}

export function EntitiesTopBar(props: IProps_TopBar) {
	return <Tablist setEntity={props.setEntity} />;
}
