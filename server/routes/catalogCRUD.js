const express = require('express');
const _ = require('lodash');
const Space = require('../models/Space');
const User = require('../models/User');
const Catalog = require('../models/Catalog');

const catalogCRUD = (Catalog, extensionFn) => {
    let router  = express.Router();

    // Detect paths from model
    let notUsedPaths = ['_id','updated_at','created_at','__v'];
    let paths = Object.keys(Catalog.schema.paths).filter(e => !notUsedPaths.includes(e));
    if(extensionFn){
        router = extensionFn(router);
    }

    // CRUD: RETRIEVE
    router.get('/',(req,res,next) => {
        Catalog.find()
            .then( objList => res.status(200).json(objList))
            .catch(e => next(e))
    })

    router.get('/:id',(req,res,next) => {
        const {id} = req.params;
        Catalog.findById(id)
            .then( obj => res.status(200).json(obj))
            .catch(e => next(e))
    })
    
    // CRUD: CREATE
    router.post('/',(req,res,next) => {
        const object = _.pickBy(req.body, (e,k) => paths.includes(k));
        //const object = req.body;
        Catalog.create(object)
            .then( obj => res.status(200).json(obj))
            .catch(e => next(e))
    })
    
    // CRUD: UPDATE
    router.patch('/:id',(req,res,next) => {
        const {id} = req.params;
        const object = _.pickBy(req.body, (e,k) => paths.includes(k));
        const updates = _.pickBy(object, _.identity);
        let newSpace = req.body;
        console.log(newSpace.spaceId);
        Catalog.findByIdAndUpdate(id, { $push: { spaces: newSpace.spaceId } } ,{new:true})
            .then( obj => {
                res.status(200).json({status:'updated',obj});
            })
            .catch(e => next(e))
    })
    
    // CRUD: DELETE
    router.delete('/:id',(req,res,next) => {
        const {id} = req.params;
        Catalog.findByIdAndRemove(id)
            .then( obj => {
                if(obj){
                    res.status(200).json({status:`Removed from db`});
                }else{
                    throw new Error("Not existing ID");
                }
            })
            .catch(e => next(e))
    })
    
    router.use((err,req,res,next) => {
        res.status(500).json({error:true, message:err.message});
    })

    return router;
}


module.exports = catalogCRUD;


