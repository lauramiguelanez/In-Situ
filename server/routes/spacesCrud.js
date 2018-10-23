const express = require('express');
const _ = require('lodash');
const Space = require('../models/Space');

const spacesCRUD = (Space, extensionFn) => {
    let router  = express.Router();

    // Detect paths from model
    let notUsedPaths = ['_id','updated_at','created_at','__v'];
    let paths = Object.keys(Space.schema.paths).filter(e => !notUsedPaths.includes(e));
    if(extensionFn){
        router = extensionFn(router);
    }

    // CRUD: RETRIEVE
    router.get('/',(req,res,next) => {
        Space.find()
            .then( objList => res.status(200).json(objList))
            .catch(e => next(e))
    })
    
    router.get('/:id',(req,res,next) => {
        const {id} = req.params;
        Space.findById(id)
            .then( obj => res.status(200).json(obj))
            .catch(e => next(e))
    })

    // ADD LIKE
    router.post('/like',(req,res,next) => {
        let {space} = req.body;
        console.log(space);
        console.log(space.id);
        console.log(space.likes);
        Space.findByIdAndUpdate(space.id, { likes: space.likes }/*  ,{new:false} */)
            .then( obj => {
                res.status(200).json({status:'updated',obj});
            })
            .catch(e => next(e))
    })
    
    // CRUD: CREATE
    router.post('/',(req,res,next) => {
        const object = _.pickBy(req.body, (e,k) => paths.includes(k));
        //const object = req.body;
        Space.create(object)
            .then( obj => res.status(200).json(obj))
            .catch(e => next(e))
    })
    
    // CRUD: UPDATE
    
    router.patch('/:id',(req,res,next) => {
        const {id} = req.params;
        const object = _.pickBy(req.body, (e,k) => paths.includes(k));
        const updates = _.pickBy(object, _.identity);
        let newMedia = req.body;
        console.log(newMedia);
        Space.findByIdAndUpdate(id, { $push: { media: newMedia } } ,{new:true})
            .then( obj => {
                res.status(200).json({status:'updated',obj});
            })
            .catch(e => next(e))
    })

   

    
    // CRUD: DELETE
    router.delete('/:id',(req,res,next) => {
        const {id} = req.params;
        Space.findByIdAndRemove(id)
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


module.exports = spacesCRUD;


