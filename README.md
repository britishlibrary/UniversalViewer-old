# Universal Viewer

Navigate sequences of images in a zoomable, extensible interface.

[example](http://wellcomelibrary.org/player/b18035723)

[Google group](https://groups.google.com/forum/#!forum/wellcome-player)

## Stable Builds

See the [GitHub releases page](https://github.com/britishlibrary/UniversalViewer/releases).

## Development

Please see the [wiki](https://github.com/britishlibrary/UniversalViewer/wiki) for instructions on how to customise the viewer for your own projects.

### First Time Setup

All command-line operations for building the Universal Viewer are scripted using [Grunt](http://gruntjs.com/) which is based on [Node.js](http://nodejs.org/). We are using Node for this project because it provides a powerful cross-platform collection of tools with minimal setup overhead. To get set up:

1. Install [Node.js](http://nodejs.org), if you haven't already
1. Install the Grunt command line interface (if you haven't already); on the command line, run `npm install -g grunt-cli`
1. Clone the 'UniversalViewer' repository:
`git clone https://github.com/britishlibrary/UniversalViewer`
1. On the command line, go in to the 'UniversalViewer' folder
1. Run `git submodule init`
1. Run `git submodule update`
1. Run `npm install`

### Debug Builds

To build the debug version of the viewer, just run (on the command line, in the 'UniversalViewer' folder):

	grunt

This will compile the [.less](http://lesscss.org) files into .css and [.ts](http://typescriptlang.org) files into .js with sourcemaps to aid in debugging.

### Release Builds

To build the release version of the viewer, just run (on the command line, in the 'UniversalViewer' folder):

	grunt build

The built files appear in the 'build' folder.

If you want to build tar and zip files for distribution (they will also appear in the 'build' folder), use:

	grunt package

Note that the 'build' folder is masked with .gitignore; it's just for your local use, and won't be checked in to the repository.

### Examples

To view the examples run:

    grunt serve

## License

The Universal Viewer is released under the MIT license. For details, see the file LICENSE.txt.
