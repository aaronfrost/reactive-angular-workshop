import { Component } from '@angular/core';

@Component({
    selector: 'rx-root',
    template: `
        <rx-header></rx-header>
        <rx-content></rx-content>
        <rx-footer></rx-footer>
    `,

    styles: [
        `
            :host {
                max-height: 100vh;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: stretch;
            }
        `,
    ],
})
export class AppComponent {}
