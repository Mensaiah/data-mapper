# data-mapper
# hotel_manager



### Getting Started
 Below are instructions to kick start AutoMart in your local server.

 **First off, you must have node/npm installed. Install the latest node version [here](https://nodejs.org/en/download/). Not to worry, the npm package comes along with the node package**

 ### Installation
 
 1. Clone this repository by running this on your terminal: `git clone https://github.com/Mensaiah/data-mapper.git`
 2. Navigate to the project's directory with: `cd hostel_manager`
 3. Run `npm install` to install dependencies
 4. You will need to connect to the database using the `.env`


 ### DB setup

- Install Postgres
- Create db related config values in `.env` file following `.env-sample`



 5. Run `db:sequelize migrate` to create tables
 6. Run `db:sequelize seed:all` to seed data
 7. Run  `npm run dev` to start the server on a local host
