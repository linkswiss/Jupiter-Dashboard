import { Component } from '@angular/core';

@Component({
  selector: 'jupiter-auth',
  template: `
    <jupiter-layout-empty>
      <router-outlet></router-outlet>
    </jupiter-layout-empty>
  `,
})
export class AuthComponent {
}
