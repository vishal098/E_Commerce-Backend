module.exports = function(category,knex){

    category.get('/category',(req,res)=>{
        knex.select('*').from('category')
        .then((result)=>{
            let wholedata = {
                count:result.length,
                row: result
            }
            res.json(wholedata)
        })
        .catch((err)=>{
            console.log(err)
        })
    });

    category.get('/category/:id',(req,res)=>{
        let id = req.params.id
        knex.select('*').from('category')
        .where('category_id',id)
        .then((result)=>{
            res.json(result)
        })
        .catch((err)=>{
            console.log(err)
        })
    });


    category.get('/inProduct/:id',(req,res)=>{
        let id = req.params.id
        knex.select("category.category_id", "department_id","name")
        .from('category')
        .join('product_category','category.category_id','=','product_category.category_id')
        .where('product_category.product_id',id)
        .then((result)=>{
            res.json(result)
        })
        .catch((err)=>{
            console.log(err)
        })
    });


    category.get('/inDepartment/:id',(req,res)=>{
        let id = req.params.id
        knex.select('*')
        .from('category')
        .where('department_id',id)
        .then((result)=>{
            res.json(result)
        })
        .catch((err)=>{
            console.log(err)
        })
    });

}