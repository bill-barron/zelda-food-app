## Synopsis

This is a smple dockerized webapp that displays recipes, and ingredients for food in The Legend of Zelda: Breath of the wild. You can see all recipes or find all the recipes by a given ingredient.

## Installation

First clone this repo to your local machine and test it using 

    npm start

Then you should be able to see the app at http://localhost:3000

If you want to take it one step further and run this in docker, run the following commands

    $ docker build -t bill-barron/zelda-recipe-app .

    $ docker run -p 49160:3000 -d bill-barron/zelda-recipe-app

You should now be able to see the app by browsing to

    http://localhost:49160

## License

MIT License