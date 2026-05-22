import type IdEntity from './IdEntity';
export default class Collection {
    private recentlyAddedItems;
    private recentlyDeletedItems;
    private items;
    constructor(items: IdEntity[], recentlyAddedItems: IdEntity[], recentlyDeletedItems: IdEntity[]);
    addItem(item: IdEntity): Collection;
    deleteItem(item: IdEntity): Collection;
    getRecentlyAddedItems(): IdEntity[];
    getRecentlyDeletedItems(): IdEntity[];
    getItems(): IdEntity[];
    getPrimitives(): string[];
}
//# sourceMappingURL=Collection.d.ts.map