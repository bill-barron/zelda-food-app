
const data = require('./data.js');

module.exports.ingredientCanUseMaterial = function (ingredient, material) {
    return ingredient.materials.some(o => o.id === material.id);
};

module.exports.ingredientsThatUseMaterial = function (ingredients, material) {
    return ingredients.filter(i => module.exports.ingredientCanUseMaterial(i, material));
};

module.exports.foodCanUseMaterial = function (food, material) {
    return food.ingredients.some(i => {
        return i.materials.some(o => o.id === material.id);
    });
};

module.exports.foodsThatUseMaterial = function (foods, material) {
    return foods.filter(f => module.exports.foodCanUseMaterial(f, material)).sort((a, b) => {
        return a.ingredients.length - b.ingredients.length;
    });
};

module.exports.getMaterialHearts = function(material) {
    if(typeof material.hp === "string")
        return material.hp;
    if(material.hp == 0) {
        return [];
    }
    
    var remainder = material.hp % 4;

    var fullHearts = Math.floor(material.hp/4);
    var result = [];
    for(var i = 0; i < fullHearts; i += 1) {
        result.push("/img/heart-4.png");
    }
    if(remainder !== 0) {
        result.push("/img/heart-" + remainder + ".png");
    }
    return result;
}


/* An array filter function that returns unique array values */
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}




module.exports.getRecipeModel = function(recipe) {
    return {
        id: recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients
    };
};




module.exports.getIngredientModel = function(ingredient) {
    // the ingredient should already have the materials
    var recipeIds = data.recipeIngredients
    .filter(fi => fi.ingredientId === ingredient.id)
    .map(fi => fi.recipeId);

    var uniqueRecipeIds = [...new Set(recipeIds)];
    var foods = uniqueRecipeIds.map(recipeId => data.recipes.find(f => f.id === recipeId));

    return {
        id: ingredient.id,
        name: ingredient.name,
        materials: ingredient.materials,
        foods: foods
    };
};




module.exports.getMaterialModel = function(material) {
    // Foods that can use this material
    var recipes = module.exports.foodsThatUseMaterial(data.recipes, material).map(f => {
        return {id: f.id, name: f.name, ingredients: f.ingredients.map(i => {
            return {id: i.id, name: i.name}
        })};
    });

    // Ingredients that this material can fulfill
    var ingredients = module.exports.ingredientsThatUseMaterial(data.ingredients, material).map(i => {
        return {id: i.id, name: i.name};
    });

    // Build the model
    return {
        id: material.id,
        name: material.name,
        value: material.value,
        hp: material.hp,
        recipes: recipes,
        ingredients: ingredients,
        hearts: material.hearts
    };
};