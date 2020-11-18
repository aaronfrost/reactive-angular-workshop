import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    mergeMap,
    pluck,
    switchMap,
    tap,
} from 'rxjs/operators';
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

const DEFAULT_STATE = {
    search: '',
    page: 0,
    limit: LIMIT_MID,
    heroCache: {},
};

@Injectable({
    providedIn: 'root',
})
export class HeroService {
    limits = LIMITS;

    private heroState = new BehaviorSubject(DEFAULT_STATE);
    search$ = this.heroState.pipe(pluck('search'));
    page$ = this.heroState.pipe(pluck('page'));
    userPage$ = this.page$.pipe(map(page => page + 1));
    limit$ = this.heroState.pipe(pluck('limit'));

    heroesResponse$ = this.search$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        mergeMap(() => this.heroState),
        switchMap(state => {
            const search = state.search.trim();
            if (state.heroCache[search]) {
                return of(state.heroCache[search]);
            }
            const params: any = {
                apikey: environment.MARVEL_API.PUBLIC_KEY,
                limit: `${state.limit}`,
                offset: `${state.page * state.limit}`, // page * limit
            };
            if (search && search.length) {
                params.nameStartsWith = search;
            }
            return this.http.get(HERO_API, { params }).pipe(
                tap(res => {
                    /** merge in new result */
                    const heroCache = {
                        ...state.heroCache,
                        [search]: res,
                    };
                    /** update the local state. */
                    this.heroState.next({ ...state, heroCache });
                }),
            );
        }),
    );

    heroes$ = this.heroesResponse$.pipe(map((res: any) => res.data.results));
    total$ = this.heroesResponse$.pipe(map((res: any) => res.data.total));
    totalPages$ = combineLatest([this.total$, this.limit$]).pipe(
        map(([total, limit]) => Math.ceil(total / limit)),
    );

    constructor(private http: HttpClient) {}

    setLimit(limit: number) {
        const state = this.heroState.getValue();
        this.heroState.next({
            ...state,
            limit,
            page: 0,
        });
    }

    movePageBy(moveBy: number) {
        const state = this.heroState.getValue();
        this.heroState.next({
            ...state,
            page: state.page + moveBy,
        });
    }

    setSearch(search: string) {
        const state = this.heroState.getValue();
        this.heroState.next({
            ...state,
            search: search.trim(),
            page: 0,
        });
    }
}
