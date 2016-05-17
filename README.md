# front-end e-commerce project

> The front-end project for the e-commerce-app project.

This project contains the front-end for the e-commerce-app project.

## Prerequisites

Before everything else, the following needs to be installed:
- `nodejs` https://nodejs.org/download/release/v0.10.32/

Run both the installers, in case this isn't installed yet.
On Windows, restart pc after the installation.
This project works best on node version v0.10.32.

The following tools must be installed and accessible from the command line (windows powershell):

- `bower` https://www.npmjs.com/package/bower
- `git` http://git-for-windows.github.io/

`bower` can be installed and updated using `npm`.
Using Windows? Download Git-for-windows following the instructions on the link to bower shown above.

Bower:
```sh
npm install -g bower
```

## Getting started

Navigate to the 'front-end' folder using command line.

Before getting to the code, one must first setup the project using:

```sh
npm install
```

Please check the front-end folder if there are folders created called 'bower_components' & 'node_modules' after this.

*Missing 'bower_components' and using Windows?*<br>
Open Git Bash and do 'bower install' there.

*Getting "Unable to find suitable version for <package>, please choose one:"?*<br>
Select the one that says "is required by frontEnd".

After this has finished, one can build the project by typing:

```sh
gulp
```

*Getting "Error: Cannot find module <name>"?*<br>
Run 'npm install' once again.

*Still missing modules?*<br>
Manually install the missing module by using
```sh
npm install <module>
```

## Running the project

After getting started, the project can be run on a local webserver on port 3000 by typing:

```sh
gulp serve
```

A browser window with localhost:3000 will pop up.
Do not use this. Check the command line and look for the following:

```sh
Access URLs:
 ----------------------------------------
       Local: http://localhost:3000/
    External: yourIp:3000/
 ----------------------------------------
```

Use the external IP for this project.

This will also start watching the source code for changes and run tests on change.

## Deployment

*Back end running on same pc?*<br>
Front end should be working now!

*Is the back end running somewhere else?*<br>
Go to the following file:
```
front-end > src > app > index.constants.js
```

Look for the following variable:
```sh
apiUrl = 'http://' + location.hostname + ':8901';
```

Change the location.hostname into the IP where the back end is running. Leave the port on :8901.

Example:

```sh
apiUrl = 'http://192.168.178.15:8901';
```
