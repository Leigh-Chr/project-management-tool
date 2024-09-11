export type ItemType = 'text' | 'date' | 'number';

export type Table<Item> = {
  headers: { name: string; key: keyof Item }[];
  items: { key: keyof Item; type: ItemType }[];
};
