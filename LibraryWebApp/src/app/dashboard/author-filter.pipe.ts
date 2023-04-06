import { Pipe, PipeTransform } from '@angular/core';
import {Book} from "../models/book.model";

@Pipe({
  name: 'authorFilter',
  pure: false
})
export class AuthorFilterPipe implements PipeTransform {
  transform(items: Book[], value: string): Book[] {
    if (!items || value=="") {
      return items;
    }
    return items.filter(item => item.authorId.toLowerCase().includes(value.toLowerCase()));
  }

}
