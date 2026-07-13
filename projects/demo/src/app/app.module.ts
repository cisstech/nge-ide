// ANGULAR
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

// LIBS
import {
  provideNgeDoc,
  withBrand,
  withDarkMode,
  withEditLink,
  withNavbar,
  withSearchIndex,
  withSeo,
} from '@cisstech/nge/doc'
import {
  NgeMarkdownConfig,
  provideNgeMarkdown,
  withAdmonitions,
  withConfig,
  withEmoji,
  withIcons,
  withKatex,
  withLinkAnchor,
  withShiki,
  withTabbedSet,
  withThemes,
} from '@cisstech/nge/markdown'
import { NGE_MONACO_THEMES, provideNgeMonaco } from '@cisstech/nge/monaco'

// MODULE
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

function markdownOptions(): NgeMarkdownConfig {
  // Align nge-markdown's dark detection with the class the doc theme toggles.
  return { darkThemeClassName: 'nge-doc-dark' }
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideNgeMonaco({
      locale: 'fr',
      theming: {
        themes: NGE_MONACO_THEMES.map((theme) => 'assets/vendors/nge/monaco/themes/' + theme),
        default: 'github',
        light: 'github',
        dark: 'github-dark',
        darkThemeClassName: 'nge-doc-dark',
      },
    }),
    provideNgeMarkdown(
      withConfig(markdownOptions),
      withThemes({ name: 'github', styleUrl: 'assets/vendors/nge/markdown/themes/github.css' }),
      withKatex(),
      withIcons(),
      withEmoji(),
      withTabbedSet(),
      withLinkAnchor(),
      withAdmonitions(),
      withShiki()
    ),
    provideNgeDoc(
      withBrand({ title: 'NGE IDE', icon: 'assets/images/nge.svg', href: '/' }),
      withNavbar([
        { title: 'Docs', href: '/docs/introduction' },
        { title: 'Playground', href: '/playground' },
        { title: 'GitHub', href: 'https://github.com/cisstech/nge-ide', external: true },
      ]),
      withSeo({ url: 'https://cisstech.github.io/nge-ide', image: 'assets/images/nge.svg' }),
      withEditLink('https://github.com/cisstech/nge-ide/edit/main/projects/demo/public/docs'),
      withSearchIndex('docs/search.json'),
      withDarkMode('auto')
    ),
  ],
})
export class AppModule {}
