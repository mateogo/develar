import { EntityState } from '@ngrx/entity';

/***
 * EntityState
*/

interface EntityState<V> {
  ids: string[] | number[];
  entities: { [id: string | id: number]: V };
}


export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
}
export interface BookState extends EntityState<Book> {}
