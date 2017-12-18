## Synopsis

This is a smple dockerized webapp that displays recipes, and ingredients for food in The Legend of Zelda: Breath of the wild. You can see all recipes or find all the recipes by a given ingredient.

## Installation

First test it out on your local host using 

    node index

Then browse to localhost:3000

Next, run the following commands

    $ docker build -t bbarron/zelda-recipe-app

    $ docker run -p 49160:3000 -d bbarron/zelda-recipe-app

You should now be able to browse with

    http://localhost:49160

## License

MIT License