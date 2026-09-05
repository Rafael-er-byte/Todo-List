import type AccountParams from './AccountParams';

export type AccountCreateParams = Omit<AccountParams, 'id' | 'createdAt'>;
