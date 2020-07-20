module.exports = function (attribute, knex) {

    attribute.get('/attribute', (req, res) => {
        knex.select('*').from('attribute')
            .then((result) => {
                res.json(result)
            })
            .catch((err) => {
                console.log(err)
            })
    });

    attribute.get('/attribute/:id', (req, res) => {
        let = req.params.id
        knex.select('*').from('attribute')
            .where("attribute_id", id)
            .then((result) => {
                res.json(result)
            })
            .catch((err) => {
                console.log(err)
            })
    });

    attribute.get('/values/:id', (req, res) => {
        let id = req.params.id
        knex.select("attribute_value_id", "value")
            .from('attribute_value')
            .join("attribute", "attribute.attribute_id", '=', "attribute_value.attribute_id")
            .where("attribute_value.attribute_id", id)
            .then((result) => {
                res.json(result)
            })
            .catch((err) => {
                console.log(err)
            })
    });


    attribute.get('/inProduct/:id', (req, res) => {
        let id = req.params.id
        knex.select('attribute.name as attribute_name', 
            'attribute_value.attribute_value_id', 
            'attribute_value.value as attribute_value')
            .from('attribute_value')
            .join("attribute", "attribute.attribute_id", '=', "attribute_value.attribute_id")
            .join("product_attribute", "product_attribute.attribute_value_id", '=', "attribute_value.attribute_value_id")
            .where("product_attribute.product_id", id)
            .then((result) => {
                res.json(result)
            })
            .catch((err) => {
                console.log(err)
            })
    });

}