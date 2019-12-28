# Salesforce CLI GUI
Electron application wrapping a GUI around the Salesforce CLI commands.

# Installation

The CLI GUI has been installed and tested on MacOS Catalina (10.15) and Windows 10.

1. Clone the repository
1. Navigate to the cloned directory
1. Execute `npm install`
1. Execute `npm run start`

The main page will then be displayed. Note that the first time you start the GUI it will retrieve the orgs that you are currently authenticated against - this may take a little while if you have hundreds.

![Main Page](https://i.imgur.com/948lXkl.png)

# Executing Commands

Click a button to configure and execute a command - this will open a dedicated window containing inputs matching some or all of the command parameters. 

![Command Page](https://i.imgur.com/0CDtzgL.png)

Follow the instructions to configure the command and press the button at the bottom of the screen to execute the command. The underlying Salesforce CLI command is displayed in a panel at the bottom of the screen so you can use this to ease yourself into the CLI if you aren't confident in the command line.

# Changing Directory
The GUI starts in the cloned repository directory. The home and command screens have a change directory button:

- Changing directory from the home screen affects all future commands
- Changing directory from a command screen affects just that command - any future commands are unaffected

The current directory is always displayed in the footer.

# Getting Help
The home and command screens have a help button - click this to access the help for the command in question. The help page displays the standard Salesforce CLI help and custom help configured with the command.

![Help Page](https://i.imgur.com/NtyplG6.png)
