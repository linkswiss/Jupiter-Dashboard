import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppConfigService } from '../../../../services/app-config/app-config.service';
import { DashboardApiService } from '../../../../services/dashboard-api/dashboard-api.service';

@Component({
  selector: 'jupiter-sabre-session-pool',
  templateUrl: './sabre-session-pool.component.html',
  styleUrls: ['./sabre-session-pool.component.scss']
})
export class SabreSessionPoolComponent implements OnInit {
  @Input() showHeader = true;

  @ViewChild('sabreSessionActionsTpl', {static: true}) public sabreSessionActionsTpl: TemplateRef<any>;
  @ViewChild('environmentTpl', {static: true}) public environmentTpl: TemplateRef<any>;
  @ViewChild('sessionTypeTpl', {static: true}) public sessionTypeTpl: TemplateRef<any>;
  @ViewChild('sessionStatusTpl', {static: true}) public sessionStatusTpl: TemplateRef<any>;
  @ViewChild('copyToClipboardTpl', {static: true}) public copyToClipboardTpl: TemplateRef<any>;

  sabreGdsSessionsColumns = [];
  sabreGdsSessionsData: Array<any> = [];
  sabreGdsSessionsDefaultSort = [];

  constructor(public appConfigService: AppConfigService, private dashboardApiService: DashboardApiService) { }

  ngOnInit() {

    this.sabreGdsSessionsColumns = [
      {prop: 'Actions', maxWidth: 100, cellTemplate: this.sabreSessionActionsTpl},
      {prop: 'Id', cellTemplate: this.copyToClipboardTpl},
      {prop: 'Environment', cellTemplate: this.environmentTpl},
      {prop: 'Type', cellTemplate: this.sessionTypeTpl},
      {prop: 'Status', cellTemplate: this.sessionStatusTpl},
      {prop: 'BinarySecurityToken', name: 'Security Token', cellTemplate: this.copyToClipboardTpl},
      {prop: 'LastCallUtc'},
    ];

    this.sabreGdsSessionsDefaultSort = [
      {
        prop: 'LastCallUtc',
        dir: 'desc'
      }
    ];

    this.sabreGetAllSessions();
  }


  sabreGetAllSessions() {
    this.dashboardApiService.sabreGetAllSessions().subscribe(sabreSessions => {
      this.sabreGdsSessionsData = sabreSessions;
    }, error => {
      console.error(error);
    });
  }

  sabreDeleteSession(sabreGdsSession: any) {
    this.dashboardApiService.sabreDeleteSession(sabreGdsSession.Id).subscribe(sabreSessions => {
      this.sabreGdsSessionsData = sabreSessions;
    }, error => {
      console.error(error);
    });
  }

  sabreRefreshSessionsPool() {
    this.dashboardApiService.sabreRefreshSessionsPool().subscribe(sabreSessions => {
      this.sabreGdsSessionsData = sabreSessions;
    }, error => {
      console.error(error);
    });
  }

  copyToClipboard(value: string) {

    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (value));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }
}
