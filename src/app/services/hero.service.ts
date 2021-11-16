import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { debounceTime, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Hero {
    id: number;
    name: string;
    description: string;
    thumbnail: HeroThumbnail;
    resourceURI: string;
    comics: HeroSubItems;
    events: HeroSubItems;
    series: HeroSubItems;
    stories: HeroSubItems;
}

export interface HeroThumbnail {
    path: string;
    extendion: string;
}

export interface HeroSubItems {
    available: number;
    returned: number;
    collectionURI: string;
    items: HeroSubItem[];
}

export interface HeroSubItem {
    resourceURI: string;
    name: string;
}

// The URL to the Marvel API
const HERO_API = `${environment.MARVEL_API.URL}/v1/public/characters`;

// Our Limits for Search
const LIMIT_LOW = 10;
const LIMIT_MID = 25;
const LIMIT_HIGH = 100;
const LIMITS = [LIMIT_LOW, LIMIT_MID, LIMIT_HIGH];

const DEFAULT_PAGE = 0;

const DEFAULT_STATE = {
    search: '',
    page: DEFAULT_PAGE,
    limit: LIMIT_LOW,
};

@Injectable({
    providedIn: 'root',
})
export class HeroService {
    limits = LIMITS;

    private stateBS = new BehaviorSubject(DEFAULT_STATE);
    search$ = this.stateBS.pipe(map(state => state.search));
    page$ = this.stateBS.pipe(map(state => state.page));
    limit$ = this.stateBS.pipe(map(state => state.limit));

    private cache = {};

    private heroesResponse$ = this.stateBS.pipe(
        debounceTime(500),
        switchMap(({ search, page, limit }) => {
            const params: any = {
                apikey: environment.MARVEL_API.PUBLIC_KEY,
                limit: `${limit}`,
                offset: `${page * limit}`, // page * limit
            };

            if (search) {
                params.nameStartsWith = search;
            }

            if (this.cache[JSON.stringify(params)]) {
                return of(this.cache[JSON.stringify(params)]);
            }
            return this.http
                .get(HERO_API, {
                    params,
                })
                .pipe(tap(res => (this.cache[JSON.stringify(params)] = res)));
        }),
        shareReplay(1),
    );
    totalHeroes$ = this.heroesResponse$.pipe(map((res: any) => res.data.total));
    heroes$ = this.heroesResponse$.pipe(map((res: any) => res.data.results));
    totalPages$ = combineLatest([this.totalHeroes$, this.limit$]).pipe(
        map(([totalHeroes, limit]) => Math.ceil(totalHeroes / limit)),
    );

    constructor(private http: HttpClient) {}

    movePageBy(moveBy: number): void {
        this.stateBS.next({
            ...this.stateBS.value,
            page: this.stateBS.value.page + moveBy,
        });
    }

    doSearch(term: string): void {
        this.stateBS.next({
            ...this.stateBS.value,
            search: term,
            page: 0,
        });
    }

    setLimit(limit: number): void {
        this.stateBS.next({
            ...this.stateBS.value,
            limit,
            page: 0,
        });
    }
}
