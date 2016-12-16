'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');
var path = require('path');

function exists(p) {
  try {
    fs.lstatSync(path.resolve(__dirname, 'templates', p));
    console.log('exists: ' + path.resolve(__dirname, 'templates', p));
    return true;
  } catch (e) {
    console.log('error: ' + path.resolve(__dirname, 'templates', p));
    return false;
  }
}

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the new Kickass ' + chalk.red('aspnetcore-angular-2') + ' generator!'
    ));

    var prompts = [{
      name: 'appName',
      message: 'What\'s the project name ' + chalk.red('(this will also be your namespace name)') + '?'
    }, 
    {
      type: 'list',
      name: 'template',
      message: 'Which template do you want to use?',
      choices: [
            { name: 'Single Page App Template using ASP.NET Core and Angular 2', value: 'MovieReviewStarterKit' }
      ]
    },
    {
      type: 'confirm',
      name: 'createDir',
      message: 'Want me to create the directory for you?',
      default: true
    },
   
    {
      type: 'confirm',
      name: 'vsCode',
      message: 'Want me to generate VS Code debug configuration?',
      default: true
    }];

    return this.prompt(prompts).then(function (props) {
      var safeName = props.appName.replace(/^[^a-zA-Z]+/, '').replace(/[^a-zA-Z0-9]/g, '');
      
      if (safeName.length == 0) {
        safeName = 'WebApp';
      }

      props.safeName = safeName;
      props.dir = props.createDir ? safeName : '';

      this.props = props;
    }.bind(this));
  },

  writing: function () {
    this.log(chalk.red('\nCreating files...\n'));
    var basePath = this.props.template;
    [
      'appsettings.json', 'package.json', 'Program.cs', 'Startup.cs', 'tsconfig.json', 'web.config', 'typings.json',
      'karma.conf.js', 'protractor.conf.js', 'tslint.json', 'webpack.config.js'
    ].forEach(function (file) {
      if (!exists(basePath + '/src/WebApp/' + file)) return;
      this.template(
        this.templatePath(basePath, 'src/WebApp', file),
        this.destinationPath(this.props.dir, 'src', this.props.safeName, file),
        this.props
      );
    }.bind(this));
    
    this.template(
      this.templatePath(basePath, 'src/WebApp/MovieReviewStarterKit.csproj'),
      this.destinationPath(this.props.dir, 'src', this.props.safeName, this.props.safeName + '.csproj'),
      this.props
    );
    ['Api', 'Controllers', 'Properties', 'Views', 'wwwroot', 'config'].forEach(function (file) {
      if (!exists(basePath + '/src/WebApp/' + file)) return;
      this.template(
        this.templatePath(basePath, 'src/WebApp', file),
        this.destinationPath(this.props.dir, 'src', this.props.safeName, file),
        this.props
      );
    }.bind(this));
  },


  install: function () {
    this.log('\n' + chalk.red('Installing npm dependencies...') + '\n');
    if (this.props.createDir) {
      process.chdir(this.destinationPath(this.props.safeName, 'src', this.props.safeName));
    } else {
      process.chdir(this.destinationPath('src', this.props.safeName));
    }
    this.npmInstall('', function () {
      if (this.props.template == 'advanced') {
        this.spawnCommand('npm', ['run', 'build']);
      }
      this.log(chalk.red('\nHave fun working on ' + this.props.appName + '! for more info, check out my blog @http://myview.rahulnivi.net'));
    }.bind(this));
  }
});
