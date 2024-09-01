#!/bin/bash
mkdir "$PWD"/svg
for file in "$PWD"/*.png
do
filename=$(basename "$file")
filename=$(echo "$filename" | cut -f 1 -d '.')
echo $filename
#inkscape "$file" --export-plain-svg --export-filename="$PWD"/svg/"${filename%}.svg"
autotrace -color-count 2 -output-format svg -output-file "$PWD"/svg/"${filename%}.svg" -report-progress "$file"
done
echo "fin"
read
