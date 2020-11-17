import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroBadgeComponent } from './components/hero-badge/hero-badge.component';
import { HeroTableComponent } from './components/hero-table/hero-table.component';
import { HeroDetailsComponent } from './components/hero-details/hero-details.component';

const routes: Routes = [
    {
        path: '',
        component: HeroTableComponent,
        pathMatch: 'full',
    },
    {
        path: 'hero/:heroId',
        component: HeroDetailsComponent,
    },
];

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        ContentComponent,
        HeroTableComponent,
        HeroBadgeComponent,
        HeroDetailsComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
