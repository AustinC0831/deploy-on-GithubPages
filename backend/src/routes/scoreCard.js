import { Router } from "express";
import ScoreCard from "../models/ScoreCard";
import express from "express";

const router = Router();
router.use(express.json()); //使用body-parser
var update = false;

const deleteDB = async () => {
    try {
    await ScoreCard.deleteMany({});
    console.log("Database deleted");
    } catch (e) { throw new Error("Database deletion failed"); }
};

router.delete("/cards", (_, res) => {
    deleteDB();
    res.json({ message: "Database cleared" });
});

const saveSB = async (name, subject, score) => {
    const existing = await ScoreCard.findOne({ name, subject });
    console.log(existing);
    let exist = false
    
    if (existing){
        await ScoreCard.deleteMany({name,subject});
        exist = true
    }
    const newSC = new ScoreCard({name, subject, score });
    console.log("Created SC", newSC);
    await newSC.save();

    return exist;
};

router.post("/card", async (req, res) => { 
    let name = req.body.name;
    let subject = req.body.subject;
    let score = req.body.score;

    update = await saveSB(name,subject,score);
    let result = await ScoreCard.find({name});

    if(update!==false){
        console.log(update);
        res.json({ message: `Updating (Name:${name}, Subject:${subject}, Score:${score})`, card:true ,afterMessage:result})
        update=false;
    }else{
        res.json({ message:`Adding (Name:${name}, Subject:${subject}, Score:${score})`,card:true,afterMessage:result })
    }

});

router.get("/cards", async (req, res) => {
    let qtype = req.query.type;
    let s = req.query.queryString;

    let result = qtype == "name" ? await ScoreCard.find({name:s}) : await ScoreCard.find({subject:s})
    //console.log(result);

    if(result.length!==0){
        res.json({ messages:result, message:"query successfully"});
    }
    else{
        res.json({message:`${qtype} (${s}) not found!`})
    }
    

});

export default router;
