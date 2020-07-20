module.exports = function(department,knex){

    department.get('/department',(req,res)=>{
        knex.select('*').from('department')
        .then((result)=>{
            res.json(result)
        })
        .catch((err)=>{
            console.log(err)
        })
    });

    department.get('/department/:id',(req,res)=>{
        let id = req.params.id
        knex.select('*').from('department',id)
        .where('department_id',)
        .then((result)=>{
            res.json(result)
        })
        .catch((err)=>{
            console.log(err)
        })
    });



}