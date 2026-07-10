// ANGULAR
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

// LIBS
import { provideNgeDoc, withBrand, withDarkMode, withMarkdownRenderer, withNavbar } from '@cisstech/nge/doc'
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
        light: 'github',
        dark: 'github-dark',
        darkThemeClassName: 'nge-doc-dark',
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
    provideNgeDoc(
      withBrand({ title: 'NGE IDE', icon: 'assets/images/nge.svg', href: '/' }),
      withNavbar([
        { title: 'Docs', href: '/docs/introduction' },
        { title: 'Playground', href: '/playground' },
        { title: 'GitHub', href: 'https://github.com/cisstech/nge-ide', external: true },
      ]),
      withMarkdownRenderer({
        component: () => import('@cisstech/nge/markdown').then((m) => m.NgeMarkdownComponent),
      }),
      withDarkMode('auto')
    ),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
  ],
})
export class AppModule {}
