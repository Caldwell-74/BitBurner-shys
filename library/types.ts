export type BookDataListCount = BookRawDataCount[];
export type BookRawDataCount = [number, number?];

export interface SampleDataCount {
	init: BookDataListCount;
	extend: BookDataListCount;
	delete: number[];
	errors: Record<string, number>;
}

export type BookDataList = BookRawData[];
export type BookRawData = [number];

export interface SampleData {
	init: BookDataList;
	extend: BookDataList;
	delete: number[];
	errors: Record<string, number>;
}
