#!/usr/bin/env bash

cscope_filename="cscope_files"

find . -name '*.py' \
-o -name '*.java' \
-o -iname '*.[CH]' \
-o -name '*.cpp' \
-o -name '*.cc' \
-o -name '*.hpp'  \
> ${cscope_filename}

# -q: build a faster (but larger) database
# -R: search for symbols recursively
# -b: builds the database only, but does not start the Cscope browser
# -i: specifies the list of source files
cscope -q -R -b -i ${cscope_filename}
