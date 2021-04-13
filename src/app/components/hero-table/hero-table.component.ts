import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Hero, HeroService } from '../../services/hero.service';

@Component({
    selector: 'rx-hero-table',
    templateUrl: './hero-table.component.html',
    styleUrls: ['./hero-table.component.scss'],
})
export class HeroTableComponent {
    heroes$: Observable<Hero[]> = this.hero.heroes$;
    search$ = this.hero.searchBS;
    page$ = this.hero.userPage$;
    limit$ = this.hero.limitBS;
    totalResults$ = this.hero.totalResults$;
    totalPages$ = this.hero.totalPages$;

    constructor(public hero: HeroService) {}

    doSearch(event: any) {
        this.hero.searchBS.next(event.target.value);
    }

    movePageBy(moveBy: number) {
        const currentPage = this.hero.pageBS.getValue();
        this.hero.pageBS.next(currentPage + moveBy);
    }

    setLimit(limit: number) {
        this.hero.limitBS.next(limit);
    }
}
