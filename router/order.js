const jwt = require('jsonwebtoken')
module.exports = function (order, knex) {
    order.post('/post_orders', (req, res) => {
        var token = req.headers.cookie.slice(4)        
        jwt.verify(token, process.env.secretkey, (err, Token) => {            
            knex.select('*')
                .from('customer')
                .where('customer.email', Token.email)
                .then((user) => {
                    if (user.length > 0) {
                        knex.select('*')
                            .from('shopping_cart')
                            .join('product','shopping_cart.product_id','=','product.product_id')
                            .where('cart_id', req.body.cart_id)
                            .then((result) => {                                
                                knex('orders').insert({
                                    "total_amount":result[0].price * result[0].quantity,
                                    "created_on": new Date(),
                                    "customer_id": Token.customer_id,
                                    "shipping_id":req.body.shipping_id,
                                    "tax_id":req.body.tax_id
                                }).then((data)=>{                                                                       
                                    knex('order_detail').insert({
                                        "order_id": data[0],
                                        "product_id":result[0].product_id,
                                        "attributes":result[0].attributes,
                                        "product_name":result[0].name,
                                        "quantity":result[0].quantity,
                                        "unit_cost":result[0].price
                                    }).then((details)=>{
                                        knex.select('*').from('shopping_cart').where('cart_id',req.body.cart_id).del()
                                        .then(()=>{
                                            res.send({"order_id":data[0]})
                                        }).catch((err)=>{console.log(err);})
                                    }).catch((err)=>{console.log(err);})
                                }).catch((err)=>{console.log(err);})
                            }).catch((err)=>{console.log("Cart_id not found");})
                    } else {
                        res.send("This user doesn't exist")
                    }
                }).catch((err)=>{console.log(err);})
        })

    })
    order.get('/orders/:id',(req,res)=>{
        var token = req.headers.cookie.slice(4)                        
        jwt.verify(token,process.env.secretkey, (err, Token) => { 
            // console.log(Token);
            if(Token){
                knex.select(
                    'orders.order_id',
                    'product.product_id',
                    'order_detail.attributes',
                    'product.name as product_name',
                    'order_detail.quantity',
                    'product.price',
                    'order_detail.unit_cost'
                )
                .from('orders')
                .join('order_detail','orders.order_id','=','order_detail.order_id')
                .join('product','order_detail.product_id','=','product.product_id')
                .where('orders.order_id',req.params.id)
                .then((data)=>{
                    res.send(data)
                }).catch((err)=>{console.log(err);})
            } else{
                res.send("This account has not found")
            }
        })
    })

    order.get('/incustomer/:id',(req,res)=>{
        var token = req.headers.cookie.slice(4)                        
        jwt.verify(token,process.env.secretkey, (err, Token) => { 
            if(!err){
                knex.select('*')
                .from('orders')
                .where('customer_id',req.params.id)
                .then((data)=>{
                    res.send(data)
                }).catch((err)=>{console.log(err);})
            }else{
                res.send("This account has not found")
            }
        })
    })

    order.get('/orders_shortDetail/:id',(req,res)=>{
        var token = req.headers.cookie.slice(4)                        
        jwt.verify(token,process.env.secretkey, (err, Token) => { 
            if(!err){
                knex.select(
                    'orders.order_id',
                    'orders.total_amount',
                    'orders.created_on',
                    'orders.shipped_on',
                    'orders.status',
                    'order_detail.product_name as name'
                ).from('orders')
                .join('order_detail','orders.order_id','=','order_detail.order_id')
                .where('orders.order_id',req.params.id)
                .then((data)=>{
                    res.send(data)
                }).catch((err)=>{console.log(err);})
            }else{
                res.send("This account has not found")
            }
        })
    })
}


