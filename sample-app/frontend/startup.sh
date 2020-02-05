#!/bin/bash

env_config_location=/app/build/env-config.js
rm -rf $env_config_location
touch $env_config_location

echo "window.env = {" >> $env_config_location

for varname in REACT_APP_BACKEND_URI
do
  value=${!varname}
  echo "  $varname: \"$value\"," >> $env_config_location
done

echo "}" >> $env_config_location

echo "Running... "
exec serve -s build
