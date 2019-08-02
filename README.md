#Local Development
##Before you start

- using pip install packages required to run the application:
  - django
  - debug toolbar
  - apostle
  `pip install -r requirements.pip`
- set up config file at top level directory (`config.json`)
- follow instructions for setting up web app
  - `cd client`
  - `npm install`

## Virtual environment
Windows - 
Linux -`source myvenv/bin/activate`

## Database migrations.
The virtual environment must be started before running migrations.  Two commands are required:
- `python manage.py makemigrations` set the migrations up and does any pre-validation
- `python manage.py migrate` runs the migrations

## start server

## Setting up users
Need to have virtual environment and server up and running
- `python manage.py createsuperuser` 
## code base

### Folder structure
This is what all the folders here are for:
```bash
.                  # tree -L 1 -d
├── epic           # non React pages, database set up, api's (django)
├── mysite         # overall setup including config 
├── myvenv         # virtual environment 
├── test           # test folder for python code
```
## testing 

All changes should be tested,  Add test files to the test folder in the appropriate place.

### python tests
#### setting up tests
|
|- test

New test folders will need an empty file `__init__.py` included so that the tests are picked up as part of the test suite.

####Running tests
Python tests:
- single tests
  - right click on test in project view panel and run test
- all tests
  - ensure myvenv is launched
  - in terminal use `python manage.py test`

  

