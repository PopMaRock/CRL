#!/bin/bash

# Counter for the new file names
counter=1

# Loop through all PNG files in the current directory
for file in *.png; do
  # Check if the file exists to avoid errors
  if [ -f "$file" ]; then
    # Rename the file to the new name with the counter
    mv "$file" "$counter.png"
    # Increment the counter
    counter=$((counter + 1))
  fi
done

echo "Renaming complete."
