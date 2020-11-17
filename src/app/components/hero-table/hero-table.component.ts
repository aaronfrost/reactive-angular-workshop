import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Hero, HeroService } from '../../services/hero.service';

@Component({
    selector: 'rx-hero-table',
    templateUrl: './hero-table.component.html',
    styleUrls: ['./hero-table.component.scss'],
})
export class HeroTableComponent {
    disablePrevious$ = this.hero.page$.pipe(map(page => page <= 0));
    disableNext$ = combineLatest([this.hero.totalPages$, this.hero.page$]).pipe(
        map(([totalPages, page]) => page >= totalPages - 1),
    );

    vm$ = combineLatest([
        this.hero.heroes$,
        this.hero.search$,
        this.hero.userPage$,
        this.hero.totalPages$,
        this.disablePrevious$,
        this.disableNext$,
        this.hero.limit$,
        this.hero.total$,
    ]).pipe(
        map(
            ([
                heroes,
                search,
                userPage,
                totalPages,
                disablePrevious,
                disableNext,
                limit,
                total,
            ]) => ({
                heroes,
                search,
                userPage,
                totalPages,
                disablePrevious,
                disableNext,
                limit,
                total,
            }),
        ),
    );

    constructor(public hero: HeroService) {}
}
