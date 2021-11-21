import { Directive, Input, SimpleChanges, Renderer2, ElementRef, OnChanges } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[highlight]'
})
export class HighlightDirective implements OnChanges {

    @Input('highlight')
    text!: string;

    @Input('highlightPattern')
    pattern!: string | string[] | RegExp;

    @Input()
    options = 'gi';

    constructor(
        private readonly el: ElementRef,
        private readonly renderer: Renderer2
    ) { }

    ngOnChanges(_: SimpleChanges): void {
        if (typeof(this.pattern) === 'string' || this.pattern instanceof RegExp) {
            this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.searchRegex());
        } else {
            if (!this.pattern || !this.pattern.length) {
                this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.text);
                return;
            }
            this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.searchWords(this.pattern));
        }
    }

    private searchRegex() {
        let regex: RegExp;
        if (typeof(this.pattern) === 'string') {
            try {
                regex = new RegExp(this.pattern, this.options);
            } catch {
                return this.text;
            }
        } else {
            regex = this.pattern as RegExp;
        }
        let html = this.escape(this.text);
        const matches = html.match(regex);
        if (matches) {
            for (const match of matches) {
                html = html.replace(match, `<span class="highlight">${match}</span>`);
            }
        }
        return html;
    }

    private searchWords(words: string[]) {
        try {
            const re = new RegExp(`(${ words.join('|') })`, this.options);
            return this.escape(this.text).replace(re, `<span class="highlight">$1</span>`);
        } catch {
            return this.text;
        }
    }

    private escape(str: string) {
        const tagsToReplace: any = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        const replaceTag = (tag: string) => {
            return tagsToReplace[tag] || tag;
        };
        return str.replace(/[&<>]/g, replaceTag);
    }

}
