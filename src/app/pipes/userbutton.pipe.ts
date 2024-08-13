import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Pipe({

  name: 'UserButton'

})

export class UserButtonPipe implements PipeTransform {
    
    constructor(private authService: AuthService) { }
 
   transform(value: any): any {
    if (value==this.authService.getUserName())
    return value + " (ME)";
    else return value;


  }

}