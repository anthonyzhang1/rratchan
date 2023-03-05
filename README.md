# rratchan
rratchan is an imageboard similar to 4channel. \
You can register for an account, browse a board's catalog, view threads, anonymously start threads, anonymously reply to threads, bookmark threads, view users' pages, and more.

rratchan uses MySQL for its database, Express for its back end, and React for its front end. \
rratchan was created for my university's Database Systems course in Spring 2022.

#### rratchan was not designed entirely with security in mind. This is more a project for learning.

# Installation Instructions
You only need to complete the installation process once. Also, you will need MySQL and Node.js.

### Step 1: Enter your database credentials into the `config.env` file in the `server` directory.
Enter your database username in the `DB_USER` field and your database password in the `DB_PASSWORD` field, replacing `root`.\
Example: `DB_USER=admin`, `DB_PASSWORD=password`.

You probably should not change anything else in `config.env`.

### Step 2: Copy the contents of the `.sql` files in the `server/database` directory into MySQL Workbench or a similar application.
First, copy everything in `buildDatabase.sql` into MySQL Workbench, then execute the script.\
Next, if you want to add some starter boards to rratchan, copy everything in `insertInitialData.sql` into MySQL Workbench, then execute the script.
This is optional.

After executing these scripts, you should be able to see rratchan's schema in your MySQL instance.

### Step 3: Install the backend and frontend dependencies.
Run the following commands from the terminal, assuming the current directory is `.../rratchan`:
1. `cd server` (your current directory should now be `.../rratchan/server`)
2. `npm i` (wait for the install to finish before proceeding)
3. `npm run install-client` (wait for the install to finish before proceeding)

#### You have now finished installing rratchan.

# Run Instructions
These steps must be repeated each time you wish to start the server.

Run the following commands from the terminal, assuming the current directory is `.../rratchan`:
1. `cd server` (your current directory should now be `.../rratchan/server`)
2. `npm run both` (starting the server will take a few seconds)

#### The server is now running. You can go to rratchan's home page by entering `localhost:3000` into your browser's address bar.