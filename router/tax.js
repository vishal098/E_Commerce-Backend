module.exports = function(tax,knex){
    tax.get('/tax',(req,res)=>{
        knex.select('*')
        .from('tax')
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{console.log(err);})
    })

    tax.get('/tax/:id',(req,res)=>{
        knex.select('*')
        .from('tax')
        .where('tax_id',req.params.id)
        .then((data)=>{
            res.send(data)
        }).catch((err)=>{console.log(err);})
    })
}