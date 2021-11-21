import { Injectable, Injector, Predicate } from '@angular/core';
import { ConfirmOptions, DialogService } from '@mcisse/nge/ui/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { URI } from 'vscode-uri';
import { IContribution } from '../contributions';
import { FileService } from '../files';
import { Paths } from '../utils';
import { Editor, EditorGroup, EditorState } from './editor';
import { OpenOptions } from './opener';


@Injectable()
export class EditorService implements IContribution {
    readonly id = 'workbench.contrib.editor-service';

    private editors: Editor[] = [];
    private readonly groups: Map<string, EditorGroup> = new Map();

    private readonly didOpen = new Subject<URI>();
    private readonly willOpen = new Subject<URI>();

    /** State of the editor. */
    private readonly state$ = new BehaviorSubject<EditorState>({ visibleEditors: [] });

    /** Opened opened editor groups. */
    private readonly editorGroups$ = new BehaviorSubject<EditorGroup[]>([]);


    /** State of the editor. */
    readonly state = this.state$.asObservable();

    /** Emitted after opening a resource. */
    readonly onDidOpen = this.didOpen.asObservable();
    /** Emitted before opening a resource. */
    readonly onWillOpen = this.willOpen.asObservable();

    /** Opened editor groups. */
    readonly editorGroups = this.editorGroups$.asObservable();

    /** shorcut to state.value.activeGroup */
    get activeGroup(): EditorGroup | undefined {
        return this.state$.value.activeGroup;
    }

    /** shorcut to state.value.activeEditor */
    get activeEditor(): Editor | undefined {
        return this.state$.value.activeEditor;
    }

    /** shorcut to state.value.activeResource */
    get activeResource(): URI | undefined {
        return this.state$.value.activeResource;
    }

    /** shorcut to state.value.visibleEditors */
    get visibleEditors(): ReadonlyArray<Editor> {
        return this.state$.value.visibleEditors;
    }

    constructor(
        private readonly injector: Injector,
        private readonly fileService: FileService,
        private readonly dialogService: DialogService,
    ) {}

    deactivate(): void {
        this.editors = [];
    }

    registerEditors(...editors: Editor[]): void {
        editors.forEach(editor => {
            if (this.editors.find((entry) => entry.name === editor.name)) {
                throw new Error(
                    `There is already a editor registered with the id ${editor.name}`
                );
            }
            this.editors.unshift(editor);
        });
    }

    /**
     * Checks whether the given `resource` is opened in any editor.
     * @param resource The resource to test.
     * @returns `true` if the resource is opened `false` otherwises.
     */
    isOpened(resource: URI): boolean {
        return !!this.findGroups(group => group.contains(resource)).length;
    }

    /**
     *  Checks whether `group` is the active one inside the editor.
     * @param group the group.
     */
    isActiveGroup(group: EditorGroup): boolean {
        const active = this.state$.value.activeGroup;
        if (!active) {
            return false;
        }
        return active.id === group.id;
    }

    /**
     * Finds the first group whichs meets the predicate.
     * @param predicate the predicate to test.
     * @returns An `EditorGroup` object or `null`
     */
    findGroup(predicate: Predicate<EditorGroup>): EditorGroup | undefined {
        return this.listGroups().find(predicate);
    }

    /**
     * Finds all the groups whichs meets the predicate.
     * @param predicate the predicate to test.
     * @returns An array of `EditorGroup` objects.
     */
    findGroups(predicate: Predicate<EditorGroup>): EditorGroup[] {
        return this.listGroups().filter(predicate);
    }

    /**
     * Finds the group with the given id.
     * @param id the id of the group
     * @returns the group or undefined.
     */
    findGroupById(id: string): EditorGroup | undefined {
        return this.groups.get(id);
    }

    /**
     * Opens the resource with the right editor and set it has the new active resource of the editor.
     * @param resource The resource to open.
     * @param options Open options.
     */
    async open(resource: URI, options?: OpenOptions): Promise<void> {
        let group: EditorGroup;
        const editorGroups = this.listGroups();
        options = options || {};
        if (options.openToSide) {
            group = this.createGroup();
        } else {
            group =
                options.openInGroup ||
                editorGroups.find(g => g.contains(resource)) || // open with an existing group containing the resource
                editorGroups.find(g => this.isActiveGroup(g)) || // open with the active group
                editorGroups.find(_ => true) || // open with any group
                this.createGroup(); // open with a new group
        }

        this.groups.set(group.id, group);
        this.editorGroups$.next(this.listGroups());

        this.willOpen.next(resource);

        return group.open(resource, options);
    }

