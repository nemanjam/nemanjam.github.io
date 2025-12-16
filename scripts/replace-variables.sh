#!/bin/sh

# Note: sh shell syntax, NO bash in Alpine Nginx

# Summary:
# 1. Required variables are checked to be defined.
# 2. Optional variables are initialized to empty string if undefined.
# 3. All files in DIST_PATH with specified extensions are processed.
# 4. Placeholders of the form PREFIX_VAR are replaced with actual environment variable values.

# Define required and optional environment variables (space-separated strings for /bin/sh)
REQUIRED_VARS="SITE_URL PLAUSIBLE_SCRIPT_URL PLAUSIBLE_DOMAIN"
OPTIONAL_VARS="PREVIEW_MODE"

PREFIX="BAKED_"
FILE_EXTENSIONS="html js xml json"

# Read DIST_PATH from environment variable
# Do not provide a default; it must be set
if [ -z "${DIST_PATH}" ]; then
    echo "ERROR: DIST_PATH environment variable is not set."
    exit 1
fi

# Check if the directory exists
if [ ! -d "${DIST_PATH}" ]; then
    echo "ERROR: DIST_PATH directory '${DIST_PATH}' does not exist."
    exit 1
fi

# Check required environment variables are defined
for VAR in $REQUIRED_VARS; do
    if [ -z "${!VAR}" ]; then
        echo "$VAR required environment variable is not set. Please set it and rerun the script."
        exit 1
    fi
done

# Default optional variables to empty string
for VAR in $OPTIONAL_VARS; do
    if [ -z "${!VAR}" ]; then
        eval "$VAR=''"
    fi
done

# Combine required and optional variables into a single string
ALL_VARS="$REQUIRED_VARS $OPTIONAL_VARS"

# Find and replace placeholders in files
for ext in $FILE_EXTENSIONS; do

    # Use 'find' to recursively search for all files with the current extension
    # -type f ensures only regular files are returned
    # -name "*.$ext" matches files ending with the current extension
    find "$DIST_PATH" -type f -name "*.$ext" |

    # Pipe the list of found files into a while loop for processing
    while read -r file; do

        echo "[replace] Processing file: $file"

        # Loop over each variable that needs to be replaced
        for VAR in $ALL_VARS; do

            # Retrieve the value of the variable (POSIX sh compatible)
            # Optional variables are guaranteed to have a value (possibly empty)
            eval "VALUE=\$$VAR"

            if [ -z "$VALUE" ]; then
                echo "[replace]   ${PREFIX}${VAR} -> (empty)"
            else
                echo "[replace]   ${PREFIX}${VAR} -> ${VALUE}"
            fi

            # Perform in-place replacement using sed
            # "s|pattern|replacement|g" replaces all occurrences in the file
            # The | delimiter is used instead of / to avoid conflicts with paths
            # Example: BAKED_SITE_URL → https://example.com
            sed -i "s|${PREFIX}$VAR|$VALUE|g" "$file"

        done
    done
done
