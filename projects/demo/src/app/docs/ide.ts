import { NgeDocSettings } from '@cisstech/nge/doc'

/**
 * Documentation site for @cisstech/nge-ide, rendered by nge-doc at /docs.
 * Each page points at a markdown file under assets/docs/ide.
 */
export const IDE_DOCS: NgeDocSettings = {
  meta: {
    name: 'nge-ide',
    root: '/docs/',
    logo: 'assets/images/nge.svg',
    backUrl: '/',
    repo: {
      name: 'nge-ide',
      url: 'https://github.com/cisstech/nge-ide',
    },
  },
  pages: [
    { title: 'Introduction', href: 'introduction', renderer: 'assets/docs/ide/introduction.md' },
    { title: 'Getting started', href: 'getting-started', renderer: 'assets/docs/ide/getting-started.md' },
    { title: 'File system', href: 'file-system', renderer: 'assets/docs/ide/file-system.md' },
    { title: 'Editors', href: 'editors', renderer: 'assets/docs/ide/editors.md' },
    { title: 'Extending the IDE', href: 'extending', renderer: 'assets/docs/ide/extending.md' },
    { title: 'Theming', href: 'theming', renderer: 'assets/docs/ide/theming.md' },
    { title: 'Services reference', href: 'services', renderer: 'assets/docs/ide/services.md' },
  ],
}
