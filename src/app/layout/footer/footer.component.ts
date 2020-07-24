import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '../../services/app-config/app-config.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'jupiter-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public appConfigService: AppConfigService) {


  }

  ngOnInit() {
  }

}
