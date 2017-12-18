const express = require('express')
const app = express()
const data = require('./data.js');
const helper = require('./helper.js');

data.materials.forEach(m => {
    m.hearts = helper.getMaterialHearts(m);
});

data.ingredients.forEach(i => {
    var materials = data.ingredientOptions.filter(o => o.ingredientId === i.id).map(o => {
        return data.materials.find(material => {
            return material.id === o.materialId;
        });
    });
    
    i.materials = materials;
});

 data.recipes.forEach(f => {
    var ingredients =  data.recipeIngredients.filter(i => i.recipeId === f.id).map(i => {
        return data.ingredients.find(ingredient => {
            return ingredient.id === i.ingredientId;
        });
    });
    f.ingredients = ingredients;
});

app.use(express.static('public'))
app.set('views', './views')
app.set('view engine', 'pug')



/** ======================
 *  ======== API =========
 *  ====================== */
app.get('/api/materials', (req, res) => {
    res.send(data.materials);
});

app.get('/api/materials/find/:query', (req, res) => {
    var results = data.materials.filter(v => {
        return v.name.toLowerCase().indexOf(req.params.query.toLowerCase()) !== -1;
    });
    res.send(results);
});

app.get('/api/materials/:id', (req, res) => {
    var id = parseInt(req.params.id, 10);
    var result = data.materials.find(v => v.id === id);
    if(!result)
        res.sendStatus(404);

    var model = helper.getMaterialModel(result);

    res.send(model);
});

app.get('/api/ingredients', (req, res) => {
    res.send(data.ingredients);
});

app.get('/api/ingredients/find/:query', (req, res) => {
    var results = data.ingredients.filter(v => {
        return v.name.toLowerCase().indexOf(req.params.query.toLowerCase()) !== -1;
    });
    res.send(results);
});

app.get('/api/ingredients/:id', (req, res) => {
    var results = data.ingredients.filter(v => {
        return v.id === parseInt(req.params.id, 10);
    });
    if(results.length == 0)
        res.sendStatus(404);

    res.send(results[0]);
});

app.get('/api/foods', (req, res) => {
    res.send( data.recipes);
});

app.get('/api/foods/find/:query', (req, res) => {
    var results =  data.recipes.filter(v => {
        return v.name.toLowerCase().indexOf(req.params.query.toLowerCase()) !== -1;
    });
    res.send(results);
});

app.get('/api/foods/:id', (req, res) => {
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

app.get('/', (req, res) => {
    res.render('home', {recipes:  data.recipes});
});

app.get('/recipes', (req, res) => {
    res.render('recipes', { title: 'Recipes', header: 'All Cooking Recipes', recipes:  data.recipes});
});

app.get('/recipes/:id', (req, res) => {
    var id = parseInt(req.params.id, 10);
    var result =  data.recipes.find(v => v.id === id);
    if(!result)
        res.sendStatus(404);

    var model = helper.getRecipeModel(result);
    
    res.render('recipe', { recipe: model});
});

app.get('/ingredients', (req, res) => {
    res.render('ingredients', { title: 'Ingredients', header: 'All Cooking Ingredients', ingredients: data.ingredients.filter(i => i.id > 149)});
});

app.get('/ingredients/:id', (req, res) => {
    var id = parseInt(req.params.id, 10);
    var result = data.ingredients.find(v => v.id === id);
    if(!result)
        res.sendStatus(404);

    var model = helper.getIngredientModel(result);

    res.render('ingredient', { ingredient: model});
});

app.get('/materials', (req, res) => {
    res.render('materials', { title: 'Materials', header: 'All Cooking Materials', materials: data.materials});
});

app.get('/materials/:id', (req, res) => {
    var id = parseInt(req.params.id, 10);
    var result = data.materials.find(v => v.id === id);
    if(!result)
        res.sendStatus(404);

    var model = helper.getMaterialModel(result);

    res.render('material', { material: model});
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))