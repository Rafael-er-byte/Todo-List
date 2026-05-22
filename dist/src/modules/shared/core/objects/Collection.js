import RelationshipAlreadyExists from '../errors/RelationshipAlreadyExists';
import ResourceNotFound from '../errors/ResourceNotFound';
export default class Collection {
    constructor(items, recentlyAddedItems, recentlyDeletedItems) {
        this.recentlyAddedItems = [];
        this.recentlyDeletedItems = [];
        this.items = [];
        this.items = items;
        this.recentlyAddedItems = recentlyAddedItems;
        this.recentlyDeletedItems = recentlyDeletedItems;
    }
    addItem(item) {
        if (this.items.includes(item))
            throw new RelationshipAlreadyExists('Item already exists in the collection');
        this.items.push(item);
        this.recentlyAddedItems.push(item);
        return new Collection(this.items, this.recentlyAddedItems, this.recentlyDeletedItems);
    }
    deleteItem(item) {
        if (!this.items.includes(item))
            throw new ResourceNotFound('Item not found in the collection');
        this.items = this.items.filter((a) => a !== item);
        this.recentlyDeletedItems.push(item);
        return new Collection(this.items, this.recentlyAddedItems, this.recentlyDeletedItems);
    }
    getRecentlyAddedItems() {
        return [...this.recentlyAddedItems];
    }
    getRecentlyDeletedItems() {
        return [...this.recentlyDeletedItems];
    }
    getItems() {
        return [...this.items];
    }
    getPrimitives() {
        return this.items.map((item) => {
            return item.getID();
        });
    }
}
//# sourceMappingURL=Collection.js.map