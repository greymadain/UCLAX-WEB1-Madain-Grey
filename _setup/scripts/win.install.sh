#!/bin/bash

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Shared Pre Install
source "${__dir}/shared.install.pre.sh"

childScriptTitle="Windows:"

echo "$globalScriptTitle $childScriptTitle Start"

# Update and Upgrade packages
echo "$globalScriptTitle $childScriptTitle  Update and Upgrade packages"
sudo apt update && sudo apt upgrade

# Install cURL
echo "$globalScriptTitle $childScriptTitle Install cURL"
sudo apt install curl

# Install Git
echo "$globalScriptTitle $childScriptTitle Install Git"
sudo apt-get install git

# Install Zsh
echo "$globalScriptTitle $childScriptTitle Install Zsh"
sudo apt install zsh -y
echo "$globalScriptTitle $childScriptTitle Make Zsh Default Shell"
chsh -s $(which zsh)

# Install Oh My Zsh
echo "$globalScriptTitle $childScriptTitle Install Oh My Zsh"
sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
echo "$globalScriptTitle $childScriptTitle Install Oh My Zsh Icons/Fonts"
apt install fonts-powerline -y
echo "$globalScriptTitle $childScriptTitle Install Oh My Zsh Syntax Highlighting"
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting