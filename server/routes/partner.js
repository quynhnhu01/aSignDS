const express = require("express");
const routePartner = express.Router();
const contractModel = require("../models/upload.model")
routePartner.get("/add_partner/:id", async function (req, res) {
    //show partner's information
    const idContract = req.params.id;
    const partner = req.params.user;
    // const contract = await contractModel.findById(idContract);
    // if(contract){
    //     contractModel.update({id:idContract},)
    // }
    const updatedContract = await contractModel.findByIdAndUpdate(idContract, {
        partner: partner
    });
    res.send(updatedContract);

});
