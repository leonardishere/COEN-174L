# COEN-174L

# Setup

Note: Anything in <> braces should be substituded with a real value.

## Prereqs

Open a terminal in the project directory (where this readme is located)

Run the following command `export PATH="$PWD/node-v6.11.3-linux-x64/bin`

## Front End

Change into the web directory (cd web)

Run `./install.sh <DIR>`, replacing <DIR> with the folder you would like the webpages placed in. The <DIR> will default to `/webpages/$USER/coen174` if unspecified. The command may take a few minutes.

At this point you should have a working site. If you used the default path the webpage will be accessable at http://students.engr.scu.edu/~<your user name>/coen174


## Back end

If you want to run your own copy of the database then you should follow this section.

Change into the api directory and run `npm run devel`

Leave this terminal open.

Open the web/src/environments/environment.prod.ts file

Replace the api and loginUrl values with the address of the computer you are running the backend on.

Your ip address can be determinted by running `ifconfig eth0 | grep inet` and looking at the first set of numbers after the word inet. Save the IP address as it will be useful in other places.


## Google Auth

Unfortunatly at this point the login page will still be redirecting to our ~rdecker url unless you make your own google sign in page.

Follow the process at https://developers.google.com/identity/sign-in/web/devconsole-project

Note that you might have to do this with a personal gmail account and not one mananged by a domain such as the scu ones.

For the Authorised JavaScript origins enter your web domain without any path (ex: http://students.engr.scu.edu)

For the Authorised redirect URIs enter the address of your backend computer followed by /auth/callback (ex: 127.0.0.1:3000/auth/callback).

Make sure you save the Client ID and Client secret as you will need them in a minute.

Open api/routes/auth.ts

Replace the redirectUrl on line 9 with the full url of your webpage followed by /#/login, ex: http://students.engr.scu.edu/~<your user name>/coen174/#/;login.

Replace the clientID and clientSecret on lines 13+14 with the ones generated on the google API console.

Save the file.

At this point if you attempt to login you should now be redirected to your copy of the site.
