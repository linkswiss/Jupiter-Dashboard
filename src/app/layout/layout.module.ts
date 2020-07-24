import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbMomentDateModule } from '@nebular/moment';
import {
  NbAccordionModule,
  NbActionsModule,
  NbAlertModule,
  NbBadgeModule,
  NbButtonModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepicker,
  NbDatepickerModule,
  NbDialogModule,
  NbIconLibraries,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbPopoverModule,
  NbProgressBarModule,
  NbRadioModule,
  NbRouteTabsetModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbStepperModule,
  NbTabsetModule,
  NbThemeModule,
  NbToastrModule,
  NbTooltipModule,
  NbUserModule,
  NbWindowModule,
} from '@nebular/theme';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MomentModule } from 'ngx-moment';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutComponent } from './layout/layout.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutEmptyComponent } from './layout-empty/layout-empty.component';

const BASE_MODULES = [CommonModule, FormsModule, ReactiveFormsModule];

const NB_MODULES = [
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbContextMenuModule,
  NgbModule,
  // NbSecurityModule, // *nbIsGranted directive,
  NbProgressBarModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbStepperModule,
  NbButtonModule,
  NbListModule,
  NbToastrModule,
  NbInputModule,
  NbAccordionModule,
  NbDialogModule,
  NbWindowModule,
  NbAlertModule,
  NbSpinnerModule,
  NbRadioModule,
  NbSelectModule,
  NbTooltipModule,
  NbBadgeModule,
  NbDatepickerModule,
  NbEvaIconsModule,
  NbIconModule,
  NgxDatatableModule,
  MomentModule,
  VirtualScrollModule
];

const PIPES = [
  // CapitalizePipe,
  // PluralPipe,
  // RoundPipe,
  // TimingPipe,
  // NumberWithCommasPipe,
  // EvaIconsPipe,
];

const COMPONENTS = [
  HeaderComponent,
  LayoutComponent,
  LayoutEmptyComponent,
  FooterComponent,
];

const NB_THEME_PROVIDERS = [
  ...NbThemeModule.forRoot(
    {
      name: 'default',
    }
  ).providers,
  ...NbSidebarModule.forRoot().providers,
  ...NbMenuModule.forRoot().providers,
  ...NbDialogModule.forRoot().providers,
  ...NbWindowModule.forRoot().providers,
  ...NbToastrModule.forRoot().providers,
];

@NgModule({
  imports: [...BASE_MODULES, ...NB_MODULES],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES],
})

export class LayoutModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: LayoutModule,
      providers: [...NB_THEME_PROVIDERS],
    };
  }
}

// @NgModule({
//   declarations: [HeaderComponent],
//   imports: [
//     CommonModule,
//     NbLayoutModule,
//     NbActionsModule
//   ],
//   exports: [HeaderComponent]
// })
// export class LayoutModule { }
