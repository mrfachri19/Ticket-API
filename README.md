TICKITZ Backend
online movie ticket API

About The Project
Built With
Getting Started
Prerequisites
Installation
Contact
About The Project
This application is a web-based online movie booking application for the backend / API.

Built With
some technology used in this project.

Express
JWT
MySQL
Redis
Nodemailer
Getting Started
Get started with this project, intructions on setting up your project locally. To get a local copy up and running follow these simple steps.

Prerequisites
Before installing, you must be install nodejs and npm.

Installation
Clone this repo
git clone 
Install NPM package
cd tickitz
npm install
Setting .env
create .env file


Add configuration in .env file

PORT=yourport
URL_BACKEND=yoururlbackend

DB_HOST=yourdbhostname
DB_USER=yourdbusername
DB_PASSWORD=yourdbpassword
DB_DATABASE=yourdbdatabasename

REDIS_HOST=yourredishost
REDIS_PORT=tourredisport
REDIS_PASSWORD=yourredispassword

EMAIL_USER=youremailuser
EMAIL_PASSWORD=youremailpassword

SECRET_KEY=yoursecretkey

MIDTRANS_IS_PRODUCTION=yourmidtransisproduction
MIDTRANS_SERVER_KEY=yourmidtransserverkey
MIDTRANS_CLIENT_KEY=yourmidtransclientkey

Start the server
npm run dev
Contact
Walid Nurudin - @walidnurudin - walidnurudin47@gmail.com

Project Link: https://github.com/Walidnurudin/tickitz
