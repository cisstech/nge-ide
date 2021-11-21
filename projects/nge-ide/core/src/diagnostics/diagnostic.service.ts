import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { URI } from 'vscode-uri';
import { resourceId } from '../files';
import { Diagnostic, DiagnosticSeverity, DiagnosticGroup } from './diagnostic';

// TODO implements IContribution and clear on deactivate

@Injectable()
export class DiagnosticService {
    private readonly subject = new BehaviorSubject<Record<string, Diagnostic[]>>({});

    get count(): Observable<number> {
        return this.reduce((previous) => previous + 1, 0);
    }

    get infos(): Observable<number> {
        return this.reduce((previous, current) => {
            return previous + (current.severity === DiagnosticSeverity.Info ? 1 : 0)
        }, 0);
    }

    get hints(): Observable<number> {
        return this.reduce((previous, current) => {
            return previous + (current.severity === DiagnosticSeverity.Hint ? 1 : 0)
        }, 0);
    }

    get errors(): Observable<number> {
        return this.reduce((previous, current) => {
            return previous + (current.severity === DiagnosticSeverity.Error ? 1 : 0)
        }, 0);
    }

    get warnings(): Observable<number> {
        return this.reduce((previous, current) => {
            return previous + (current.severity === DiagnosticSeverity.Warning ? 1 : 0)
        }, 0);
    }

    get isEmpty(): Observable<boolean> {
        return this.count.pipe(
            map(count => count === 0)
        )
    }


    clear() {
        this.subject.next({})
    }

    setDiagnostics(uri: URI | monaco.Uri, items: Diagnostic[]) {
        const diagnostics = this.subject.value;
        diagnostics[resourceId(uri)] = items;
        this.subject.next(diagnostics);
    }

    asObservable(uri: URI | monaco.Uri): Observable<Diagnostic[]> {
        return this.subject.asObservable().pipe(
            filter(diagnostics => diagnostics[resourceId(uri)] != null),
            map(diagnostics => diagnostics[resourceId(uri)] || [])
        );
    }

    asObservableAll(): Observable<DiagnosticGroup[]> {
        return this.subject.asObservable().pipe(
            map(diagnostics => {
                return Object.keys(diagnostics).map(k => {
                    return {
                        uri: k,
                        diagnostics: diagnostics[k]
                    };
                }).filter(group => group.diagnostics.length > 0);
            }),
        );
    }

    private reduce<T>(reducer: (previous: T, current: Diagnostic) => T, initial: T): Observable<T> {
        return this.subject.pipe(
            map(record => {
                let response = initial;
                Object.values(record).forEach(diagnostics => {
                    diagnostics.forEach(diagnostic => {
                        response = reducer(response, diagnostic);
                    });
                });
                return response;
            })
        );
    }
}
