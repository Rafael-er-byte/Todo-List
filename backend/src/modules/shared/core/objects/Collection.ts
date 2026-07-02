import RelationshipAlreadyExists from '../errors/RelationshipAlreadyExists';
import ResourceNotFound from '../errors/ResourceNotFound';
import type IdEntity from './IdEntity';

export default class Collection{
  private recentlyAddedItems: IdEntity[] = [];
  private recentlyDeletedItems: IdEntity[] = [];
  private items: IdEntity[] = [];

  constructor(items: IdEntity[], recentlyAddedItems: IdEntity[], recentlyDeletedItems: IdEntity[]) {
    this.items = items;
    this.recentlyAddedItems =  recentlyAddedItems;
    this.recentlyDeletedItems = recentlyDeletedItems;
  }

  public addItem(item: IdEntity): Collection {
    if(this.items.includes(item)) throw new RelationshipAlreadyExists('Item already exists in the collection');
    this.items.push(item);
    this.recentlyAddedItems.push(item);
    return new Collection(this.items, this.recentlyAddedItems, this.recentlyDeletedItems);
  }

  public deleteItem(item: IdEntity): Collection {
    if(!this.items.includes(item)) throw new ResourceNotFound('Item not found in the collection');
    this.items = this.items.filter((a) => a !== item);
    this.recentlyDeletedItems.push(item);
    return new Collection(this.items, this.recentlyAddedItems, this.recentlyDeletedItems);
  }

  public getRecentlyAddedItems(): IdEntity[] {
    return [...this.recentlyAddedItems];
  }

  public getRecentlyDeletedItems(): IdEntity[] {
    return [...this.recentlyDeletedItems];
  }

  public getItems(): IdEntity[] {
    return [...this.items];
  }

  public getPrimitives(): string[]{
    return this.items.map((item) => {
      return item.toString()
    })
  }
}
