import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    pluck,
    shareReplay,
    switchMap,
    tap,
    withLatestFrom,
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

interface HeroState {
    search: string;
    page: number;
    limit: number;
    loading: boolean;
}

const initialState: HeroState = {
    search: '',
    page: 0,
    limit: LIMIT_LOW,
    loading: false,
};

@Injectable({
    providedIn: 'root',
})
export class HeroService {
    limits = LIMITS;

    heroState$ = new BehaviorSubject<HeroState>(initialState);

    search$ = this.heroState$.pipe(
        pluck('search'),
        distinctUntilChanged(),
    );
    page$ = this.heroState$.pipe(
        pluck('page'),
        distinctUntilChanged(),
    );
    limit$ = this.heroState$.pipe(
        pluck('limit'),
        distinctUntilChanged(),
    );
    loading$ = this.heroState$.pipe(
        pluck('loading'),
        distinctUntilChanged(),
    );
    params$ = combineLatest([this.search$, this.limit$, this.page$]);

    heroesResponse$ = this.params$.pipe(
        debounceTime(500),
        tap(() => {
            this.heroState$.next({
                ...this.heroState$.getValue(),
                loading: true,
            });
        }),
        switchMap(([search, limit, page]) => {
            const params: any = {
                apikey: environment.MARVEL_API.PUBLIC_KEY,
                limit: `${limit}`,
                offset: `${page * limit}`, // page * limit
            };
            if (search.length) params.nameStartsWith = search;

            return this.http.get(HERO_API, {
                params: params,
            });
        }),
        tap(() => {
            this.heroState$.next({
                ...this.heroState$.getValue(),
                loading: false,
            });
        }),
        shareReplay(1),
    );

    heroes$ = this.heroesResponse$.pipe(pluck('data', 'results'));
    totalHeroes$: Observable<number> = this.heroesResponse$.pipe(
        pluck('data', 'total'),
    );
    totalPages$ = this.totalHeroes$.pipe(
        withLatestFrom(this.limit$),
        map(([total, limit]) => Math.ceil(total / limit)),
    );

    constructor(private http: HttpClient) {}

    movePageBy(moveBy: number) {
        const state = this.heroState$.getValue();
        const newPage = state.page + moveBy;
        this.heroState$.next({
            ...state,
            page: newPage,
        });
    }

    setLimit(limit: number) {
        const state = this.heroState$.getValue();
        this.heroState$.next({
            ...state,
            page: 0,
            limit: limit,
        });
    }

    setSearch(search: string) {
        const state = this.heroState$.getValue();
        this.heroState$.next({
            ...state,
            page: 0,
            search: search,
        });
    }
}
