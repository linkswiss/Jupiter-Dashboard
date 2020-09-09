import {Component, OnInit} from '@angular/core';
import {NbDialogService, NbMenuItem, NbMenuService, NbSidebarService} from '@nebular/theme';
import {AppConfigService} from '../../services/app-config/app-config.service';
import {UserService} from '../../services/user/user.service';
import {JupiterApiService} from '../../services/jupiter-api/jupiter-api.service';
import {DialogMessageComponent} from '../../pages/test-api/common/components/dialog-message/dialog-message.component';
import {EH2HOperation} from '../../services/jupiter-api/jupiter-api-client';
import {DialogApiErrorComponent} from '../../pages/test-api/common/components/dialog-api-error/dialog-api-error.component';
import {HotelPagesService} from '../../pages/test-api/common/services/hotel-pages.service';

@Component({
  selector: 'jupiter-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userMenu: NbMenuItem[] = [
    {title: 'Log out', link: '/auth/logout'},
    {title: 'Refresh Token', link: '/auth/refresh-token'}
  ];
  loadingTypescript = false;
  loadingCSharp = false;

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              public userService: UserService,
              public appConfigService: AppConfigService,
              private jupiterApiService: JupiterApiService,
              private dialogService: NbDialogService
              // private analyticsService: AnalyticsService,
              // private authService: NbAuthService
  ) {
  }

  ngOnInit() {
    // this.userService.getUsers()
    //   .subscribe((users: any) => this.user = users.nick);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  downloadTypescriptClient() {
    this.loadingTypescript = true;
    this.jupiterApiService.downloadJupiterApiTypescriptClient().subscribe(response => {
      this.loadingTypescript = false;
      console.log('download completed');
    }, error => {
      this.loadingTypescript = false;
      console.error(error);
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'Download JupiterApi TypescriptClient Error',
          error: error
        },
      });
    });
  }

  downloadCSharpClient() {
    this.loadingCSharp = true;
    this.jupiterApiService.downloadJupiterApiCSharpClient().subscribe(response => {
      this.loadingCSharp = false;
      console.log('download completed');
    }, error => {
      this.loadingCSharp = false;
      console.error(error);
      this.dialogService.open(DialogApiErrorComponent, {
        context: {
          title: 'Download JupiterApi CSharpClient Error',
          error: error
        },
      });
    });
  }
}
