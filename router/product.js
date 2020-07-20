const jwt = require('jsonwebtoken')
module.exports = function (product, knex) {

    product.get('/product', (req, res) => {
        knex.select(
            'product_id',
            'name',
            'description',
            'price',
            'discounted_price',
            'thumbnail')
            .from("product")
            .then((result) => {
                var wholeData = {
                    count: result.length,
                    rows: result
                }
                res.json(wholeData)
            })
            .catch((err) => {
                console.log(err)
            })
    });

    product.get('/search', (req, res) => {
        let body = req.query.pro
        console.log(body);

        knex.select(
            'product_id',
            'name',
            'description',
            'price',
            'discounted_price',
            'thumbnail')
            .from("product")
            .where("name", body)
            .then((result) => {
                // console.log(result);

                var wholeData = {
                    count: result.length,
                    rows: result
                }
                res.json(wholeData)
            })
            .catch((err) => {
                console.log(err)
            })
    });


    product.get('/product_id/:id', (req, res) => {
        let id = req.params.id
        knex.select('*')
            .from("product")
            .where('product_id', id)
            .then((result) => {
                res.json(result)
            })
            .catch((err) => {
                console.log(err)
            })
    });

    product.get('/inCategory/:id', (req, res) => {
        let id = req.params.id
        knex.select(
            'product.product_id',
            'name',
            'description',
            'price',
            'discounted_price',
            'thumbnail')
            .from("product")
            .join("product_category", "product_category.product_id", '=', "product.product_id")
            .where("product_category.category_id", id)
            .then((result) => {
                // console.log(result);

                var wholeData = {
                    count: result.length,
                    rows: result
                }
                res.json(wholeData)
            })
            .catch((err) => {
                console.log(err)
            })
    });

    product.get('/inDepartment/:id', (req, res) => {
        let id = req.params.id
        knex.select(
            'product.product_id',
            'product.name',
            'product.description',
            'product.price',
            'product.discounted_price',
            'product.thumbnail')
            .from("product")
            .join("product_category", "product_category.product_id", '=', "product.product_id")
            .join("category", "category.category_id", '=', "product_category.category_id")
            .where("category.department_id", id)
            .then((result) => {
                // console.log(result);

                var wholeData = {
                    count: result.length,
                    rows: result
                }
                res.json(wholeData)
            })
            .catch((err) => {
                console.log(err)
            })
    })

    product.get('/details/:id', (req, res) => {
        let id = req.params.id
        knex.select(
            'product_id',
            'name',
            'description',
            'price',
            'discounted_price',
            'image',
            'image_2'
        )
            .from("product")
            .where('product_id', id)
            .then((result) => {
                res.json(result)
            })
            .catch((err) => {
                console.log(err)
            })
    });

    product.get('/locations/:id', (req, res) => {
        let id = req.params.id
        knex.select(
            'category.category_id',
            'category.name as category_name',
            'department.department_id',
            'department.name as department_name'
        )
            .from("product")
            .join("product_category", "product_category.product_id", '=', "product.product_id")
            .join("category", "category.category_id", '=', "product_category.category_id")
            .join("department", "department.department_id", '=', "category.department_id")
            .where("product.product_id", id)
            .then((result) => {
                res.json(result)
            })
            .catch((err) => {
                console.log(err)
            })
    })

    product.get('/reviews/:id', (req, res) => {
        let id = req.params.id
        knex.select(
            'review.name',
            'review',
            'rating',
            'created_on'
        )
            .from("review")
            .join("product", 'product.product_id', '=', 'review.product_id')
            .where('review.product_id', id)
            .then((result) => {
                if (result.length != 0) {
                    res.json(result)
                }else{
                    return res.send("Sorry, there is no reviews for this product")
                }
            })
            .catch((err) => {
                console.log(err)
            })
    });

    product.post('/reviews/:id', (req, res) => {
        var token= req.headers.cookie.slice(4)
        jwt.verify(token,process.env.secretkey, (err, Token) => { 
            if (!err) {
                knex.select('name', 'customer_id')
                    .from('customer')
                    .where('email', Token.email)
                    .then((data)=>{

                    knex.insert({
                        name:data[0].name,
                        review: req.body.review,
                        rating: req.body.rating,
                        created_on: new Date(),
                        product_id: req.params.id,
                        customer_id: data[0].customer_id

                        }).into('review')
                        .then((Datasaved) => {
                            res.send("data has been recieved")
                        })
                        .catch((err) => {
                            console.log(err)
                            res.send(err)
                        })
                    })
            }
        })        

    });

}