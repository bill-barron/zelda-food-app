const express = require('express')
const app = express()
const data = require('./data.js');
const helper = require('./helper.js');

/**
 * Adds a list of hp health image urls to each material based on how much health is restored by eating that ingredient
 * Example: a material that adds 4.5 hearts of health would have ["/img/heart-4.png", "/img/heart-4.png", "/img/heart-4.png", "/img/heart-2.png"]
 * The view could then render 3 full heart images and one half heart image.
 * 
 * However, if the typeof material.hearts is a string, the string should be rendered directly instead.
 */
data.materials.forEach(m => {
    m.hearts = helper.getMaterialHearts(m);
});

/**
 * Adds a list of materials directly to each ingredient object in the data
 */
data.ingredients.forEach(i => {
    var materials = data.ingredientOptions.filter(o => o.ingredientId === i.id).map(o => {
        return data.materials.find(material => {
            return material.id === o.materialId;
        });
    });
    
    i.materials = materials;
});

/**
 * Adds a list of ingredients directly to each recipe object in the data
 */
 data.recipes.forEach(f => {
    var ingredients =  data.recipeIngredients.filter(i => i.recipeId === f.id).map(i => {
        return data.ingredients.find(ingredient => {
            return ingredient.id === i.ingredientId;
        });
    });
    f.ingredients = ingredients;
});


// Configure the app
app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'pug')


/** ======================
 *  ======== API =========
 *  ====================== */

 /**
  * Gets all materials
  */
app.get('/api/materials', (req, res) => {
    res.send(data.materials);
});

/**
 * Searches for materials by name. Matching material must contain search string (case-insensitive)
 */
app.get('/api/materials/find/:query', (req, res) => {
    var results = data.materials.filter(v => {
        return v.name.toLowerCase().indexOf(req.params.query.toLowerCase()) !== -1;
    });
    res.send(results);
});

/**
 * Gets a single material by its id
 */
app.get('/api/materials/:id', (req, res) => {
    var id = parseInt(req.params.id, 10);
    var result = data.materials.find(v => v.id === id);
    if(!result)
        res.sendStatus(404);

    var model = helper.getMaterialModel(result);

    res.send(model);
});

/**
 * Gets all ingredients. An ingredient is a collection of one or more interchangable materials
 * Most ingredients have just a single material
 */
app.get('/api/ingredients', (req, res) => {
    res.send(data.ingredients);
});

/**
 * Searches for ingredients by name. Matching ingredients must contain the full search string (case-insensitive)
 */
app.get('/api/ingredients/find/:query', (req, res) => {
    var results = data.ingredients.filter(v => {
        return v.name.toLowerCase().indexOf(req.params.query.toLowerCase()) !== -1;
    });
    res.send(results);
});

/**
 * Gets a single ingredient by its id
 */
app.get('/api/ingredients/:id', (req, res) => {
    var results = data.ingredients.filter(v => {
        return v.id === parseInt(req.params.id, 10);
    });
    if(results.length == 0)
        res.sendStatus(404);

    res.send(results[0]);
});

/**
 * Gets all ingredients. An ingredient is a collection of one or more interchangable materials
 * Most ingredients have just a single material
 */
app.get('/api/recipes', (req, res) => {
    res.send( data.recipes);
});

/**
 * Searches for recipes by name. Matching recipes must contain the full search string (case-insensitive)
 */
app.get('/api/recipes/find/:query', (req, res) => {
    var results =  data.recipes.filter(v => {
        return v.name.toLowerCase().indexOf(req.params.query.toLowerCase()) !== -1;
    });
    res.send(results);
});

/**
 * Gets a single recipe by its id
 */
app.get('/api/recipes/:id', (req, res) => {
    var results =  data.recipes.filter(v => {
        return v.id === parseInt(req.params.id, 10);
    });
    if(results.length == 0)
        res.sendStatus(404);

    res.send(results[0]);
});



/** ======================
 *  ====== WEB SITE ======
 *  ====================== */

 /**
  * Home page
  */
app.get('/', (req, res) => {
    res.render('home', {recipes:  data.recipes});
});

/**
 *  Recipe listing page
 */
app.get('/recipes', (req, res) => {
    res.render('recipes', { title: 'Recipes', header: 'All Cooking Recipes', recipes:  data.recipes});
});

/**
 * Recipe details page
 */
app.get('/recipes/:id', (req, res) => {
    var id = parseInt(req.params.id, 10);
    var result =  data.recipes.find(v => v.id === id);
    if(!result)
        res.sendStatus(404);

    var model = helper.getRecipeModel(result);
    
    res.render('recipe', { recipe: model});
});

/**
 * Ingredients listing page
 */
app.get('/ingredients', (req, res) => {
    res.render('ingredients', { title: 'Ingredients', header: 'All Cooking Ingredients', ingredients: data.ingredients.filter(i => i.id > 149)});
});

/**
 * Ingredient details page
 */
app.get('/ingredients/:id', (req, res) => {
    var id = parseInt(req.params.id, 10);
    var result = data.ingredients.find(v => v.id === id);
    if(!result)
        res.sendStatus(404);

    var model = helper.getIngredientModel(result);

    res.render('ingredient', { ingredient: model});
});

/**
 * Materials listing page
 */
app.get('/materials', (req, res) => {
    res.render('materials', { title: 'Materials', header: 'All Cooking Materials', materials: data.materials});
});

/**
 * Material detail page
 */
app.get('/materials/:id', (req, res) => {
    var id = parseInt(req.params.id, 10);
    var result = data.materials.find(v => v.id === id);
    if(!result)
        res.sendStatus(404);

    var model = helper.getMaterialModel(result);

    res.render('material', { material: model});
});

/**
 * Start the server on port 3000
 */
app.listen(3000, () => console.log('Example app listening on port 3000!'))