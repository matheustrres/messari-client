export const removeDuplicatesFromArray = <T>(array: T[]): T[] => [
	...new Set(array),
];
