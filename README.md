# Media Manager App
A cross-platform media management application built with Go and Wails. This app allows users to upload, tag, organize, and view images, and export them as albums. The app is designed to be intuitive and user-friendly.

## Features
- Image Upload: Easily upload images to the application.

- Tagging and Albums: Organize your images with tags and albums.

- Gallery View: View thumbnails of your images, with the option to filter by tags and albums.

- Album Export: Export albums to a zip file or folder.

## Platforms
The app is available for Windows, macOS, and Linux.

## Installation

Looks like we needed to test better for the build enviroment the database does not seem to be connected on production.
### Step-by-Step Setup for MediaManager:
### Clone the Repository:

First, clone the repository to your local machine:

```git clone https://github.com/CaptianRedBeard/mediamanager.git```
#### Navigate into the project directory:

```cd mediamanager```
### Install Node.js and npm:

Depending on your operating system, you will install Node.js (which includes npm) as follows:

#### macOS (using Homebrew):

```brew install node```
#### Windows:

Go to the official Node.js download page: https://nodejs.org/

Download and run the Windows Installer (e.g., .msi file).

Follow the installation steps to install both Node.js and npm.

#### Debian-based Systems (Ubuntu, etc.):

```sudo apt update```
```sudo apt install nodejs npm```
#### RHEL-based Systems (CentOS, Fedora, etc.):

##### For CentOS 7 or earlier:

```sudo yum install nodejs npm```
##### For Fedora:

```sudo dnf install nodejs npm```
### Install Dependencies:

Now, install all the dependencies for the frontend part of the application:
- Node v24.4.1
- npm 11.4.2
- 
#### Navigate to the frontend directory:

```cd frontend```

#### Then run:

```npm install```
This installs the required Node.js packages for building and running the frontend.

### Build the Frontend:

After installing the dependencies, run the build command to compile the frontend assets:
```npm run build```
This command will build the assets required for the Wails framework to use.

### Run the Wails App:

Finally, go back to the root of the project and run the Wails development server:
```cd ..```
```wails dev```
This will start the Wails app in development mode and launch the app with hot reloading, allowing you to make changes and see them immediately.

### Notes:
npm run build compiles the frontend assets, so it’s essential to run this before using the Wails development server.

wails dev will start the Go backend and the frontend using Wails. It will also open the app in a local window, so you can interact with it as a desktop application.

Ensure that you have Go installed in your environment because Wails relies on Go for the backend. If you haven’t already, install Go by following the instructions on Go's official website.

### Troubleshooting:
If you encounter issues during the npm install step, check that your Node.js and npm versions are up to date.

If you run into any errors during the wails dev step, verify that Wails is installed globally by running:

```wails doctor```
Should see: 
Version | v2.10.2
If it's not installed, you can install it globally with:
```go get github.com/wailsapp/wails/v2/cmd/wails```




~~### Download~~
~~You can download the latest release for your platform from the Releases Page.~~

~~### Windows~~
~~Download the .exe file from the release page.~~

~~Run the installer and follow the on-screen instructions.~~

~~### macOS~~
~~Download the .dmg file from the release page.~~

~~Open the .dmg file and drag the app to your Applications folder.~~

~~### Linux~~
~~Download the appropriate .tar.gz or .AppImage file.~~

~~For .tar.gz: Extract the file and run the app.~~

~~For .AppImage: Make the file executable (chmod +x mediamanager.AppImage) and run it.~~

## Usage
- Launch the App: Open the app after installation.

- Upload Images: Use the "Upload Images" button to select and upload images to the app.

- View Gallery: Use the gallery view to filter images by tags and albums.

- Tag and Organize: Add tags to your images and organize them into albums.

- Export Albums: Select an album, choose an export destination, and export it as a zip file or folder.

## Contributing
We welcome contributions! If you'd like to improve the app or fix bugs, feel free to fork the repository and submit a pull request. Before contributing, please check the issues for open tasks and bug reports.

### Steps to contribute:
- Fork the repository.

- Create a new branch for your changes.

- Implement your changes.

- Push your changes and create a pull request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Planned features:
- Tag and Album deletion
- Sorting gallery results
- Paging through Gallery results in edit mode
- Support for video formats
- Private media to hide from veiw
- Add text to media 
