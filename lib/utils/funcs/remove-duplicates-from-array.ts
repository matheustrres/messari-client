export const removeDuplicatesFromArray = <T extends Array<any>>(array: T) => [
	...new Set(array),
];
