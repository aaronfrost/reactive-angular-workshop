import { Component } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DEFAULT_PAGE, Hero, HeroService } from '../../services/hero.service';

@Component({
    selector: 'rx-hero-table',
    templateUrl: './hero-table.component.html',
    styleUrls: ['./hero-table.component.scss'],
})
export class HeroTableComponent {
    showSpinner = false;

    vm$ = combineLatest([
        this.hero.heroes$,
        this.hero.search$,
        this.hero.userPage$,
        this.hero.limit$,
        this.hero.totalResults$,
        this.hero.totalPages$,
        this.hero.loading$,
    ]).pipe(
        map(
            ([
                heroes,
                search,
                page,
                limit,
                totalResults,
                totalPages,
                loading,
            ]) => {
                return {
                    heroes,
                    search,
                    page,
                    limit,
                    totalResults,
                    totalPages,
                    loading,
                    disableNext: totalPages === page,
                    disablePrev: page === 1,
                };
            },
        ),
    );

    constructor(public hero: HeroService) {}

    doSearch(event: any) {
        this.hero.doSearch(event.target.value);
    }

    movePageBy(moveBy: number) {
        this.hero.movePageBy(moveBy);
    }

    setLimit(limit: number) {
        this.hero.setLimit(limit);
    }
}
