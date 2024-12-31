import type { SampleDataCount, SampleData } from "./types";
export const sampleDataCount: SampleDataCount = {
	init: [
		[0, 100],
		[1, 10],
		[2, 30],
		[40, 22],
		[3, 0],
	],
	extend: [
		[4, 50],
		[5, 100],
		[6, 0],
		[7, 88],
	],
	delete: [4, 5, 2],
	errors: {
		add: 0,
		del: 999,
	},
};
export const sampleData: SampleData = {
	init: [[0], [1], [2], [40], [3]],
	extend: [[4], [5], [6], [7]],
	delete: [4, 5, 2],
	errors: {
		add: 0,
		del: 999,
	},
};
