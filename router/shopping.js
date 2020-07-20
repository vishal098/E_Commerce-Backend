module.exports = function (shopping, knex) {
    shopping.get('/generateUniqueId', (req, res) => {
        var text = "",
            charset = "ab@cd12efgh34ij$kl56mnop78qr&st90uv*wx!yz"; // `#` and `%` do not work in url
        for (var i = 0; i < 18; i++) {
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        console.log(`your cart_id has been sent!`);
        res.send({ cart_id: text });
    })

    shopping.post('/post_shoppingcart', (req, res) => {
        var cart_id = {
            'cart_id': req.body.cart_id,
            'product_id': req.body.product_id,
            'attributes': req.body.attributes,
            'quantity': 1,
            'added_on': new Date()
        }
        knex
        .select('quantity')
        .from('shopping_cart')
        .where('shopping_cart.product_id', cart_id.product_id)
        .andWhere('shopping_cart.cart_id', cart_id.cart_id)
        .andWhere('shopping_cart.attributes', cart_id.attributes)
        .then((data) => {
            if (data.length == 0) {
                knex('shopping_cart')
                .insert({
                    'cart_id': cart_id.cart_id,
                    'product_id': cart_id.product_id,
                    'attributes': cart_id.attributes,
                    'quantity': 1,
                    'added_on': new Date()
                }).then(() => {
                    knex
                    .select(
                        'item_id',
                        'name',
                        'attributes',
                        'shopping_cart.product_id',
                        'price',
                        'quantity',
                        'image'
                    )
                    .from('shopping_cart')
                    .join('product', 'shopping_cart.product_id', '=', 'product.product_id')
                    .then((data)=>{
                        let datas = []
                        for(i of data){
                            let subtotal = i.price * i.quantity
                            i.subtotal = subtotal
                            datas.push(i)
                        }res.send(datas)
                    }).catch((err)=>{console.log(err);})
                }).catch((err)=>{console.log(err);})
            }else{
                let Quantity = data[0].quantity+1;
                knex('shopping_cart')
                .update({quantity: Quantity})
                .where('shopping_cart.product_id', cart_id.product_id)
                .andWhere('shopping_cart.cart_id', cart_id.cart_id)
                .andWhere('shopping_cart.attributes', cart_id.attributes)
                .then(() => {
                    knex
                    .select(
                        'item_id',
                        'name',
                        'attributes',
                        'shopping_cart.product_id',
                        'price',
                        'quantity',
                        'image'
                    )
                    .from('shopping_cart')
                    .join('product', 'shopping_cart.product_id', '=', 'product.product_id')
                    .then((data)=>{
                        let updated_data = []
                        for(i of data){
                            let subtotal = i.price * i.quantity
                            i.subtotal = subtotal
                            updated_data.push(i)
                        }res.send(updated_data)
                    }).catch((err)=>{console.log(err);})
                }).catch((err)=>{console.log(err);})
            }
        }).catch((err)=>{console.log(err);})
    })

    shopping.get('/get_shoppingcart/:id',(req,res)=>{
        let cart_id = req.params.id
        knex.select(
        'item_id',
        'name',
        'attributes',
        'shopping_cart.product_id',
        'price',
        'quantity',
        'image'
        )
        .from('shopping_cart')
        .join('product','shopping_cart.product_id','=','product.product_id')
        .where('shopping_cart.cart_id',cart_id)
        .then((data)=>{
            let updated_data = []
            for(var i of data){
                let subtotal = i.price * i.quantity
                i.subtotal = subtotal
                updated_data.push(i)
            }res.send(updated_data)
        }).catch((err)=>{console.log(err);})
    })

    shopping.post('/update/shoppingcart/:id',(req,res)=>{
        let item_id = req.params.id
        knex('shopping_cart')
        .where('shopping_cart.item_id',item_id)
        .update({'quantity':req.body.quantity,
        'added_on': new Date()
        })
        .then(()=>{
            knex.select(
                'item_id',
                'name',
                'attributes',
                'shopping_cart.product_id',
                'price',
                'quantity',
                'image'
                )
                .from('shopping_cart')
                .join('product','shopping_cart.product_id','=','product.product_id')
                .where('shopping_cart.item_id',item_id)
                .then((data)=>{
                    let updated_data = []
                    for(var i of data){
                        let subtotal = i.price * i.quantity
                        i.subtotal = subtotal
                        updated_data.push(i)
                    }res.send(updated_data)
                }).catch((err)=>{console.log(err);})
        })
        
    })

    shopping.delete('/delete/shoppingcart/:id',(req,res)=>{
        let cart_id = req.params.id
        console.log(cart_id);
        
        knex('*')
        .from('shopping_cart')
        .where('shopping_cart.cart_id',cart_id)
        .del()
        .then((data)=>{            
            res.send("Your data has removed")
            
        }).catch((err)=>{console.log(err);
        })
    })


    shopping.get('/saveForLater/:id',(req,res)=>{
        let item_id = req.params.id
        knex.schema.createTable('save_later',function(table){
            table.increments('item_id').primary();
            table.string('cart_id');
            table.integer('product_id');
            table.string('attributes');
            table.integer('quantity');
            table.integer('buy_now');
            table.datetime('added_on');
        })
        .then(()=>{
            console.log("Your Table has created");
        }).catch((err)=>{console.log("This table is already exist!");})
        knex.select('*')
        .from('shopping_cart')
        .where('shopping_cart.item_id',item_id)
        .then((data)=>{            
            if(data.length>0){
                data[0].added_on = new Date()
                knex('save_later')
                .insert(data[0])
                .then((result)=>{
                    knex.select('*')
                    .from('shopping_cart')
                    .where('shopping_cart.item_id',item_id)
                    .del()
                    .then(()=>{
                        res.send("Your data has been saved for later")
                    }).catch((err)=>{console.log(err);})
                }).catch((err)=>{console.log(err);})
            }else{
                console.log("This item is not available in shopping_cart");
                
            }
        }).catch((err)=>{console.log(err);})
    })

    shopping.get('/moveToCart/:id',(req,res)=>{
        let item_id = req.params.id
        knex.select('*')
        .from('save_later')
        .where('save_later.item_id',item_id)
        .then((data)=>{
            data[0].added_on = new Date();
            knex('shopping_cart')
            .insert(data[0])
            .then(()=>{
                knex.select('*')
                .from('save_later')
                .where('save_later.item_id',item_id)
                .del()
                .then(()=>{
                    res.json({massage:'Your data has been move to shopping_cart'})
                }).catch((err)=>{console.log(err);})
            }).catch((err)=>{console.log(err);})
        }).catch((err)=>{console.log(err);})
    })









    shopping.get('/shoppingcart/getSaved/:id',(req,res)=>{
        let cart_id = req.params.id        
        knex.select(
            'item_id',
            'product.name',
            'attributes',
            'product.price'
        )
        .from('save_later')
        .join('product','save_later.product_id','=','product.product_id')
        .where('save_later.cart_id',cart_id)
        .then((data)=>{            
            res.send(data)
        }).catch((err)=>{console.log(err);})
    })

    shopping.get('/totalAmount/:id',(req,res)=>{
        let cart_id = req.params.id
        knex.select(
            'price',
            'quantity'
        ).from('shopping_cart')
        .join('product','shopping_cart.product_id','=','product.product_id')
        .where('shopping_cart.cart_id',cart_id)
        .then((data)=>{
            let result = []
            for(i of data){   
                let total = i.price * i.quantity
                i.totalamount = total
                result.push(i)
            }            
            res.json({'totalamount':result[0].totalamount})
        }).catch((err)=>{console.log(err);})
    })

    shopping.delete('/removeProduct/:id',(req,res)=>{
        let item_id = req.params.id
        knex('*')
        .from('shopping_cart')
        .where('item_id',item_id)
        .del()
        .then(()=>{
            res.send("This order has been removed by item id")
        }).catch((err)=>{console.log(err);})
    })
}