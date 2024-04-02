#!/bin/bash

osTitle="MacOS:"

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Shared Pre Install
source "${__dir}/shared.install.pre.sh"

echo "$scriptTitle Start"

# Homebrew
echo "$scriptTitle Install or Update Homebrew"

which -s brew
if [[ $? != 0 ]] ; then
    echo "Install Homebrew"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "Update Homebrew"
    brew update
fi

# Zsh
echo "$scriptTitle Install Zsh"

if [ -n "`$SHELL -c 'echo $ZSH_VERSION'`" ]; then
    echo "ZSH is already installed."
elif [ -n "`$SHELL -c 'echo $BASH_VERSION'`" ]; then
    echo "BASH is default, must be older OS - installing ZSH."
    brew install zsh
    chsh -s /usr/local/bin/zsh
else
    echo "Odd, neither ZSH or BASH is installed, attempting to install ZSH"
    brew install zsh
    chsh -s /usr/local/bin/zsh
fi

# Oh My Zsh
echo "$scriptTitle Install Oh-My-Zsh"

if [ -d ~/.oh-my-zsh ]; then
    echo "Oh-My-Zsh Already installed"
else
    echo "Install Oh-My-Zsh"
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

# Update .zshrc with app specific tools
echo "$scriptTitle Configuring Bash Profiles"

# NVM Support
if grep -q NVM_DIR ~/.zshrc; then
    echo "Update .zshrc: Already Exists: NVM Support"
else
    echo "Update .zshrc: Add NVM Support"
    echo -e "# NVM Support\nexport NVM_DIR=\"\$HOME/.nvm\"\nsource \$(brew --prefix nvm)/nvm.sh\n\n$(cat ~/.zshrc)" > ~/.zshrc
fi

# VS Code Support and Homebrew Support
echo "Update .zshrc: Add VS Code shell code command and Homebrew Path"
echo -e "# VS Code code command\nexport PATH=\"\$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin:/opt/homebrew/bin\"\n\n$(cat ~/.zshrc)" > ~/.zshrc

# Manual sourcing of VS Code code command
export PATH="$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin:/opt/homebrew/bin"

# NVM
echo "$scriptTitle Install Node Version Manager (NVM)"

if [[ -f $HOME/.nvm/nvm.sh ]] ; then
    echo "NVM already Installed"
else
    echo "Install NVM"
    brew install nvm
fi

# Manual Sourcing of NVM Support
export NVM_DIR="$HOME/.nvm"
source $(brew --prefix nvm)/nvm.sh

echo "NVM: Install Node Version 18"
nvm install 18.12.1

echo "NVM: Make Node Version 18 the default"
nvm alias default 18.12.1

# Google Chrome
echo "$scriptTitle Install Google Chrome"

if [ -d "/Applications/Google Chrome.app" ]; then
    echo "Google Chrome Already installed"
else
    echo "Install Google Chrome"
    brew install google-chrome
fi