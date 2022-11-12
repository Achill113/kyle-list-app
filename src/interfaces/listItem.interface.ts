export interface IListItem {
  id: number;
  name: string;
  completed: boolean;
  listId: number;
  list?: { name: string };
}
