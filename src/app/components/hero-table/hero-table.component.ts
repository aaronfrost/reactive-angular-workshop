import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { debounceTime, map, withLatestFrom } from 'rxjs/operators';
import { HeroService } from '../../services/hero.service';

@Component({
    selector: 'rx-hero-table',
    template: `
        <ng-container *ngIf="vm$ | async as vm">
            <h5 *ngIf="vm.loading">Loading</h5>
            <div class="tool-bar">
                <span class="search-tool">
                    <label for="herosearch">Search: </label>
                    <input
                        name="herosearch"
                        [value]="vm.search"
                        (input)="setSearch($event.target.value)"
                    />
                </span>
                <span class="page-tool">
                    <label
                        >Page {{ vm.userPage }} of {{ vm.totalPages }} :
                    </label>
                    <span class="buttons">
                        <button
                            class="prev"
                            [disabled]="vm.userPage === 1"
                            (click)="movePageBy(-1)"
                        >
                            Prev
                        </button>
                        <button
                            class="next"
                            [disabled]="vm.isLastPage"
                            (click)="movePageBy(1)"
                        >
                            Next
                        </button>
                    </span>
                </span>
                <span class="result-tool">
                    <label>Show Results: </label>
                    <span class="buttons">
                        <button
                            *ngFor="let limit of hero.limits"
                            [disabled]="limit === vm.limit"
                            (click)="setLimit(limit)"
                        >
                            {{ limit }}
                        </button>
                    </span>
                </span>
                <span class="total-tool">
                    <label>Total Results: {{ vm.totalHeroes }}</label>
                </span>
            </div>
            <div class="table-content">
                <rx-hero-badge
                    *ngFor="let hero of vm.heroes"
                    [hero]="hero"
                ></rx-hero-badge>
            </div>
        </ng-container>
    `,
    styleUrls: ['./hero-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroTableComponent {
    vm$ = combineLatest([
        this.hero.heroes$,
        this.hero.totalHeroes$,
        this.hero.totalPages$,
        this.hero.loading$,
    ]).pipe(
        withLatestFrom(this.hero.search$, this.hero.page$, this.hero.limit$),
        debounceTime(0),
        map(
            ([
                [heroes, totalHeroes, totalPages, loading],
                search,
                page,
                limit,
            ]) => ({
                search,
                limit,
                heroes,
                totalHeroes,
                totalPages,
                userPage: page + 1,
                isLastPage: totalHeroes === page + 1,
                loading,
            }),
        ),
    );

    constructor(public hero: HeroService) {}

    movePageBy(moveBy: number) {
        this.hero.movePageBy(moveBy);
    }

    setLimit(limit: number) {
        this.hero.setLimit(limit);
    }

    setSearch(searchTerm: string) {
        this.hero.setSearch(searchTerm);
    }
}
