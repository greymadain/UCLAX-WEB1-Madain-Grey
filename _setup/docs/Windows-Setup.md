# Part 1: System Setup: Uclax Web 1: Windows

[Back to Main](../SETUP.md)

Unlike macOS and Linux (at least out of the box), Windows does not support bash/terminal. In order to get Windows to act more like macOS and Linux, we need to enable Windows Subsystem for Linux (WSL).

## Windows Step 1: Getting Started

1. Install <a href="https://code.visualstudio.com/download" target="vsCodeInstall">VS Code</a>
    1. While installing, be sure to check the **Add to PATH**
2. Install <a href="https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack" target="vscodeRemoteDevExt">VS Code Remote Development</a> Extension
3. Instal <a href="https://www.microsoft.com/store/apps/9n0dx20hk701" target="windowsTerminal">Windows Terminal</a> from the store
4. Download & Install <a href="https://www.google.com/chrome/" target="googleChrome">Google Chrome</a>
5. Download this [UCLAX-WEB1-Starter](https://github.com/uclax-teach/UCLAX-Web1-Starter/archive/refs/heads/master.zip) Resource
    - Rename the word Starter **UCLAX-WEB1-Starter** to your **Lastname-First** (e.g. UCLAX-WEB1-Starter becomes UCLAX-WEB1-Gohman-Mitch)
    - Open **UCLAX-WEB1-lastname-First** folder in **VS Code**

## Windows Step 2: Configure The Windows Subsystem for Linux (WSL)

1. Open Windows Command Prompt
2. execute command: `wsl --install`
3. Once the process of installing your Linux distribution with WSL is complete
    1. Windows Search > Turn Windows Feature on or off > enable select Windows Subsystem for Linux and update
    2. Reboot your computer
4. Open the distribution (Ubuntu by default) using the Start menu. You will be asked to create a User Name and Password for your Linux distribution.

## Windows Step 3: Open Project in VS Code and WSL

1. Open VS Code
2. Click the blue double arrows in bottom left
3. Start typing WSL, and choose the option to `WSL Connect`
4. Once VS Code is connected to your Ubuntu instance, we can right-click on any file on the left, and choose `Reveal in Explorer`
5. Move or Copy your **UCLAX-WEB1-lastname-First** to this directory
6. Back in VS Code, choose File > Open Folder > and Select your **UCLAX-WEB1-lastname-First** folder
7. Open Terminal: **Menu > Terminal > New Terminal**

## Windows Step 4: Install Apps for our Project

1. Run the following command: `bash ./_setup/scripts/win.install.sh` to install the rest of the rest of the applications needed for this course.
2. Choose File > Open Folder > and Select your **/home/username** folder
3. Open `.zshrc` in left sidebar
4. Change plugins section (around line 73) to include nvm as follows: `plugins=(git nvm)`
5. Choose File > Open Folder > and Select your **UCLAX-WEB1-lastname-First** folder
6. Open new terminal **Menu > Terminal > New Terminal**
7. In terminal, upper right, click on down caret and choose `Select Default Profile`
8. In option window, choose `zsh`
9. Open new terminal **Menu > Terminal > New Terminal**
10. Run command: `bash ./_setup/scripts/win.nvm.install.sh`
11. Run Command: `nvm install v20.9.0`
12. Run Command: `nvm use v20.9.0`
13. Run Command: `nvm alias default v20.9.0`
14. Run command: `npm install`

[Part 2: Shared Setup](./Shared-Setup.md)
