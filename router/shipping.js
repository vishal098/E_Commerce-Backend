module.exports = function(shipping,knex){
    shipping.get('/shipping_regions',(req,res)=>{
        knex('shipping_region')
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{console.log(err);})
    })

    shipping.get('/shipping_regions/:id',(req,res)=>{
        knex.select(
            'shipping_id',
            'shipping_type',
            'shipping_cost',
            'shipping.shipping_region_id'
        )
        .from('shipping')
        .where('shipping.shipping_region_id',req.params.id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{console.log(err);})
    })
}