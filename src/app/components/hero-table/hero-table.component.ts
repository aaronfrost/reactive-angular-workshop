import { Component, OnInit } from '@angular/core';
import { Hero, HeroService } from '../../services/hero.service';

@Component({
    selector: 'rx-hero-table',
    templateUrl: './hero-table.component.html',
    styleUrls: ['./hero-table.component.scss'],
})
export class HeroTableComponent implements OnInit {
    heroes: Hero[];

    constructor(public hero: HeroService) {
        hero.heroes$.subscribe(heroes => {
            this.heroes = heroes;
        });
    }

    ngOnInit() {}
}
