import {IListItem} from "./listItem.interface";

export interface IList {
  id: number;
  name: string;
  listItems: IListItem[];
}
