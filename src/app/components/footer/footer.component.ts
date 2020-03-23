import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'rx-footer',
    template: `
        <span>Reactive Angular</span>
        <span class="spacer"> - </span>
        <span>@aaronfrost</span>
    `,
    styles: [
        `
            :host {
                height: 100px;
                background: var(--header-dark);
                color: whitesmoke;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                font-size: 25px;
                font-weight: 100;
            }
            .spacer {
                margin: 0px 10px;
            }
        `,
    ],
})
export class FooterComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
