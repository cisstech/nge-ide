import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'ide-search-input',
    templateUrl: 'search-input.component.html',
    styleUrls: ['./search-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit {

    @Input() title = '';

    @Input() ariaLabel = '';

    @Input() query = '';
    @Output() queryChange = new EventEmitter<string>();

    @Input() useRegex: boolean = false;
    @Output()
    useRegexChange = new EventEmitter<boolean>();

    @Input() matchWord = false;
    @Output() matchWordChange = new EventEmitter<boolean>();

    @Input() matchCase = false;
    @Output() matchCaseChange = new EventEmitter<boolean>();

    @Input() pattern?: RegExp;
    @Output() patternChange = new EventEmitter<RegExp>();

    @Output()
    search = new EventEmitter();

    @Input() controls = false;

    error = '';

    ngOnInit() {
    }

    onKeyEnter() {
        this.error = '';
        if (this.controls) {
            try {
                /* function escape(text: string) {
                    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
                }

                let query = this.query;
                if (!this.useRegex) {
                    query = escape(this.query);
                }

                const opts = ['g'];
                if (!this.matchCase) {
                    opts.push('i');
                }

                if (this.matchWord) {
                    this.pattern = new RegExp(`(\\b${query}\\b)`, opts.join(''));
                } else {
                    this.pattern = new RegExp(`(${query})`, opts.join(''));
                } */
            } catch (error) {
                this.error = error.message;
            }
        }

        this.queryChange.emit(this.query);
        this.matchCaseChange.emit(this.matchCase);
        this.matchWordChange.emit(this.matchWord);
        this.useRegexChange.emit(this.useRegex);
        this.patternChange.emit(this.pattern);

        if (!this.error) {
            this.search.emit();
        }
    }

}
