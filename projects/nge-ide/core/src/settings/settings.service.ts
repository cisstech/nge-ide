// tslint:disable: max-line-length

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IContribution } from '../contributions/index';
import { Settings } from './settings.model';

@Injectable()
export class SettingsService implements IContribution {
  private readonly settings = new BehaviorSubject<
    Record<string, Settings.Setting[]>
  >({});
  private readonly customSettings: Settings.Setting[] = [];

  readonly id = 'workbench.contrib.settings-service';
  readonly onDidChange = this.settings.asObservable();

  async activate(): Promise<void> {
    await this.loadSettings();
  }

  deactivate(): void {
    this.customSettings.splice(0, this.customSettings.length);
  }

  register(value: Settings.Setting): void {
    if (
      !this.customSettings.find(
        (e) => e.group === value.group && e.name === value.name
      )
    ) {
      this.customSettings.push(value);
    }
  }

  get(groupName: string, settingName: string) {
    return (this.settings.value[groupName] || []).find((item) => {
      return item.group === groupName && item.name === settingName;
    });
  }

  set(groupName: string, settingName: string, value: any) {
    const groups = this.settings.value;
    const group = groups[groupName] || [];
    let setting: Settings.Setting;
    for (let i = 0; i < group.length; i++) {
      setting = group[i];
      if (setting.name === settingName) {
        group[i].value = value;
        this.save();
        break;
      }
    }

    this.settings.next(groups);
  }

  save(): void {
    localStorage.setItem(
      Settings.STORAGE_KEY,
      JSON.stringify(this.settings.value)
    );
  }

  update(groups: Settings.Group[]): void {
    const settings = this.settings.value;

    groups.forEach((g) => {
      const group = settings[g.name] || [];
      g.settings?.forEach((setting) => {
        for (let i = 0; i < group.length; i++) {
          if (group[i].name === setting.name) {
            group[i] = setting;
            return;
          }
        }
        group.push(setting);
      });
      settings[g.name] = group;
    });

    this.settings.next(settings);
    this.save();
  }

  getAll(): Record<string, Settings.Setting[]> {
    return { ...this.settings.value };
  }

  ofGroup(groupName: string): Settings.Setting[] {
    return this.settings.value[groupName] || [];
  }

  extract(groupName: string) {
    const groups = this.settings.value;

    let record = {};
    Object.keys(groups)
      .filter((k) => {
        return k.startsWith(groupName);
      })
      .forEach((k) => {
        record = groups[k].reduce((_, curr) => {
          this.assign(record, curr.name, curr.value);
          return record;
        }, record);
      });
    return record;
  }

  private assign(obj: any, path: string, value: any): void {
    const a = path.split('.');
    let o = obj;
    for (let i = 0; i < a.length - 1; i++) {
      const n = a[i];
      if (n in o) {
        o = o[n];
      } else {
        o[n] = {};
        o = o[n];
      }
    }
    o[a[a.length - 1]] = value;
  }

  private loadSettings(): Promise<Record<string, Settings.Setting[]>> {
    return new Promise<Record<string, Settings.Setting[]>>((resolve) => {
      const store = localStorage.getItem(Settings.STORAGE_KEY);
      const groups = (store ? JSON.parse(store) : {}) as Record<
        string,
        Settings.Setting[]
      >;

      Settings.defaults.forEach((defaultSetting) => {
        groups[defaultSetting.group] = groups[defaultSetting.group] || [];
        let existingSettting = groups[defaultSetting.group].find((setting) => {
          return setting.name === defaultSetting.name;
        });

        if (!existingSettting) {
          groups[defaultSetting.group].push(
            (existingSettting = defaultSetting)
          );
        }

        existingSettting.hidden = defaultSetting.hidden;
      });

      this.customSettings.forEach((customSetting, k) => {
        groups[customSetting.group] = groups[customSetting.group] || [];
        let existingSettting = groups[customSetting.group].find((setting) => {
          return setting.name === customSetting.name;
        });

        if (!existingSettting) {
          groups[customSetting.group].push((existingSettting = customSetting));
        }

        existingSettting.hidden = customSetting.hidden;
      });

      // remove settings that are not in the defaults or custom settings
      Object.keys(groups).forEach((groupName) => {
        groups[groupName] = groups[groupName].filter((setting) => {
          return (
            Settings.defaults.find((defaultSetting) => {
              return defaultSetting.name === setting.name;
            }) ||
            this.customSettings.find((customSetting) => {
              return customSetting.name === setting.name;
            })
          );
        });
      });

      // remove empty groups
      Object.keys(groups).forEach((k) => {
        if (groups[k].length === 0) {
          delete groups[k];
        }
      });

      this.settings.next(groups);

      resolve(groups);
    });
  }
}
