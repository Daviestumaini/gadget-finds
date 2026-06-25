const express = require("express");
const router = express.Router();

const supabase = require("../config/supabase");

router.post("/create", async (req, res) => {

    try {

        const {
            user_id,
            amount,
            mpesa_code
        } = req.body;

        const tracking_id =
            "TRK" +
            Date.now();

        const order_id =
            "GF" +
            Date.now();

        const { data, error } =
        await supabase
        .from("Orders")
        .insert([{

            user_id,
            order_id,
            tracking_id,
            amount,
            mpesa_code,
            payment_status: "Paid",
            shipment_status: "Processing"

        }])
        .select();

        if(error){

            return res
            .status(400)
            .json(error);

        }

        res.json({
            success:true,
            order:data[0]
        });

    } catch(err){

        res
        .status(500)
        .json(err);

    }

});

router.get(
"/track/:trackingId",
async(req,res)=>{

try{

const trackingId =
req.params.trackingId;

const {
data,
error
} =
await supabase
.from("Orders")
.select("*")
.eq(
"tracking_id",
trackingId
)
.single();

if(error){

return res
.status(404)
.json({
message:
"Order not found"
});

}

res.json(data);

}catch(err){

res
.status(500)
.json(err);

}

});

module.exports = router;