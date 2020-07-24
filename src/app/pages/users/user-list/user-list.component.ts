import { Component, ContentChild, ContentChildren, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../../api/dashboard/model/user';
import { DashboardApiService } from '../../../services/dashboard-api/dashboard-api.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'jupiter-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  @ViewChild('actionTpl', {static: true}) public actionTpl: TemplateRef<any>;
  @ViewChild('roleTpl', {static: true}) public roleTpl: TemplateRef<any>;
  @ViewChild('tokenTpl', {static: true}) public tokenTpl: TemplateRef<any>;

  columns = [];
  data: Array<User> = [];

  constructor(private dashboardApiService: DashboardApiService, public userService: UserService, public jwtHelperService: JwtHelperService) {
  }

  ngOnInit() {
    this.columns = [
      // {prop: 'Id', maxWidth: 30},
      // {prop: 'Name', maxWidth: 100},
      // {prop: 'Email', maxWidth: 300},
      // {
      //   prop: 'Role',
      //   maxWidth: 100,
      //   cellTemplate: this.roleTpl,
      // },
      {prop: 'Id', maxWidth: 30},
      {prop: 'Name'},
      {prop: 'Email'},
      {
        prop: 'Role',
        cellTemplate: this.roleTpl,
      },
      {
        prop: 'ApiToken',
        maxWidth: 200,
        cellTemplate: this.tokenTpl,
      },
      // {
      //   name: 'Actions',
      //   maxWidth: 100,
      //   cellTemplate: this.actionTpl,
      // },
    ];

    this.refreshUserList();
  }

  refreshUserList() {
    this.dashboardApiService.getAllUsers().subscribe(userList => {
      this.data = userList;
    }, error => {
      console.error(error);
    });
  }

  generateToken(user: User) {
    this.dashboardApiService.createJupiterApiToken(user).subscribe(result => {
      // Force the refresh in order to get the new user with the token if it's the same logged in
      this.userService.refreshToken().subscribe(resultRefresh => {

      });
      this.refreshUserList();
    }, error => {
      console.error(error);
    });
  }

  deleteToken(user: User) {
    this.dashboardApiService.deleteJupiterApiToken(user).subscribe(result => {
      // Force the refresh in order to get the new user with the token if it's the same logged in
      this.userService.refreshToken().subscribe(resultRefresh => {

      });
      this.refreshUserList();
    }, error => {
      console.error(error);
    });
  }

  copyTokenToClipboard(token: string) {
    token = `Authorization: Bearer ${token}`;

    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (token));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  getJsonObject(object: any): string {
    return JSON.stringify(object, null, 2);
  }

}
