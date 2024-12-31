import React, { useState, useCallback, useEffect } from "react";

export function useRerender(autoRerenderTime?: number) {
	const [__, setRerender] = useState(0);

	const rerender = useCallback(
		() => setRerender((currentValue) => currentValue + 1),
		[]
	);

	useEffect(() => {
		if (!autoRerenderTime) return;
		const intervalID = setInterval(rerender, autoRerenderTime);
		return () => clearInterval(intervalID);
	}, [rerender, autoRerenderTime]);

	return rerender;
}
