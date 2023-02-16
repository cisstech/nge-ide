import {
  Directive,
  Input,
  SimpleChanges,
  Renderer2,
  ElementRef,
  OnChanges,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[highlight]',
})
export class HighlightDirective implements OnChanges {
  @Input('highlight')
  text!: string;

  @Input('highlightPattern')
  pattern?: string | string[] | RegExp | null;

  @Input()
  options = 'gi';

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnChanges(_: SimpleChanges): void {
    if (!this.pattern) {
      // null or undefined
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.text);
      return;
    }

    if (typeof this.pattern === 'string') {
      // string
      this.pattern = this.pattern.trim();
      this.renderer.setProperty(
        this.el.nativeElement,
        'innerHTML',
        !!this.pattern ? this.hightlightRegex() : this.text
      );
      return;
    }

    if (this.pattern instanceof RegExp) {
      // RegExp
      this.renderer.setProperty(
        this.el.nativeElement,
        'innerHTML',
        this.hightlightRegex()
      );
      return;
    }

    // array
    this.renderer.setProperty(
      this.el.nativeElement,
      'innerHTML',
      this.pattern.length ? this.highlightWords(this.pattern) : this.text
    );
  }

  private highlightWords(words: string[]): string {
    try {
      const re = new RegExp(`(${words.join('|')})`, this.options);
      return this.escape(this.text).replace(
        re,
        `<span class="highlight">$1</span>`
      );
    } catch {
      return this.text;
    }
  }

  private hightlightRegex() {
    let regex: RegExp;
    if (typeof this.pattern === 'string') {
      try {
        regex = new RegExp(this.pattern, this.options);
      } catch {
        return this.text;
      }
    } else {
      regex = this.pattern as RegExp;
    }

    return this.escape(this.text).replace(
      regex,
      `<span class="highlight">$&</span>`
    );
  }

  private escape(str: string) {
    const replacements: any = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
    };

    return str.replace(/[&<>]/g, (tag: string) => replacements[tag] || tag);
  }
}
