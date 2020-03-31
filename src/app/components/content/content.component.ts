import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'rx-content',
    template: `
        <router-outlet></router-outlet>
    `,
    styles: [
        `
            :host {
                flex-grow: 1;
                max-height: calc(100vh - 200px);
                overflow: auto;
                padding: 40px;
                background-color: var(--backcolor2);
            }
        `,
    ],
})
export class ContentComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
