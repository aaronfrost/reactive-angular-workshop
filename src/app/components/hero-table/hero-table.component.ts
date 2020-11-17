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
    heroes: Hero[];

    disablePrevious$ = this.hero.page$.pipe(map(page => page <= 0));
    disableNext$ = combineLatest([this.hero.totalPages$, this.hero.page$]).pipe(
        map(([totalPages, page]) => page >= totalPages - 1),
    );

    constructor(public hero: HeroService) {}
}
