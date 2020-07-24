import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { ThemeModule } from '../../@theme/theme.module';
import { LayoutModule } from '../../layout/layout.module';
import { MiscellaneousComponent } from './miscellaneous.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [
    RouterModule,
    LayoutModule,
  ],
  declarations: [
    MiscellaneousComponent,
    NotFoundComponent,
  ],
})
export class MiscellaneousModule { }