    /**
     * Closes the resource from all the editor groups.
     * @param resource the resource to close.
     */
    async close(resource: URI): Promise<any> {
        const groups = this.findGroups(group => group.contains(resource));
        return Promise.all(groups.map(g => g.close(resource)));
    }

   /**
    * Closes all the groups
    */
    async closeAll(): Promise<void> {
        let groups = this.listGroups();
        while (groups.length !== 0) {
            await groups[0].closeAll();
            groups = this.listGroups();
        }

        this.editorGroups$.next(groups);

        this.state$.next({
            activeGroup: undefined,
            activeEditor: undefined,
            activeResource: undefined,
            visibleEditors: [],
        });
    }

    /**
     * Saves the resource on the disk.
     */
    async save(resource: URI): Promise<void> {
        await this.fileService.save(resource);
    }

    /**
     * Saves unsaved resources.
     */
    async saveAll(): Promise<any> {
        const changes: URI[] = [];
        this.listGroups().forEach(group => {
           group.resources.forEach(resource => {
               if (this.fileService.isDirty(resource)) {
                   changes.push(resource);
               }

           });
        });
        return Promise.all(changes.map(r => this.save(r)));
    }

    private async closeGuard(
        _: EditorGroup,
        resource: URI
    ): Promise<boolean> {
        const shouldConfirm = this.shouldConfirmClose(resource);
        const options: ConfirmOptions = {
            title: `Voulez-vous fermer le fichier "${Paths.basename(resource.path)}"?`,
            message: 'Vos modifications seront perdues si vous ne les enregistrez pas.',
            buttons: [{ id: 'dontsave', title: 'Ne pas sauvegarder', role: 'custom' }],
            okTitle: 'Sauvegarder',
            noTitle: 'Annuler'
        };

        let choice: any = false;
        if (!shouldConfirm || (choice = await this.dialogService.confirmAsync(options))) {
            if (choice === true) {
                await this.save(resource);
            }
            return true;
        }
        return false;
    }

    private openHandler(
        group: EditorGroup,
        editor: Editor,
        resource: URI,
    ): void {
        this.groups.set(group.id, group);
        this.editorGroups$.next(this.listGroups());

        const { visibleEditors } = this.state$.value;
        this.state$.next({
            activeGroup: group,
            activeEditor: editor,
            activeResource: resource,
            visibleEditors: [
                editor,
                ...visibleEditors.filter(e => !e.equals(editor))
            ]
        });

        this.didOpen.next(resource);
    }

    private closeHandler(
        group: EditorGroup,
        toClose: URI,
        toFocus?: URI
    ): void {
        if (group.isEmpty) {
            this.groups.delete(group.id);
        }
        if (!this.isOpened(toClose)) {
            this.fileService.close(toClose);
        }

        this.editorGroups$.next(
            this.listGroups()
        );

        this.state$.next({
            activeEditor: undefined,
            activeResource: undefined,
            activeGroup: undefined,
            visibleEditors: []
        });

        if (toFocus) {
            this.open(toFocus, {
                openInGroup: group
            }).catch(console.error);
        } else {
            const randomGroup = this.findGroup(g => !g.isEmpty);
            if (randomGroup && randomGroup.activeResource) {
                this.open(randomGroup.activeResource, {
                    openInGroup: randomGroup
                }).catch(console.error);
            }
        }
    }

    private createGroup(): EditorGroup {
        return new EditorGroup(
            this.injector,
            this.openHandler.bind(this),
            this.closeHandler.bind(this),
            this.closeGuard.bind(this),
            // important to clone to allow multiple instances of the same editor type
            this.editors.map(editor => new (editor as any).constructor()),
        );
    }

    private listGroups(): EditorGroup[] {
        return Array.from(this.groups.values());
    }

    private shouldConfirmClose(resource: URI): boolean {
        return (
            this.fileService.isDirty(resource) &&
            this.findGroups(group => {
                return group.contains(resource);
            }).length === 1
        );
    }
}
