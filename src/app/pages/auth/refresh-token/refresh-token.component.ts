import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'app-refresh-token',
  template: ``,
})
export class RefreshTokenComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.refreshToken().subscribe(done => {
      this.router.navigate(['/']);
    });
  }

}
