#!/bin/bash
WEBDIR=${1:-/webpages/$USER/coen174}

echo " *** Building site"
npm run build-scu

echo " *** Installing to $WEBDIR"
mkdir -p $WEBDIR
cp -r dist/* $WEBDIR
cp .htaccess $WEBDIR
chmod -R 755 $WEBDIR

echo " *** Done!"
