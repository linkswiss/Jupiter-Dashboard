import {Component} from '@angular/core';
import {NbMenuItem} from '@nebular/theme';
import {AppConfigService} from '../services/app-config/app-config.service';
import {UserService} from '../services/user/user.service';
import {EH2HConnectorCode} from '../services/jupiter-api/jupiter-api-client';
import {ERole} from "../services/dashboard-api/dashboard-api-client";

@Component({
  selector: 'jupiter-menu',
  template: `
    <nb-menu [items]="menu"></nb-menu>
  `,
})
export class MenuComponent {
  menu: Array<NbMenuItem> = [];

  constructor(private userService: UserService, private appConfigService: AppConfigService) {
    // this.appConfigService.getJupiterRemoteAppSettings().subscribe(result => {
    // let isSabre = this.appConfigService.isEnabledConnector('SABRE');
    // let isAmadeus = this.appConfigService.isEnabledConnector('AMADEUS');
    // console.log(isSabre);
    // console.log(isAmadeus);

    this.menu = [
      {
        title: 'Dashboard',
        icon: 'fa-tachometer-alt',
        link: '/dashboard',
        home: true,
      },
      {
        title: 'Api Documentation',
        icon: 'fa-book',
        link: '/api-documentation',
      },
    ];

    if (this.userService.isRole(ERole.ADMIN)) {
      // TESTER
      this.menu.push(
        {
          title: 'JUPITER API',
          group: true,
        },
        {
          title: 'Api Test',
          icon: 'fa-cloud',
          link: '/test-api',
        },
      );

      if (this.appConfigService.isAnyFlightConnectorEnabled()) {
        this.menu.push({
          title: 'Flight',
          icon: 'fa-plane-departure',
          children: [
            {
              title: 'Flight Avail',
              icon: 'fa-plane-departure',
              link: '/flight-search',
            },
            {
              title: 'Flight Pnr Retrieve',
              icon: 'fa-passport',
              link: '/flight-pnr-retrieve',
            },
            {
              title: 'Flight Queue List',
              icon: 'fa-list-alt',
              link: '/flight-queue-list',
            },
          ],
        });
      }

      if (this.appConfigService.isAnyHotelConnectorEnabled()) {
        this.menu.push({
          title: 'Hotels',
          icon: 'fa-hotel',
          children: [
            {
              title: 'Hotel Detail',
              icon: 'fa-info-circle',
              link: '/hotel-detail',
            },
            {
              title: 'Calendar Hotel Avail',
              icon: 'fa-calendar',
              link: '/hotel-calendar-avail',
            },
            {
              title: 'Hotels Avail',
              icon: 'fa-city',
              link: '/hotel-avail',
            },
            {
              title: 'Single Hotel Avail',
              icon: 'fa-hotel',
              link: '/hotel-single-avail',
            },
            {
              title: 'Extras Hotel Avail',
              icon: 'fa-cocktail',
              link: '/hotel-extras-avail',
            },
            {
              title: 'Hotel Price Verify',
              icon: 'fa-hotel',
              link: '/hotel-price-verify',
            },
            // {
            //   title: 'Hotel Book',
            //   icon: 'fa-hotel',
            //   link: '/hotel-book',
            // },
            {
              title: 'Hotel Book Search',
              icon: 'fa-list',
              link: '/hotel-book-search',
            },
            {
              title: 'Hotel Book Detail',
              icon: 'fa-id-card',
              link: '/hotel-book-detail',
            },
          ],
        });
      }

      if (this.appConfigService.isAnyTrainConnectorEnabled()) {
        this.menu.push(
          {
            title: 'Trains',
            icon: 'fa-train',
            children: [
              {
                title: 'Train Avail',
                icon: 'fa-train',
                link: '/train-avail',
              }
            ]
          },
        );
      }

      if (this.appConfigService.isAnyCarConnectorEnabled()) {
        this.menu.push({
          title: 'Cars',
          icon: 'fa-car',
          children: [
            {
              title: 'Cars Avail',
              icon: 'fa-car',
              link: '/car-avail',
            },
            // {
            //   title: 'Car Book',
            //   icon: 'fa-clipboard-check',
            //   link: '/hotel-book',
            // },
            {
              title: 'Car Book Detail',
              icon: 'fa-id-card',
              link: '/car-book-detail',
            },
          ],
        });
      }

      if (this.appConfigService.isAnyCrypticConnectorEnabled()) {
        this.menu.push(
          {
            title: 'GDS Cryptic',
            icon: 'fa-terminal',
            link: '/gds-cryptic',
          },
        );
      }

      // CONNECTORS
      // if (this.appConfigService.isEnabledConnector(EH2HConnectorCode.SABRE) || this.appConfigService.isEnabledConnector(EH2HConnectorCode.AMADEUS)) {
        this.menu.push(
          {
            title: 'CONNECTORS',
            group: true,
          },
        );

        if (this.appConfigService.isEnabledConnector(EH2HConnectorCode.AMADEUS)) {
          this.menu.push(
            {
              title: 'Amadeus',
              icon: 'fa-network-wired',
              link: '/connector/amadeus',
            },
          );
        }

        if (this.appConfigService.isEnabledConnector(EH2HConnectorCode.SABRE)) {
          this.menu.push(
            {
              title: 'Sabre',
              icon: 'fa-network-wired',
              link: '/connector/sabre',
            },
          );
        }
      // }
      // END CONNECTORS


      // ADMIN

      this.menu.push(
        {
          title: 'ADMIN',
          group: true,
        },
        {
          title: 'Users',
          icon: 'fa-user-friends',
          link: '/admin/user-list',
        },
        {
          title: 'Settings',
          icon: 'fa-cogs',
          link: '/admin/settings',
        },
        {
          title: 'Documentation',
          icon: 'fa-book',
          children: [
            {
              title: 'Dashboard Api Documentation',
              link: '/admin/dashboard-api-documentation',
            },
            {
              title: 'Dashboard Models Documentation',
              link: '/admin/dashboard-models-documentation',
            },
            {
              title: 'Api Models Documentation',
              link: '/admin/api-models-documentation',
            },
          ],
        },
        // {
        //   title: 'Kibana',
        //   icon: 'fa-tachometer-alt',
        //   children: [
        //     {
        //       title: 'Logs Dashboard',
        //       link: '/admin/kibana-logs',
        //     },
        //     {
        //       title: 'Kibana',
        //       link: '/admin/kibana',
        //       // url: this.appConfigService.jupiterRemoteAppSettings.ElasticSearchSettings.KibanaUrl,
        //       // target: '_blank'
        //     },
        //   ],
        // },
      );

      // END ADMIN


      // this.menu.push({
      //   title: 'ADMIN',
      //   icon: 'fas fa-user-shield',
      //   children: [
      //     {
      //       title: 'Users',
      //       icon: 'fas fa-user-friends',
      //       link: '/admin/user-list',
      //     },
      //     {
      //       title: 'Settings & Debug',
      //       icon: 'fas fa-cogs',
      //       link: '/admin/settings',
      //     },
      //     {
      //       title: 'Dashboard Api Documentation',
      //       icon: 'fas fa-book',
      //       link: '/admin/dashboard-api-documentation',
      //     },
      //     {
      //       title: 'Kibana',
      //       icon: 'fas fa-tachometer-alt',
      //       link: '/admin/kibana',
      //     },
      //     {
      //       title: 'Kibana Logs',
      //       icon: 'fas fa-file-code',
      //       link: '/admin/kibana-logs',
      //     },
      //     // {
      //     //   title: 'Logs',
      //     //   icon: 'fas fa-file-code',
      //     //   link: '/admin/logs',
      //     // },
      //   ],
      // });
    }

    // });
  }
}
