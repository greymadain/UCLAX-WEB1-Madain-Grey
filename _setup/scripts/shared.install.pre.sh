#!/bin/bash

abort() {
    printf "%s\n" "$@"
    exit 1
}

# Fail fast with a concise message when not using bash
# Single brackets are needed here for POSIX compatibility
# shellcheck disable=SC2292
if [ -z "${BASH_VERSION:-}" ]
then
    abort "Bash is required to interpret this script."
fi

###################
# Props
###################
courseName="UCLAX-Web1"
scriptTitle="$courseName Setup: $osTitle"


###################
# Methods
###################
function wordUpperCaseFirst {
    echo $(tr '[:lower:]' '[:upper:]' <<< ${1:0:1})${1:1}
}

function toLowerCase {
    tr [:upper:] [:lower:] <<< "${*}"
}

function toTitleCase {
    lowercase=$(toLowerCase $1)
    title=$(wordUpperCaseFirst $lowercase)
    echo $title
}

###################
# Capture User Details in bash prompt
###################
echo "$scriptTitle User specific settings"

read -p "Enter your First Name: " userfirstname
ufname=$(toTitleCase $userfirstname)

read -p "Enter your Last Name: " userlastname
ulname=$(toTitleCase $userlastname)

read -p "Enter your Email: " useremail
uemail=$(toLowerCase $useremail)

echo "$scriptTitle User Details: Name: $ufname $ulname, Email: $uemail attending $courseName"

###################
# Update Git Settings
###################
echo "$globalScriptTitle Git: Update Author Name and Email"
git config --global user.name "$ufname $ulname"
git config --global user.email "$uemail"

echo "$globalScriptTitle Git: Set git default branch back to the original \"master\" branch. In case they tried to change it to main; which is silly."
git config --global init.defaultbranch "master"

echo "$globalScriptTitle Git: Use VS Code as Git Editor"
git config --global core.editor "code --wait"

