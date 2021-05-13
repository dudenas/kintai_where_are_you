#!/bin/bash
if [[ $# -ne 2 ]]; then
    echo "give name to file"
    echo "give input folder"
    exit 2
fi

input_dir=$2
echo $input_dir
for i in $input_dir/*; do
      filename="$(basename -- $i)"
      echo $filename

done > $1_data.txt