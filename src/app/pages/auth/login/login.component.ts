import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../api/dashboard/model/user';
import { UserAuthRQ } from '../../../api/dashboard/model/userAuthRQ';
import { AppConfigService } from '../../../services/app-config/app-config.service';
import { UserService } from '../../../services/user/user.service';
import { FormGroupTyped } from '../../../utility/form-group-typed';
import * as Store from 'electron-store';

//import Store = require('electron-store');

@Component({
  selector: 'jupiter-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroupTyped<UserAuthRQ>;
  errorMessage = '';
  apiName = '';

  constructor(public router: Router, public appConfigService: AppConfigService, private userService: UserService) {

    /*
    let endpoints = this.appConfigService.getEndpoints();

    if (endpoints.length === 0) {
      this.router.navigate(['/app/preferencies']);
    } else {
      this.appConfigService.loadDefaultEndpoint();
    }
    */

    this.appConfigService.getApiName().subscribe(apiName => {
      this.apiName = apiName;
    });

    this.loginForm = new FormGroupTyped<UserAuthRQ>({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, Validators.minLength(2), Validators.minLength(5)])
    });
  }

  ngOnInit() {
  }

  onSubmit() {

    let userAuthRQ: UserAuthRQ = this.loginForm.value;

    this.userService.login(userAuthRQ)
        .subscribe(users => {

          // console.log(user.refreshToken);
          // console.log('PageOk');
          // console.log(users);
          this.router.navigate(['/dashboard']);

        }, error => {
          // console.log('PageError');
          // console.error(error);
          this.errorMessage = error.error;
        });


    // const email: string = userAuthRQ.email;
    //
    // let apitoken = '';

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${apitoken}`,
    //   }),
    // };

    // this.httpClient.post<User>(this.appConfigService.config.dashboardApi.baseUrl + this.appConfigService.config.dashboardApi.methods.user.authenticatePath,
    //   userAuthRQ,
    //   httpOptions)

    // this.httpClient.post<User>(this.appConfigService.config.dashboardApi.methods.user.authenticate, userAuthRQ)
    //     .subscribe(user => {
    //
    //       console.log(user.refreshToken);
    //       console.log(user);
    //
    //     }, error => {
    //       // console.error(error);
    //         this.errorMessage = (error.error && error.error.message) ? error.error.message : 'Invalid Email or Password';
    //     });

    // this.userService.login(userAuthRQ)
    //     .subscribe(users => {
    //
    //       // console.log(user.refreshToken);
    //       // console.log('PageOk');
    //       // console.log(users);
    //       this.router.navigate('/dashboard');
    //
    //     }, error => {
    //       // console.log('PageError');
    //       // console.error(error);
    //       this.errorMessage = error.error;
    //     });



    // this.httpClient.get<User[]>(this.appConfigService.config.dashboardApi.methods.user.getAllUsers)
    //     .subscribe(users => {
    //
    //       // console.log(user.refreshToken);
    //       console.log(users);
    //
    //     }, error => {
    //       console.error(error);
    //       // this.errorMessage = (error.error && error.error.message) ? error.error.message : 'Invalid Email or Password';
    //     });

    // http.post<User>('https://localhost:5001/jupiter-dashboard-api/SampleData/WeatherForecasts', httpOptions).subscribe(result2 => {
    //   console.log(result2);
    //   this.forecasts = result2;
    // }, error => {
    //   console.error(error);
    // });

  }

}
