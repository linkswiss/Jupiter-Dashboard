import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppConfigService} from '../app-config/app-config.service';
import {UserService} from '../user/user.service';
import {
  DestinationClient,
  FlightClient,
  HotelClient,
  JupiterFlightAvailabilityRQ,
  JupiterFlightAvailabilityRS,
  JupiterCrypticRQ,
  JupiterCrypticRS,
  JupiterFlightDetailRQ,
  JupiterFlightDetailRS,
  JupiterFlightPnrRetrieveRQ,
  JupiterFlightPnrRetrieveRS,
  JupiterHotelBookCancelRQ,
  JupiterHotelBookCancelRS,
  JupiterHotelBookDetailRQ,
  JupiterHotelBookDetailRS,
  JupiterHotelBookSearchRQ,
  JupiterHotelBookSearchRS,
  JupiterHotelCalendarAvailabilityRQ,
  JupiterHotelCalendarAvailabilityRS,
  JupiterHotelDetailRQ,
  JupiterHotelDetailRS,
  JupiterSingleHotelAvailabilityRQ,
  JupiterSingleHotelAvailabilityRS,
  SessionAndCrypticClient,
  UtilityClient,
  JupiterHotelBookRQ,
  JupiterHotelBookRS,
  JupiterHotelAvailabilityExtrasRQ,
  JupiterHotelAvailabilityExtrasRS,
  JupiterHotelPriceVerifyRQ,
  JupiterHotelPriceVerifyRS,
  JupiterHotelAvailabilityRQ,
  JupiterHotelAvailabilityRS,
  JupiterFlightBookRQ,
  JupiterFlightBookRS,
  JupiterTrainAvailabilityRQ,
  JupiterTrainAvailabilityRS,
  TrainClient,
} from './jupiter-api-client';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class JupiterApiService {
  constructor(private appConfigService: AppConfigService, private userService: UserService, private httpClient: HttpClient) {
  }

  private getJupiterApiTokenHttpOptions(): any {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.userService.currentUser.ApiToken}`,
      }),
    };
    return httpOptions;
  }

  testApiPost(method: string, requestJson: any): Observable<any> {
    let isFileDownload = false;
    let filename = 'File.txt';

    switch (method) {
      case this.appConfigService.config.jupiterApi.methods.utility.generateTypescriptClient:
        isFileDownload = true;
        filename = 'ApiClient.ts';
        break;
      case this.appConfigService.config.jupiterApi.methods.utility.generateCSharpClient:
        isFileDownload = true;
        filename = 'ApiClient.cs';
        break;
    }

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    if (isFileDownload) {
      httpOptions['responseType'] = 'arraybuffer';
    }

    return new Observable(obs => {
      this.httpClient.post<any>(method, requestJson, httpOptions).subscribe(result => {
          if (isFileDownload) {
            this.downLoadFile(result, 'application/octet-stream', filename);
          }
          obs.next(result);
        },
        error => {
          console.log(error);
          obs.error(error);
        });
    });
  }

  testApiGet(method: string): Observable<any> {
    return new Observable(obs => {
      this.httpClient.get<any>(method).subscribe(result => {
          obs.next(result);
        },
        error => {
          console.log(error);
          obs.error(error);
        });
    });
  }

  private getClientMethods(object): Array<string> {
    let props = [];
    do {
      const l = Object.getOwnPropertyNames(object)
        .concat(Object.getOwnPropertySymbols(object).map(s => s.toString()))
        .sort()
        .filter((p, i, arr) =>
          typeof object[p] === 'function' &&  // only the methods
          p !== 'constructor' &&           // not the constructor
          (i === 0 || p !== arr[i - 1]) &&  // not overriding in this prototype
          props.indexOf(p) === -1          // not overridden in a child
        );
      props = props.concat(l);
    }
    while (
      (object = Object.getPrototypeOf(object)) &&   // walk-up the prototype chain
      Object.getPrototypeOf(object)              // not the the Object prototype methods (hasOwnProperty, etc...)
      );

    // filter out normal client added operations
    props = _.filter(props, function (p) {
      return p !== 'transformOptions' && !p.startsWith('process');
    });

    return props;
  }

  getTestMethods() {
    let destinationClient = new DestinationClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);
    let flightClient = new FlightClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);
    let hotelClient = new HotelClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);
    let utilityClient = new UtilityClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

    return {
      'Destination': this.getClientMethods(destinationClient),
      'Flight': this.getClientMethods(flightClient),
      'Hotel': this.getClientMethods(hotelClient),
      'Utility': this.getClientMethods(utilityClient),
    };
  }

  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: any, type: string, fileName: string) {
    let blob = new Blob([data], {type: type});
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    // a.style = "display: none";
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    // let pwa = window.open(url);
    // if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
    //   alert('Please disable your Pop-up blocker and try again.');
    // }
  }

  downloadJupiterApiTypescriptClient() {
    return new Observable(obs => {
      let utilityClient = new UtilityClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      utilityClient.generateJupiterTypescriptClient().then(result => {
        this.downLoadFile(result.data, 'application/octet-stream', 'JupiterApiClient.ts');
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  downloadJupiterApiCSharpClient() {
    return new Observable(obs => {
      let utilityClient = new UtilityClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      utilityClient.generateJupiterCSharpClient().then(result => {
        this.downLoadFile(result.data, 'application/octet-stream', 'JupiterApiClient.cs');
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  cryptic(jupiterFlightCrypticRQ: JupiterCrypticRQ): Observable<JupiterCrypticRS> {
    return new Observable(obs => {
      let sessionAndCrypticClient = new SessionAndCrypticClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      sessionAndCrypticClient.cryptic(jupiterFlightCrypticRQ).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });

      // this.httpClient.post<any>(this.appConfigService.config.jupiterApi.methods.flight.cryptic, jupiterFlightCrypticRQ, this.getJupiterApiTokenHttpOptions()).subscribe(result => {
      // this.httpClient.post<JupiterFlightCrypticRs>(this.appConfigService.config.jupiterApi.methods.flight.cryptic, jupiterFlightCrypticRQ).subscribe(result => {
      //     obs.next(result);
      //   },
      //   error => {
      //     console.log(error);
      //     obs.error(error);
      //   });
    });
  }

  flightAvailability(jupiterFlightAvailabilityRq: JupiterFlightAvailabilityRQ): Observable<JupiterFlightAvailabilityRS> {
    return new Observable(obs => {
      let flightClient = new FlightClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      flightClient.flightAvail(jupiterFlightAvailabilityRq).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });

      // this.httpClient.post<JupiterFlightAvailabilityRS>(this.appConfigService.config.jupiterApi.methods.flight.avail, jupiterFlightAvailabilityRq).subscribe(result => {
      //     obs.next(result);
      //   },
      //   error => {
      //     console.log(error);
      //     obs.error(error);
      //   });
    });
  }

  flightDetails(jupiterFlightDetailRQ: JupiterFlightDetailRQ): Observable<JupiterFlightDetailRS> {
    return new Observable(obs => {
      let flightClient = new FlightClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      flightClient.flightDetails(jupiterFlightDetailRQ).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  flightBook(jupiterFlightBookRQ: JupiterFlightBookRQ): Observable<JupiterFlightBookRS> {
    return new Observable(obs => {
      let flightClient = new FlightClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      flightClient.flightBook(jupiterFlightBookRQ).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  flightPnrRetrieve(jupiterFlightPnrRetrieveRQ: JupiterFlightPnrRetrieveRQ): Observable<JupiterFlightPnrRetrieveRS> {
    return new Observable(obs => {
      let flightClient = new FlightClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      flightClient.flightPnrRetrieve(jupiterFlightPnrRetrieveRQ).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  hotelAvailability(jupiterHotelAvailabilityRq: JupiterHotelAvailabilityRQ): Observable<JupiterHotelAvailabilityRS> {
    return new Observable(obs => {
      let hotelClient = new HotelClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      hotelClient.avail(jupiterHotelAvailabilityRq).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  hotelSingleAvailability(jupiterSingleHotelAvailabilityRq: JupiterSingleHotelAvailabilityRQ): Observable<JupiterSingleHotelAvailabilityRS> {
    return new Observable(obs => {
      let hotelClient = new HotelClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      hotelClient.singleHotelAvail(jupiterSingleHotelAvailabilityRq).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  hotelCalendarAvailability(jupiterHotelCalendarAvailabilityRq: JupiterHotelCalendarAvailabilityRQ): Observable<JupiterHotelCalendarAvailabilityRS> {
    return new Observable(obs => {
      let hotelClient = new HotelClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      hotelClient.calendarHotelAvail(jupiterHotelCalendarAvailabilityRq).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  hotelExtrasAvailability(jupiterHotelAvailabilityExtrasRQ: JupiterHotelAvailabilityExtrasRQ): Observable<JupiterHotelAvailabilityExtrasRS> {
    return new Observable(obs => {
      let hotelClient = new HotelClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      hotelClient.extrasHotelAvail(jupiterHotelAvailabilityExtrasRQ).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  hotelDetails(jupiterHotelDetailRQ: JupiterHotelDetailRQ): Observable<JupiterHotelDetailRS> {
    return new Observable(obs => {
      let hotelClient = new HotelClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      hotelClient.hotelDetails(jupiterHotelDetailRQ).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  hotelBook(jupiterHotelBookRQ: JupiterHotelBookRQ): Observable<JupiterHotelBookRS> {
    return new Observable(obs => {
      let hotelClient = new HotelClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      hotelClient.hotelBook(jupiterHotelBookRQ).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  hotelBookSearch(jupiterHotelBookSearchRQ: JupiterHotelBookSearchRQ): Observable<JupiterHotelBookSearchRS> {
    return new Observable(obs => {
      let hotelClient = new HotelClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      hotelClient.hotelBookSearch(jupiterHotelBookSearchRQ).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  hotelBookDetails(jupiterHotelBookDetailRQ: JupiterHotelBookDetailRQ): Observable<JupiterHotelBookDetailRS> {
    return new Observable(obs => {
      let hotelClient = new HotelClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      hotelClient.hotelBookDetails(jupiterHotelBookDetailRQ).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  hotelBookCancel(jupiterHotelBookCancelRQ: JupiterHotelBookCancelRQ): Observable<JupiterHotelBookCancelRS> {
    return new Observable(obs => {
      let hotelClient = new HotelClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      hotelClient.hotelBookCancel(jupiterHotelBookCancelRQ).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  hotelPriceVerify(jupiterHotelPriceVerifyRq: JupiterHotelPriceVerifyRQ): Observable<JupiterHotelPriceVerifyRS> {
    return new Observable(obs => {
      let hotelClient = new HotelClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      hotelClient.priceVerify(jupiterHotelPriceVerifyRq).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  trainAvailability(jupiterTrainAvailabilityRq: JupiterTrainAvailabilityRQ): Observable<JupiterTrainAvailabilityRS> {
    return new Observable(obs => {
      let trainClient = new TrainClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      trainClient.avail(jupiterTrainAvailabilityRq).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });

      // this.httpClient.post<JupiterFlightAvailabilityRS>(this.appConfigService.config.jupiterApi.methods.flight.avail, jupiterFlightAvailabilityRq).subscribe(result => {
      //     obs.next(result);
      //   },
      //   error => {
      //     console.log(error);
      //     obs.error(error);
      //   });
    });
  }
}
