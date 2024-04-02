# Part 2: Shared Setup (Operating System Agnostic)

[Back to Main](../SETUP.md)

## Step 1: Git and Github Setup

Git and Github are essential tools used by developers to share and collaborate on application code. You will be submitting all of your work through Github. We will also use this to collaborate when you run into issues with the lessons and your final project.

### Initialize your Project as a Git Repo

1. In VS Code, open new terminal: **Menu > Terminal > New Terminal**
2. Type the following command: `git init`, press enter (this initializes your project as a git repo)
3. Let's perform our first commit. Write the following commands
    1. `git add .`, press enter (stages all of your files to Git)
    2. `git commit -m "My first commit"`, press enter

### Create and/or Login to Github

1. Sign up for a <a href="https://github.com/join" target="github">Github account</a>
2. Log in to your <a href="https://github.com/login" target="github">Github account</a>

### Adding SSH Keys

SSH keys are a secure way to connect to your Github account without having to constantly provide username and password.

1. After logging into your Github account, click your **profile icon** upper right
2. Click **Settings**
3. In left sidebar, click **SSH and GPG Keys**
    - <a href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent?platform=mac" target="sshSetup">Add SSH Keys to **MacOS**</a>
    - <a href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent?platform=linux" target="sshSetup">Add SSH Keys to **Windows WSL (Linux)**</a>
4. <a href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account" target="sshAddToGithub">Add your SSH Key to Github</a> back in the original tab/window.

### Set default repo branch to master

1. After logging into your Github account, click your **profile icon** upper right
2. Click **Settings**
3. In left sidebar, click **Repositories**
4. Under **Repository default branch** set value to **master**
5. Click **Update**

### Connect your Project to a new Github Repo

1. After logging into your Github account, click on the **Plus Symbol** in upper right
2. Click **New Repository**
3. Fill in **Repository name:** UCLAX-WEB1-Last-First (e.g. UCLAX-WEB1-Gohman-Mitch)
4. Leave everything else as is (e.g. Public, defaults, etc)
5. Click **Create Repository** button at bottom
6. Click the Copy button of the second section "…or push an existing repository from the command line"
7. Back in VS Code, in your existing open terminal from prior steps (if you closed out **Menu > Terminal > New Terminal**)
8. Paste your clipboard into the terminal, press enter
9. Once it is done, you can refresh your repo in the browser and you will see your project is now connected.

## Step 2: Install VS Code Workspace Extensions

**VS Code** is a great app out of the box, but it truly shines when you add _User Defind Extensions_ that enhance it's capabilities. This will ensure your **VS Code** behaves like mine as well.

1. Click on **VS Code** extensions in the left sidebar
2. A new Left Sidebar will reveal the **Extensions Panel**
3. In the upper right of the **Extensions Panel**, click the filter icon symbol
4. Choose **Recommended**
5. Install all extensions under **Workspace Recommended**
