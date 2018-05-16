#Local Development
##Before you start

- install packages required to run the application:
  - django
  - debug toolbar
  - apostle
- set up config file at top level directory (`config.json`)

## Virtual environment
Windows - 
Linix -`source myvenv/bin/activate`

## testing 

All changes should be tested,  Add test files to the test folder in the appropriate place.

New test folders will need an empty file `__init__.py` included so that teh tests are picked up as part of the test suite.

Running tests
- single tests
  - right click on test in project view panel and run test
- all tests
  - ensure myvenv is launched
  - in terminal use `python3 manage.py test`
  
  

