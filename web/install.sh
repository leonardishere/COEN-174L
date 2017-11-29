WEBDIR=/webpages/$USER/coen174

npm run build-scu
mkdir -p $WEBDIR
cp -R dist $WEBDIR
cp .htaccess $WEBDIR
chmod -R 755 $WEBDIR
