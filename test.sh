#!/bin/bash

ERROR="$(npm run spellcheck 2>&1 > /dev/null)"

if [[ -z $ERROR ]]; then # no errors
  echo "if happened"
else # errors
  echo "else happened"
fi
