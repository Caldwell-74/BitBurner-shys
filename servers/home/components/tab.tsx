import React from "react";

interface IProps {
	setEntity: (entity: Device) => void;
	items: Device[];
	name: string;
	id: number;
}

export function Tab(props: IProps) {
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => {
		setOpen(!open);
	};

	return (
		<li>
			<button
				role="tab"
				id={`tab:${props.id}`}
				className="tab-btn"
				onClick={handleOpen}
			>
				{props.name}
			</button>
			{open && (
				<ul className="menu">
					{props.items.map((item) => {
						return (
							<li>
								<button onClick={() => props.setEntity(item)}>
									{item.name}
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</li>
	);
}
