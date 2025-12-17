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

# Variables that are baked as URL-shaped placeholders (https://BAKED_VAR)
BAKED_URL_VARS="SITE_URL PLAUSIBLE_SCRIPT_URL"

PREFIX="BAKED_"
# Baked has always https://BAKED_VAR
# Will be replaced with whatever VAR value http:// or https:// or any string
URL_PREFIX="https://${PREFIX}"
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
    # POSIX sh-compatible indirect expansion
    eval "VAL=\$$VAR"
    if [ -z "$VAL" ]; then
        echo "$VAR required environment variable is not set. Please set it and rerun the script."
        exit 1
    fi
done

# Default optional variables to empty string
for VAR in $OPTIONAL_VARS; do
    eval "VAL=\$$VAR"
    if [ -z "$VAL" ]; then
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
        # Read file once into a variable for faster checks
        FILE_CONTENT=$(cat "$file")
        FILE_REPLACED=0

        # Loop over each variable that needs to be replaced
        for VAR in $ALL_VARS; do

            PLACEHOLDER="${PREFIX}${VAR}"
            URL_PLACEHOLDER="${URL_PREFIX}${VAR}"

            # Get variable value (POSIX sh compatible)
            # Optional variables are guaranteed to have a value (possibly empty)
            eval "VALUE=\$$VAR"

            # Escape VALUE for sed replacement:
            # - & → \&  (ampersand is special in replacement, expands to the whole match)
            # - | → \|  (pipe is used as sed delimiter)
            ESCAPED_VALUE=$(printf '%s' "$VALUE" | sed 's/[&|]/\\&/g')

            # Handle baked URL variables (e.g. https://BAKED_SITE_URL)
            # These must be replaced as full URLs to avoid invalid or double protocols
            for URL_VAR in $BAKED_URL_VARS; do
                # Check if current variable is a baked URL var
                if [ "$VAR" = "$URL_VAR" ]; then
                    # Skip if URL placeholder is not present in this file, 2 - parent loop, i - case insensitive
                    echo "$FILE_CONTENT" | grep -qi "$URL_PLACEHOLDER" || continue 2

                    # Print file name once on first replacement
                    if [ "$FILE_REPLACED" -eq 0 ]; then
                        echo "Processing file: $file"
                        FILE_REPLACED=1
                    fi

                    # Log replacement
                    # Log $VALUE, because $ESCAPED_VALUE is just for sed
                    echo "replaced: $URL_PLACEHOLDER -> $VALUE"

                    # Replace full URL placeholder in-place, I - case insensitive
                    sed -i "s|$URL_PLACEHOLDER|$ESCAPED_VALUE|gI" "$file"

                    # Continue with next variable, 2 - parent loop
                    continue 2
                fi
            done

            # Note: exits loop early if placeholder is not present in the file, i - case insensitive
            echo "$FILE_CONTENT" | grep -qi "$PLACEHOLDER" || continue

            # Print file name only on first replacement
            if [ "$FILE_REPLACED" -eq 0 ]; then
                echo "Processing file: $file"
                FILE_REPLACED=1
            fi

            # Log what is replaced
            if [ -z "$VALUE" ]; then
                echo "replaced: $PLACEHOLDER -> (empty)"
            else
                echo "replaced: $PLACEHOLDER -> $VALUE"
            fi

            # Perform in-place replacement using sed
            # "s|pattern|replacement|g" replaces all occurrences in the file
            # The | delimiter is used instead of / to avoid conflicts with paths
            # I - case insensitive
            # Example: BAKED_SITE_URL → https://example.com
            sed -i "s|$PLACEHOLDER|$ESCAPED_VALUE|gI" "$file"

        done
    done
done
