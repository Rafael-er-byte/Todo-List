export const VALID_SORTS = ['a-z', 'z-a', 'recent'] as const;
export type TypeSorting = (typeof VALID_SORTS)[number];
