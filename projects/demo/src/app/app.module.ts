// ANGULAR
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

// LIBS
import { NGE_DOC_RENDERERS } from '@cisstech/nge/doc'
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
} from '@cisstech/nge/markdown'
import { NGE_MONACO_THEMES, NgeMonacoColorizerService, NgeMonacoModule } from '@cisstech/nge/monaco'

// MODULE
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    NgeMarkdownModule,
    NgeMonacoModule.forRoot({
      locale: 'fr',
      theming: {
        themes: NGE_MONACO_THEMES.map((theme) => 'assets/vendors/nge/monaco/themes/' + theme),
        default: 'github',
        // The IDE's own theme toggle drives the editor theme (github / github-dark),
        // so no darkThemeClassName sync here to avoid the two fighting over it.
      },
    }),
    AppRoutingModule,
  ],
  providers: [
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
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
  ],
})
export class AppModule {}
