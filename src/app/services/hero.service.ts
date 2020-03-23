import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// The URL to the Marvel API
const HERO_API = `${environment.MARVEL_API.URL}/v1/public/characters`;

// Our Limits for Search
const LIMIT_LOW = 10;
const LIMIT_MID = 25;
const LIMIT_HIGH = 100;
const LIMITS = [LIMIT_LOW, LIMIT_MID, LIMIT_HIGH];

@Injectable({
    providedIn: 'root',
})
export class HeroService {
    limits = LIMITS;

    heroes$ = this.http
        .get(HERO_API, {
            params: {
                apikey: environment.MARVEL_API.PUBLIC_KEY,
                limit: `${LIMIT_LOW}`,
                //nameStartsWith: 'ironman', // once we have search
                offset: `${0}`, // page * limit
            },
        })
        .pipe(map((res: any) => res.data.results));

    constructor(private http: HttpClient) {}
}
