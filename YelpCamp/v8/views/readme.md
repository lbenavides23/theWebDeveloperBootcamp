

RESTFUL Routes - A table of all 7 Restful routes
-----------------------------------------------------------------------
RESTful Routes - a mapping/pattern between HTTP routes to have CRUD functionality
    - CRUD: Create, Read, Update, Delete



Name        Url             HTTP Verb   Purpose / Description
=======================================================================
INDEX       /dogs           GET         Display a list of all dogs
NEW         /dogs/new       GET         Displays form to make a new dogs
CREATE      /dogs           POST        Add new dog to DB
SHOW        /dogs/:id       GET         Shows info about one dog
Edit        /dogs/:id/edit  GET         Show edit form for on dog
Update      /dogs/:id       PUT         Update a particular dog, then redirect somewhere
Destroy     /dogs/:id       DELETE      Delete a particular dog, then redirect somewhere

