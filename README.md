# PXLPrototype MQTT prototype

To setup the application run this command in the be folder: composer install

Then go into the be/devops folder, and run: docker compose up, to run the database for the backend.

Also run: docker run -d --name emqx -e EMQX_LISTENERS__TCP__DEFAULT__BIND=1883 -p 18083:18083 -p 1883:1883 -p 8083:8083 emqx:latest

This will start the MQTT EMQX-broker needed for this prototype.

Login credentials for the webmanager of EMQX are at localhost:18083/:

login:admin,
password: public

Then run: php artisan migrate, in the backend, to setup and seed the database.

Then run: php artisan serve,  in the backend.

For the frontend run: npm install.

Then run: npm run start, to run in local web browser.

The login credentials are:

test1@example.com

test2@example.com

With password: password123.
