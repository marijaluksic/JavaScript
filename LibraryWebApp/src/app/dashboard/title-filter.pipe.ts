import { Pipe, PipeTransform } from '@angular/core';
import {Book} from "../models/book.model";

@Pipe({
  name: 'titleFilter',
  pure: false
})
export class TitleFilterPipe implements PipeTransform {

  transform(items: Book[], value: string): Book[] {
    if (!items || value=="") {
      return items;
    }
    return items.filter(item => item.title.toLowerCase().includes(value.toLowerCase()));
  }

}
