// const checktoken = require('../middileware')
const jwt = require('jsonwebtoken')

module.exports = function (customer, knex) {    
    customer.post('/sign_up', (req, res) => {
        let name = req.body.name
        let email = req.body.email
        let password = req.body.password
        if (name.length == 0 && email.length == 0 && password.length == 0) {
            res.send('All data has required')
        } else {
            knex.select('email', 'password')
                .from('customer')
                .where('customer.email', email)
                .then((data) => {
                    if (data.length == 0) {
                        knex('customer').insert(req.body)
                            .then((result) => {
                                res.send('Your account has been created')
                            })
                            .catch((err) => {
                                console.log(err);
                                res.send(err)
                            })
                    } else {
                        res.send("This user is already joined")
                    }
                })
        }
    })

    customer.post('/login', (req, res) => {
        knex.select('*')
        .from('customer')
        .where('email',req.body.email)
        .then((data)=>{
            if(data.length>0){
                if(data[0].password==req.body.password){
                    let token = jwt.sign({"customer_id":data[0].customer_id,"name":data[0].name,"email":data[0].email},process.env.secretkey,{expiresIn:'1h'})
                    res.cookie("key",token)
                    res.json({"login succesful":data,token})
                }

            }else{
                res.send("password invalid")
            }
        }).catch((err)=>{console.log(err);
        })
    })


    customer.put('/uodate_customer', (req, res) => {
        var token = req.headers.cookie.slice(4)
        jwt.verify(token,process.env.secretkey, (err,Token) => {
            if (!err) {
                let name = req.body.name
                let email = req.body.email
                let password = req.body.password
                let day_phone = req.body.day_phone
                let eve_phone = req.body.eve_phone
                let mob_phone = req.body.mob_phone
                
                console.log(name,email,password,day_phone,eve_phone,mob_phone);
                
                knex('customer')
                    .update(req.body)
                    .where('customer.email', Token.email)
                    .then(() => {
                        console.log('customer updated!');
                        return res.json({ customerUpdate: 'customer updated!' });
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.send(err);
                    })
            } else {
                console.log({ error_name: err.message, tokenExpiredAt: err.expiredAt });
                return res.sendStatus(403)
            }
        })
    })

    customer.put('/update_customers_address', (req, res) => {
        var token = req.headers.cookie.slice(4)
        jwt.verify(token,process.env.secretkey, (err,Token) => {
            if (!err) {
                let address_1 = req.body.address_1
                let address_2 = req.body.address_2
                let city = req.body.city
                let region = req.body.region
                let postal_code = req.body.postal_code
                let country = req.body.country
                
                console.log(address_1,address_2,city,region,postal_code,country);
                
                knex('customer')
                    .update(req.body)
                    .where('customer.email', Token.email)
                    .then(() => {
                        console.log('customer address updated!');
                        return res.json({ customerUpdate: 'customer address updated!' });
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.send(err);
                    })
            } else {
                console.log({ error_name: err.message, tokenExpiredAt: err.expiredAt });
                return res.sendStatus(403)
            }
        })
    })


    customer.put('/update_customers_credit', (req, res) => {
        var token = req.headers.cookie.slice(4)
        jwt.verify(token,process.env.secretkey, (err,Token) => {
            if (!err) {
                let credit_card = req.body.credit_card
                
                console.log(credit_card);
                
                knex('customer')
                    .update(req.body)
                    .where('customer.email', Token.email)
                    .then(() => {
                        console.log('customer credit updated!');
                        return res.json({ customerUpdate: 'customer credit updated!' });
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.send(err);
                    })
            } else {
                console.log({ error_name: err.message, tokenExpiredAt: err.expiredAt });
                return res.sendStatus(403)
            }
        })
    })


    customer.get('/get_customer',(req,res)=>{
        var token = req.headers.cookie.slice(4)
        jwt.verify(token,process.env.secretkey, (err,Token) => {
            knex.select('*')
            .from('customer')
            .where('email',Token.email)
            .then((data)=>{
                res.send(data)
            }).catch((err)=>{
                console.log(err);
                res.send(err)
            })
        })
    })

}


