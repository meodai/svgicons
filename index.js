const fs = require('fs');
const path = require('path');
const SVGO = require('svgo');
const currentIcons = require('./icons.json');
const currentIconNames = Object.keys(currentIcons.icons);

const mainColor = /#003cb4/g;
const highlightColor = /#00bec8/g;

// svgo . --pretty --enable removeDimensions --enable removeStyleElement --disable=removeViewBox

const svgo = new SVGO({
  pretty: true,
  plugins: [{
    cleanupAttrs: true,
  },{
    removeXMLProcInst: true,
  },{
    removeComments: true,
  },{
    removeMetadata: true,
  },{
    removeDesc: true,
  },{
    removeUselessDefs: true,
  },{
    removeEditorsNSData: true,
  },{
    removeEmptyAttrs: true,
  },{
    removeHiddenElems: true,
  },{
    removeEmptyText: true,
  },{
    removeEmptyContainers: true,
  },{
    removeViewBox: false,
  },{
    cleanupEnableBackground: true,
  },{
    convertStyleToAttrs: true,
  },{
    convertColors: true,
  },{
    convertPathData: true,
  },{
    convertTransform: true,
  },{
    removeUnknownsAndDefaults: true,
  },{
    removeNonInheritableGroupAttrs: true,
  },{
    removeUselessStrokeAndFill: true,
  },{
    removeUnusedNS: true,
  },{
    cleanupIDs: true,
  },{
    cleanupNumericValues: true,
  },{
    moveElemsAttrsToGroup: true,
  },{
    moveGroupAttrsToElems: true,
  },{
    collapseGroups: true,
  },{
    removeRasterImages: false,
  },{
    mergePaths: true,
  },{
    convertShapeToPath: true,
  },{
    sortAttrs: true,
  },{
    removeDimensions: true,
  }]
  },
);

const files = fs.readdirSync(path.join(__dirname, 'src'));
const newFiles = [];

function optimizeTo(srcPath, destPath) {
  return fs.readFile(srcPath, "utf8", function (err, data) {
    //console.log(`reading ${srcPath}`);

    if (err) {
      throw err;
    }

    svgo.optimize(data, {
      path: destPath
    }).then(function (result) {
      fs.writeFile(destPath, result.data.replace(mainColor, 'currentColor'), function (err) {
        if (err) {
          return console.log(err);
        }
        console.log(`${srcPath} was saved and optimized!`);
      });
    });

  });
}

for (const file of files) {
  let srcPath = path.join(__dirname, 'src', file);

  if (file.endsWith('-icon.svg')) {
    let filename = 'ui-' + file.replace('-icon.svg', '');
    let destPath = path.join(__dirname, 'dist', filename + '.svg');
    optimizeTo(srcPath, destPath);

    if( !currentIconNames.find(name => (name === filename)) ) {
      newFiles.push(filename);
    }
  }

  if (file.endsWith('-logo.svg')) {
    let filename = 'logo-' + file.replace('-logo.svg', '');
    let destPath = path.join(__dirname, 'dist', filename + '.svg');
    optimizeTo(srcPath, destPath);
    
    if (!currentIconNames.find(name => (name === filename))) {
      newFiles.push(filename);
    }
  }

  if (file.endsWith('-pikto-linie.svg')) {
    let filename = 'pikto-' + file.replace('-pikto-linie.svg', '');
    let destPath = path.join(__dirname, 'dist', filename + '.svg');
    optimizeTo(srcPath, destPath);

    if (!currentIconNames.find(name => (name === filename))) {
      newFiles.push(filename);
    }
  }
} 

if( newFiles.length ) {
  console.warn('Some files are new or not in icons.json yet:', newFiles);
}