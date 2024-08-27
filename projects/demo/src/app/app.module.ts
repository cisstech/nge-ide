// ANGULAR
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// LIBS
import { NGE_DOC_RENDERERS } from '@cisstech/nge/doc';
import {
  NgeMarkdownAdmonitionsProvider,
  NgeMarkdownEmojiProvider,
  NgeMarkdownHighlighterMonacoProvider,
  NgeMarkdownHighlighterProvider,
  NgeMarkdownIconsProvider,
  NgeMarkdownKatexProvider,
  NgeMarkdownLinkAnchorProvider,
  NgeMarkdownModule,
  NgeMarkdownTabbedSetProvider,
  NgeMarkdownThemeProvider,
} from '@cisstech/nge/markdown';
import {
  NGE_MONACO_THEMES,
  NgeMonacoColorizerService,
  NgeMonacoModule,
} from '@cisstech/nge/monaco';

// MODULE
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        NgeMarkdownModule,
        NgeMonacoModule.forRoot({
            locale: 'fr',
            theming: {
                themes: NGE_MONACO_THEMES.map((theme) => 'assets/vendors/nge/monaco/themes/' + theme),
                default: 'github',
            },
        }),
        AppRoutingModule,
        BrowserAnimationsModule], providers: [
        NgeMarkdownKatexProvider,
        NgeMarkdownIconsProvider,
        NgeMarkdownEmojiProvider,
        NgeMarkdownTabbedSetProvider,
        NgeMarkdownLinkAnchorProvider,
        NgeMarkdownAdmonitionsProvider,
        NgeMarkdownHighlighterProvider,
        NgeMarkdownThemeProvider({
            name: 'github',
            styleUrl: 'assets/vendors/nge/markdown/themes/github.css',
        }),
        NgeMarkdownHighlighterMonacoProvider(NgeMonacoColorizerService),
        {
            provide: NGE_DOC_RENDERERS,
            useValue: {
                markdown: {
                    component: () => import('@cisstech/nge/markdown').then((m) => m.NgeMarkdownComponent),
                },
            },
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
