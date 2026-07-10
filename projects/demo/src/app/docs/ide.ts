import { NgeDocSettings } from '@cisstech/nge/doc'
import { editInGithubAction } from './actions'

/** A doc page whose href matches its markdown file under assets/docs/ide. */
const page = (title: string, href: string) => {
  const file = `assets/docs/ide/${href}.md`
  return { title, href, renderer: file, actions: [editInGithubAction(file)] }
}

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
    page('Introduction', 'introduction'),
    page('Getting started', 'getting-started'),
    page('File system', 'file-system'),
    page('Editors', 'editors'),
    page('Extending the IDE', 'extending'),
    page('Theming', 'theming'),
    page('Services reference', 'services'),
  ],
}
