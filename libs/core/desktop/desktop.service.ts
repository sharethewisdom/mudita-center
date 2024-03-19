/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/blob/master/LICENSE.md
 */

import { exec } from "child_process"
import sudoPrompt from "@vscode/sudo-prompt"

enum SerialPortGroup {
  dialout = "dialout",
  uucp = "uucp",
}

const POTENTIAL_GROUPS = [SerialPortGroup.dialout, SerialPortGroup.uucp];

export class DesktopService {
  public async isLinux(): Promise<boolean> {
    return process.platform === "linux"
  }

  public async hasUserSerialPortAccess(): Promise<boolean> {
    const userGroups = await this.getUserGroups();
    return POTENTIAL_GROUPS.some(group => userGroups.includes(group));
  }

  public async addUserToSerialPortGroup(): Promise<void> {
    const userGroups = await this.getUserGroups();
    const groupName = POTENTIAL_GROUPS.find(group => !userGroups.includes(group));

    if (groupName) {
      const command = `usermod -aG ${groupName} $USER`;
      // Set simpler process.title, otherwise, there is an error from sudoPrompt.exec - 'process.title cannot be used as a valid name.'
      process.title = "Mudita Center: assign serial port access";

      return new Promise<void>((resolve, reject) => {
        sudoPrompt.exec(command, { name: 'User Serial Port Access' }, (error) => {
          if (error === null) {
            resolve();
          } else {
            reject("Could not add user to serial port group");
          }
        });
      });
    }
  }

  private async getUserGroups(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      exec("groups", (error, stdout, stderr) => {
        if (error || stderr) {
          reject(`${error?.name} - ${error?.message} - ${stderr}`);
        } else {
          const groups = stdout.trim().split(/\s+/);
          resolve(groups);
        }
      });
    });
  }
}
