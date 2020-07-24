import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CacheEntry } from '../../api/dashboard/model/cacheEntry';
import { PublishedRoute } from '../../api/dashboard/model/publishedRoute';
import { SampleRequest } from '../../api/dashboard/model/sampleRequest';
import { User } from '../../api/dashboard/model/user';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {

  constructor(private appConfigService: AppConfigService, private httpClient: HttpClient) {
  }

  getAllUsers(): Observable<Array<User>> {
    return new Observable(obs => {

      this.httpClient.get<Array<User>>(this.appConfigService.config.dashboardApi.methods.user.getAllUsers)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  createJupiterApiToken(user: User): Observable<User> {
    return new Observable(obs => {
      let request = this.appConfigService.config.dashboardApi.methods.user.createJupiterApiToken.replace('{userId}', `${user.Id}`);

      this.httpClient.get<User>(request)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  deleteJupiterApiToken(user: User): Observable<User> {
    return new Observable(obs => {
      let request = this.appConfigService.config.dashboardApi.methods.user.deleteJupiterApiToken.replace('{userId}', `${user.Id}`);

      this.httpClient.get<User>(request)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  getPublishedRoutes(): Observable<Array<PublishedRoute>> {
    return new Observable(obs => {
      this.httpClient.get<Array<PublishedRoute>>(this.appConfigService.config.dashboardApi.methods.utility.getPublishedRoutes)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  sabreGetAllSessions(): Observable<Array<any>> {
    return new Observable(obs => {
      this.httpClient.get<Array<any>>(this.appConfigService.config.dashboardApi.methods.sabre.getAllSessions)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  sabreDeleteSession(id: string): Observable<Array<any>> {
    return new Observable(obs => {
      this.httpClient.get<Array<any>>(this.appConfigService.config.dashboardApi.methods.sabre.deleteSession.replace('{id}', id))
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  sabreRefreshSessionsPool(): Observable<Array<any>> {
    return new Observable(obs => {
      this.httpClient.get<Array<any>>(this.appConfigService.config.dashboardApi.methods.sabre.refreshSessionsPool)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  getCacheEntries(): Observable<Array<CacheEntry>> {
    return new Observable(obs => {
      this.httpClient.get<Array<CacheEntry>>(this.appConfigService.config.dashboardApi.methods.utility.getCacheEntries)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  clearCache(): Observable<Array<CacheEntry>> {
    return new Observable(obs => {
      this.httpClient.get<Array<CacheEntry>>(this.appConfigService.config.dashboardApi.methods.utility.clearCache)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  clearSingleCacheItem(cacheKey: string): Observable<Array<CacheEntry>> {
    return new Observable(obs => {
      this.httpClient.get<Array<CacheEntry>>(this.appConfigService.config.dashboardApi.methods.utility.clearSingleCacheItem.replace('{cacheKey}', cacheKey))
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  saveSampleRequest(sampleRequest: SampleRequest): Observable<SampleRequest> {
    return new Observable(obs => {
      this.httpClient.post<any>(this.appConfigService.config.dashboardApi.methods.sampleRequest.saveSamplesRequests, sampleRequest)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  deleteSampleRequest(sampleRequest: SampleRequest): Observable<SampleRequest> {
    return new Observable(obs => {
      this.httpClient.post<any>(this.appConfigService.config.dashboardApi.methods.sampleRequest.deleteSamplesRequests, sampleRequest)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  getSampleRequests(sampleType: string): Observable<Array<SampleRequest>> {
    return new Observable(obs => {
      this.httpClient.get<Array<any>>(this.appConfigService.config.dashboardApi.methods.sampleRequest.getSampleRequests.replace('{sampleType}', sampleType))
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }


  getAllSampleRequests(): Observable<Array<SampleRequest>> {
    return new Observable(obs => {
      this.httpClient.get<Array<any>>(this.appConfigService.config.dashboardApi.methods.sampleRequest.getAllSampleRequests)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }

  getErrorLogs(): Observable<any> {
    return new Observable(obs => {
      // let request = this.appConfigService.config.dashboardApi.methods.utility.getErrorLogs.replace('{userId}', `${user.Id}`);

      this.httpClient.get<any>(this.appConfigService.config.dashboardApi.methods.utility.getErrorLogs)
          .subscribe(result => {
              obs.next(result);
            },
            error => {
              console.log(error);
              obs.error(error);
            });
    });
  }
}
