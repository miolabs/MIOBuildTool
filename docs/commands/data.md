# Dev

## data (parameters)

Manage the datamodel.

Generate the typescript data classes of the project from the datamodel xml file.

## Parameters

* `-i, --init` - Initialize the datamodel.xml with example data.
* `-s, --sourcepath [path]` - source xml files to generate the
  datamodel files from. Default: `model/datamodel.xml`
* `-t, --targetdir [path]` - create the model files into a different location.
  Default: `model/`
* `-m, --module` - generate the model entities for ES6 imports

<!-- ## Planned features

* Update the config file on initialization -->