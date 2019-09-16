import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContentComponent } from './content/content.component';
import { HeroTableComponent } from './hero-table/hero-table.component';
import { HeroBadgeComponent } from './hero-badge/hero-badge.component';

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        ContentComponent,
        HeroTableComponent,
        HeroBadgeComponent,
    ],
    imports: [CommonModule],
    exports: [HeaderComponent, FooterComponent, ContentComponent],
})
export class CoreModule {}
