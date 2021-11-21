import { ICommand } from "@mcisse/nge-ide/core";

export enum CommandGroups {
    /** Commands related to navigation accross the ide. */
    GROUP_NAVIGATION = '1_navigation',
    /**  Commands related to workspace manipulation. */
    GROUP_WORKSPACE = '2_workspace',
    /**  Commands related to comparing files in the diff editor. */
    GROUP_COMPARE = '3_compare',
    /**  Commands related to searching. */
    GROUP_SEARCH = '4_search',
    /**  Commands related to cutting, copying, and pasting of files. */
    GROUP_CUT_COPY_PASTE = '5_cutcopypaste',
    /**  Commands related to copying file paths. */
    GROUP_COPY_PASTE = '6_cutcopypaste',
    /**  Commands related to the modification of file. */
    GROUP_MODIFICATION = '7_modification',

}
/** Commands available inside the explorer container. */
export interface IExplorerCommand extends ICommand {
    /**
     * Command group.
     *
     * You should use the constants GROUP_NAVIGATION, GROUP_WORKSPACE...
     */
    readonly group: CommandGroups;
}
