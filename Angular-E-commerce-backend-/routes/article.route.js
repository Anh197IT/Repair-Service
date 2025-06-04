const express = require('express');
const router = express.Router();
const Article=require("../models/article")

// chercher un article par s/cat
router.get('/scat/:scategorieID',async(req, res)=>{
    try {
        const art = await Article.find({ scategorieID: req.params.scategorieID}).exec();
        
        res.status(200).json(art);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});



router.get('/',async (req, res )=> {
    try {
      const articles = await Article.find({}, null, {sort: {'_id': -1}}).populate("scategorieID").exec();

              
      res.status(200).json(articles);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }

});


router.get('/productspage/', async(req, res) => {

    const page = req.query.page || 1; 
    const pagesize = req.query.pagesize ||5; 
    
    
    const offset = (page - 1) * pagesize;
    try {
    
    const articles = await Article.find( {}, null, {sort: {'_id': -1}})
      .skip(offset)
      .limit(pagesize)
     
    
      res.status(200).json(articles);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
  });
 
  
router.get('/nombreTot/', async (req, res, )=> {
    try {
        const articles = await Article.find().exec();
                
        res.status(200).json({tot:articles.length});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
  
  });
  


router.get('/filtres/', async(req, res) => {

  const filtre = req.query.filtre || ""; 
  const page = req.query.page || 1; 
  const limit = req.query.limit ||5; 

  
  const offset = (page - 1) * limit;
  try {
  
  const articles = await Article.find({ designation: { $regex: filtre, $options: "i" }}, null, {sort: {'_id': -1}})
    .skip(offset)
    .limit(limit)
    .populate("scategorieID").exec()
    

  const articlesNb = await Article.find({ designation: { $regex: filtre, $options: "i" }})
   .exec()

    res.status(200).json({articles: articles, longueur : articlesNb.length});
} catch (error) {
    res.status(404).json({ message: error.message });
}
});




router.post('/', async (req, res) =>  { 

 const nouvarticle = new Article(req.body)
    try {
        const response =await nouvarticle.save();
        const articles = await Article.findById(response._id).populate("scategorieID").exec();
        console.log(articles)
        res.status(200).json(articles);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }


});

router.get('/:articleId',async(req, res)=>{
    try {
        const art = await Article.findById(req.params.articleId);
        
        res.status(200).json(art);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});



router.put('/:articleId', async (req, res)=> {
   try {
    const art = await Article.findByIdAndUpdate(
        req.params.articleId,
        { $set: req.body },
      { new: true }
    );
    const articles = await Article.findById(art._id).populate("scategorieID").exec();
    console.log(articles)
    res.status(200).json(articles);
    } catch (error) {
    res.status(404).json({ message: error.message });
    }
});

router.delete('/:articleId', async (req, res)=> {
    const  id  = req.params.articleId;
    try {
    await Article.findByIdAndDelete(id);

    res.status(200).json({ message: "article deleted successfully." });
   } catch (error) {
    res.status(404).json({ message: error.message });
    }   
});




module.exports = router;
