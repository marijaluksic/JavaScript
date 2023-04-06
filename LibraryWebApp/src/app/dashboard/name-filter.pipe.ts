import { Pipe, PipeTransform } from '@angular/core';
import {User} from "../models/user.model";

@Pipe({
  name: 'nameFilter',
  pure: false
})
export class NameFilterPipe implements PipeTransform {

  transform(items: User[], value: string): User[] {
    if (!items || value=="") {
      return items;
    }
    return items.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
  }

}
