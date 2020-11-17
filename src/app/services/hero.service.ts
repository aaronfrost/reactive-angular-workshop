import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
    debounceTime,
    map,
    pluck,
    share,
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
    limit: LIMIT_LOW,
};

@Injectable({
    providedIn: 'root',
})
export class HeroService {
    limits = LIMITS;

    private heroStateBS = new BehaviorSubject(DEFAULT_STATE);

    search$ = this.heroStateBS.pipe(pluck('search'));
    page$ = this.heroStateBS.pipe(pluck('page'));
    limit$ = this.heroStateBS.pipe(pluck('limit'));
    userPage$ = this.page$.pipe(map(val => val + 1));

    changes$ = combineLatest([this.search$, this.page$, this.limit$]);
    heroesResponse$ = this.changes$.pipe(
        debounceTime(200),
        switchMap(([search, page, limit]) => {
            const params: any = {
                apikey: environment.MARVEL_API.PUBLIC_KEY,
                limit: `${limit}`,
                offset: `${page * limit}`, // page * limit
            };
            if (search && search.length) {
                params.nameStartsWith = search;
            }

            return this.http.get(HERO_API, { params });
        }),
        share(),
    );
    heroes$ = this.heroesResponse$.pipe(map((res: any) => res.data.results));
    total$ = this.heroesResponse$.pipe(map((res: any) => res.data.total));
    totalPages$ = combineLatest([this.total$, this.limit$]).pipe(
        map(([total, limit]) => Math.ceil(total / limit)),
    );

    constructor(private http: HttpClient) {}

    movePageBy(moveBy: number) {
        const state = this.heroStateBS.getValue();
        this.heroStateBS.next({
            ...state,
            page: state.page + moveBy,
        });
    }

    setLimit(limit: number) {
        const state = this.heroStateBS.getValue();
        this.heroStateBS.next({
            ...state,
            limit,
            page: 0,
        });
    }

    setSearch(search: string) {
        const state = this.heroStateBS.getValue();
        this.heroStateBS.next({
            ...state,
            search,
            page: 0,
        });
    }
}
