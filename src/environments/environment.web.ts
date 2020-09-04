// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  jupiterPublishedApiVersion: ['1.0'],
  jupiterDefaultApiVersion: '1.0',
  jupiterDefaultDashboardApiVersion: '1.0-dashboard',
  jupiterBaseApiUrl: 'http://localhost:5000',
  // jupiterBaseApiUrl: '/',
  jupiterApiDocumentationPath: '/api_docs',

  jupiterDashboardApiPath: '/jupiter-dashboard-api',
  jupiterApiPath: '/jupiter-api',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
