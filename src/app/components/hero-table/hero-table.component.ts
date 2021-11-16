import { Component, OnInit } from '@angular/core';
import { Hero, HeroService } from '../../services/hero.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'rx-hero-table',
    templateUrl: './hero-table.component.html',
    styleUrls: ['./hero-table.component.scss'],
})
export class HeroTableComponent {
    vm$ = combineLatest([
        this.hero.heroes$,
        this.hero.search$,
        this.hero.page$,
        this.hero.limit$,
        this.hero.totalPages$,
        this.hero.totalHeroes$,
    ]).pipe(
        map(([heroes, search, page, limit, totalPages, totalHeroes]) => {
            return {
                heroes,
                search,
                page,
                limit,
                userPage: page + 1,
                totalPages,
                totalHeroes,
                disablePrev: page === 0,
                disableNext: page + 1 === totalPages,
                limits: this.hero.limits,
            };
        }),
    );

    constructor(public hero: HeroService) {}
    movePageBy(moveBy: number) {
        this.hero.movePageBy(moveBy);
    }
    setLimit(limit: number) {
        this.hero.setLimit(limit);
    }
    doSearch(term: string) {
        this.hero.doSearch(term);
    }
}
