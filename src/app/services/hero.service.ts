import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, shareReplay, switchMap } from 'rxjs/operators';
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

const DEFAULT_LIMIT = LIMIT_HIGH;
const DEFAULT_SEARCH = '';
const DEFAULT_PAGE = 0;

@Injectable({
    providedIn: 'root',
})
export class HeroService {
    limits = LIMITS;

    searchBS = new BehaviorSubject<string>(DEFAULT_SEARCH);
    limitBS = new BehaviorSubject<number>(DEFAULT_LIMIT);
    pageBS = new BehaviorSubject<number>(DEFAULT_PAGE);

    userPage$ = this.pageBS.pipe(map(page => page + 1));

    params$ = combineLatest([this.searchBS, this.limitBS, this.pageBS]).pipe(
        map(([searchTerm, limit, page]) => {
            const params: any = {
                apikey: environment.MARVEL_API.PUBLIC_KEY,
                limit: `${limit}`,
                offset: `${page * limit}`, // page * limit
            };
            if (searchTerm.length) {
                params.nameStartsWith = searchTerm;
            }
            return params;
        }),
    );

    private heroesResponse$ = this.params$.pipe(
        debounceTime(500),
        switchMap(_params =>
            this.http.get(HERO_API, {
                params: _params,
            }),
        ),
        shareReplay(1),
    );

    totalResults$ = this.heroesResponse$.pipe(
        map((res: any) => res.data.total),
    );

    heroes$: Observable<Hero[]> = this.heroesResponse$.pipe(
        map((res: any) => res.data.results),
    );

    totalPages$ = combineLatest([this.totalResults$, this.limitBS]).pipe(
        map(([totalResults, limit]) => Math.ceil(totalResults / limit)),
    );

    constructor(private http: HttpClient) {}
}
