import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'

/**
 * Sober entry page for the demo site: presents the project and routes to either
 * the documentation or the live playground. Theme-aware via prefers-color-scheme.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="landing">
      <header class="hero">
        <img class="logo" src="assets/images/nge.svg" alt="NGE IDE" width="72" height="72" />
        <h1>NGE IDE</h1>
        <p class="tagline">An extensible, file-system-agnostic code editor for the web, built with Angular.</p>
      </header>

      <nav class="paths" aria-label="Get started">
        <a class="card" routerLink="/docs/introduction">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path
              d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13V4Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
          </svg>
          <span class="card__title">Documentation</span>
          <span class="card__desc">Embed the IDE, plug in a file system, and extend it with your own editors and views.</span>
          <span class="card__cta">Read the docs →</span>
        </a>

        <a class="card" routerLink="/playground">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path
              d="m9 8 4 4-4 4M14 16h4"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6" />
          </svg>
          <span class="card__title">Playground</span>
          <span class="card__desc">Open the IDE running on an in-memory file system, right in your browser.</span>
          <span class="card__cta">Try it live →</span>
        </a>
      </nav>

      <footer class="foot">
        <a href="https://github.com/cisstech/nge-ide" target="_blank" rel="noreferrer">GitHub</a>
        <span class="dot">·</span>
        <a href="https://www.npmjs.com/package/@cisstech/nge-ide" target="_blank" rel="noreferrer">npm</a>
        <span class="dot">·</span>
        <span>MIT © Mamadou Cisse</span>
      </footer>
    </main>
  `,
  styles: [
    `
      :host {
        --bg: #ffffff;
        --fg: #1f2328;
        --muted: #59636e;
        --card-bg: #ffffff;
        --border: #d1d9e0;
        --border-hover: #0969da;
        --accent: #0969da;
        display: block;
        min-height: 100vh;
        background: var(--bg);
        color: var(--fg);
        color-scheme: light;
      }

      @media (prefers-color-scheme: dark) {
        :host {
          --bg: #0d1117;
          --fg: #e6edf3;
          --muted: #9198a1;
          --card-bg: #0d1117;
          --border: #3d444d;
          --border-hover: #2f81f7;
          --accent: #2f81f7;
          color-scheme: dark;
        }
      }

      .landing {
        max-width: 720px;
        margin: 0 auto;
        padding: 12vh 24px 6vh;
        display: flex;
        flex-direction: column;
        gap: 48px;
        font-family:
          -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      }

      .hero {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
      .logo {
        opacity: 0.95;
      }
      h1 {
        margin: 0;
        font-size: 2.25rem;
        font-weight: 650;
        letter-spacing: -0.02em;
      }
      .tagline {
        margin: 0;
        max-width: 34ch;
        color: var(--muted);
        font-size: 1.075rem;
        line-height: 1.5;
      }

      .paths {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      @media (max-width: 560px) {
        .paths {
          grid-template-columns: 1fr;
        }
      }

      .card {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 22px;
        border: 1px solid var(--border);
        border-radius: 12px;
        background: var(--card-bg);
        color: inherit;
        text-decoration: none;
        transition:
          border-color 0.15s ease,
          transform 0.15s ease;
      }
      .card:hover,
      .card:focus-visible {
        border-color: var(--border-hover);
        transform: translateY(-2px);
        outline: none;
      }
      .card svg {
        color: var(--accent);
      }
      .card__title {
        font-size: 1.125rem;
        font-weight: 600;
        margin-top: 4px;
      }
      .card__desc {
        color: var(--muted);
        font-size: 0.925rem;
        line-height: 1.5;
        flex: 1;
      }
      .card__cta {
        color: var(--accent);
        font-size: 0.9rem;
        font-weight: 550;
        margin-top: 4px;
      }

      .foot {
        text-align: center;
        color: var(--muted);
        font-size: 0.85rem;
        display: flex;
        justify-content: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .foot a {
        color: var(--muted);
        text-decoration: none;
      }
      .foot a:hover {
        color: var(--accent);
      }
      .dot {
        opacity: 0.5;
      }
    `,
  ],
})
export class LandingComponent {}
