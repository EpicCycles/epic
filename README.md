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
Linix -`source myvenv/bin/activate`

## code base

### Folder structure
This is what all the folders here are for:
```bash
.             # tree -L 1 -d
├── client    # the react application
├── epic      # non React pages, database set up, api's (django)
├── mysite    # overall setup including config 
├── myvenv    # virtual environment 
├── test      # test folder for python code
```
### Client 
This is the React version of the site. contains re-usable components and api calls to get back data for them.

Core React code is held in the `src` folder, with a structure based on the django framework so that it sits withthe use of admin etc as standard Django bits.

In theory this ia a single page app.  `index.html` is the driver for all code with the details of how to get to different elements determined by the use or ReactRouter.
## testing 

All changes should be tested,  Add test files to the test folder in the appropriate place.

### python tests
#### setting up tests
|
|- test

New test folders will need an empty file `__init__.py` included so that teh tests are picked up as part of the test suite.

####Running tests
- single tests
  - right click on test in project view panel and run test
- all tests
  - ensure myvenv is launched
  - in terminal use `python3 manage.py test`
  
  

