import { Component, OnInit } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'jupiter-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private iconLibraries: NbIconLibraries) {
    this.iconLibraries.registerFontPack('nebular', { iconClassPrefix: 'nb' });
    // this.iconLibraries.registerFontPack('fontawesome', { iconClassPrefix: 'fas' });
    this.iconLibraries.registerFontPack('fontawesome', { packClass: 'fas' });
    this.iconLibraries.setDefaultPack('fontawesome');
  }

  ngOnInit() {
  }

}
