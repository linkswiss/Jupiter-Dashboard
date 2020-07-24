import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppConfigService } from '../../../services/app-config/app-config.service';
import { DashboardApiService } from '../../../services/dashboard-api/dashboard-api.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'jupiter-sabre',
  templateUrl: './sabre.component.html',
  styleUrls: ['./sabre.component.scss']
})
export class SabreComponent implements OnInit {
  constructor() { }

  ngOnInit() {}
}
