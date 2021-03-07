#Local Development
##Before you start

- using pip install packages required to run the application:
  - django
  `pip install -r requirements.txt`
- set up config file at top level directory (`config.json`) if you can't set environment variables.
```
{
  "ENV_RUNNING": "TEST",
  "DEFAULT": {
    "SECRET_KEY": "?????????????????????????????????????????????????????????",
    "ADMIN_NAME": "administrator",
    "AWS_DEFAULT_REGION": "ap-northeast-2",
    "MAX_IMAGE_SIZE": 5242880
  },
  "TEST": {
    "DEBUG": "True",
    "ALLOWED_HOSTS": [],
    "TEST_TIMEOUT": 20,
    "STATIC_ROOT": ""
  },
}
```

## Virtual environment
This is required for all te steps below.

Set up a virtual environmane for this project - e.g. typically names venv

### activate the virtual environment you have set up.

Windows/PyCharm not required-
Linux/Mac -`source myvenv/bin/activate`

### Database migrations.
The virtual environment must be started before running migrations.  

Two commands are required:
- `python manage.py makemigrations` set the migrations up and does any pre-validation
- `python manage.py migrate` runs the migrations

### start server
`python manage.py runserver`

### Setting up users
Need to have virtual environment and server up and running
- `python manage.py createsuperuser` 

## code base

### Folder structure
This is what all the folders here are for:
```bash
.                  # tree -L 1 -d
├── epic           # non React pages, database set up, api's (django)
├── mysite         # overall setup including config 
├── venv         # virtual environment 
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

  

