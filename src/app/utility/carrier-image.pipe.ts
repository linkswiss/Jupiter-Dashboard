import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'carrierImage'
})
export class CarrierImagePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // return '/assets/images/carriers/' + value + '.png';
    return 'https://s3-eu-west-1.amazonaws.com/weellgo-drive/SYSTEM/CARRIERS/48/' + value + '.png';
  }

}
