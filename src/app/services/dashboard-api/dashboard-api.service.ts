import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../app-config/app-config.service';
import {
  CacheEntry,
  PublishedRoute,
  SabreClient, SabreGdsSessionCustomData,
  SampleRequest, SampleRequestClient,
  User,
  UsersClient,
  UtilityClient
} from "./dashboard-api-client";
import {UserService} from "../user/user.service";
import {FlightClient, JupiterFlightBookRQ, JupiterFlightBookRS} from "../jupiter-api/jupiter-api-client";

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {

  constructor(private appConfigService: AppConfigService, private httpClient: HttpClient, private userService: UserService) {
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

  getAllUsers(): Observable<Array<User>> {
    return new Observable(obs => {
      let usersClient = new UsersClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      usersClient.getAllUsers().then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  createJupiterApiToken(user: User): Observable<User> {
    return new Observable(obs => {
      let usersClient = new UsersClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      usersClient.getUser(user.Id).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  deleteJupiterApiToken(user: User): Observable<User> {
    return new Observable(obs => {
      let usersClient = new UsersClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      usersClient.deleteJupiterApiToken(user.Id).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  getPublishedRoutes(): Observable<Array<PublishedRoute>> {
    return new Observable(obs => {
      let utilityClient = new UtilityClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      utilityClient.getRoutes().then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  getJupiterApiRoutes(): Observable<Array<PublishedRoute>> {
    return new Observable(obs => {
      let utilityClient = new UtilityClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      utilityClient.getJupiterRoutes().then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  sabreGetAllSessions(): Observable<Array<SabreGdsSessionCustomData>> {
    return new Observable(obs => {
      let sabreClient = new SabreClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      sabreClient.getAllSessions().then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  sabreDeleteSession(id: string): Observable<Array<SabreGdsSessionCustomData>> {
    return new Observable(obs => {
      let sabreClient = new SabreClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      sabreClient.deleteSession(id).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  sabreRefreshSessionsPool(): Observable<Array<SabreGdsSessionCustomData>> {
    return new Observable(obs => {
      let sabreClient = new SabreClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      sabreClient.refreshSessionPool().then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  getCacheEntries(): Observable<Array<CacheEntry>> {
    return new Observable(obs => {
      let utilityClient = new UtilityClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      utilityClient.getCacheEntries().then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  clearCache(): Observable<Array<CacheEntry>> {
    return new Observable(obs => {
      let utilityClient = new UtilityClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      utilityClient.clearCache().then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  clearSingleCacheItem(cacheKey: string): Observable<Array<CacheEntry>> {
    return new Observable(obs => {
      let utilityClient = new UtilityClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      utilityClient.clearSingleCacheItem(cacheKey).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  saveSampleRequest(sampleRequest: SampleRequest): Observable<SampleRequest> {
    return new Observable(obs => {
      let sampleRequestClient = new SampleRequestClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      sampleRequestClient.saveSampleRequest(sampleRequest).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  deleteSampleRequest(sampleRequest: SampleRequest): Observable<SampleRequest> {
    return new Observable(obs => {
      let sampleRequestClient = new SampleRequestClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      sampleRequestClient.deleteSampleRequest(sampleRequest).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  getSampleRequests(sampleType: string): Observable<Array<SampleRequest>> {
    return new Observable(obs => {
      let sampleRequestClient = new SampleRequestClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      sampleRequestClient.getSampleRequests(sampleType).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  generateSampleRequests(sampleType: string): Observable<SampleRequest> {
    return new Observable(obs => {
      let sampleRequestClient = new SampleRequestClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      sampleRequestClient.generateSampleRequest(sampleType).then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  getAllSampleRequests(): Observable<Array<SampleRequest>> {
    return new Observable(obs => {
      let sampleRequestClient = new SampleRequestClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      sampleRequestClient.getAllSampleRequests().then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  downloadJupiterApiTypescriptClient() {
    return new Observable(obs => {
      let utilityClient = new UtilityClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      utilityClient.generateDashboardTypescriptClient().then(result => {
        this.downLoadFile(result.data, 'application/octet-stream', 'JupiterApiClient.ts');
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }

  getErrorLogs(): Observable<any> {
    return new Observable(obs => {
      let utilityClient = new UtilityClient({token: this.userService.currentUser.Token}, this.appConfigService.config.jupiterApi.baseApiUrl);

      utilityClient.getErrorLogs().then(result => {
        obs.next(result);
      }).catch(error => {
        console.log(error);
        obs.error(error);
      });
    });
  }
}
