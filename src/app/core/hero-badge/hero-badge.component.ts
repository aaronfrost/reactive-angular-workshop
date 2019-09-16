import { Component, Input, OnInit } from '@angular/core';

export const Layouts = {
    portrait: 'portrait',
    standard: 'standard',
    landscape: 'landscape',
};

export const Sizes = {
    small: 'small',
    medium: 'medium',
    large: 'large',
    xlarge: 'xlarge',
};

@Component({
    selector: 'rx-hero-badge',
    template: `
        <ng-container *ngIf="hero">
            <div>
                <img
                    [src]="
                        hero.thumbnail.path +
                        '/' +
                        layout +
                        '_' +
                        size +
                        '.' +
                        hero.thumbnail.extension
                    "
                    (load)="loaded = true"
                />
                <div class="name">{{ hero.name }}</div>
            </div>
        </ng-container>
    `,
    styles: [
        `
            :host {
                display: flex;
                flex-direction: column;
                height: 140px;
                width: 100px;
                transition: opacity 250ms linear, transform 100ms linear;
                transform: scale(1);
            }
            :host:not(.loaded) {
                opacity: 0;
            }
            :host.loaded {
                opacity: 1;
            }
            :host:hover {
                transform: scale(1.05);
            }
        `,
    ],
    host: {
        '[class.loaded]': 'loaded',
    },
})
export class HeroBadgeComponent implements OnInit {
    @Input() hero = null;
    @Input() layout = Layouts.standard;
    @Input() size = Sizes.medium;
    loaded = false;

    constructor() {}

    ngOnInit() {}
}
