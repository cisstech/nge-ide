import { Component, OnInit } from '@angular/core';
import { Settings, SettingsService } from '@cisstech/nge-ide/core';

@Component({
  selector: 'ide-settings-editor',
  templateUrl: './settings-editor.component.html',
  styleUrls: ['./settings-editor.component.scss'],
})
export class SettingsEditorComponent implements OnInit {
  /** setting groups */
  groups: Settings.Group[] = [];

  /** selected group */
  selection?: Settings.Group;

  constructor(private readonly settings: SettingsService) {}

  ngOnInit() {
    const settings = this.settings.getAll();
    const groups = Object.keys(settings).sort((a, b) => {
      return a.split('.').pop()!.toLowerCase() <
        b.split('.').pop()!.toLowerCase()
        ? -1
        : 1;
    });

    this.groups = groups.reduce((acc: Settings.Group[], groupName) => {
      if (!acc.some((item) => item.name === groupName)) {
        acc.push({
          name: groupName,
          settings: this.settings.ofGroup(groupName).filter((setting) => {
            return !setting.hidden;
          }),
        });
      }
      return acc;
    }, []);

    if (this.groups.length > 0) {
      this.selection = this.groups[0];
    }
  }

  didChange() {
    this.settings.update(this.groups);
  }

  didSelect(group: Settings.Group) {
    this.selection = group;
  }
}
