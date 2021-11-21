import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { ICommand } from '../commands/command';

/**
 * Representation of a part of the editor (statusbar, sidebar...).
 */
export interface IView {
    /** Unique identifier of the view. */
    id: string;
    /** Title of the view. */
    title: string;
    /** Identifier of the view container where the view belong to. */
    viewContainerId: string;
    /** Component that render the view. */
    component: () => (Type<any> | Promise<Type<any>>);
    /** Commands attached to the view. */
    commands: Observable<ICommand[]>;
}
