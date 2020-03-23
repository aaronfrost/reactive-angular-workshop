import { Component } from '@angular/core';

@Component({
    selector: 'rx-header',
    template: `
        <h1 class="bungee">Welcome to {{ title }}!</h1>
    `,
    styles: [
        `
            :host {
                height: 100px;
                background: var(--header);
                text-align: center;
            }
            h1 {
                font-size: 33px;
            }
        `,
    ],
})
export class HeaderComponent {
    title = 'reactive-angular';
}
