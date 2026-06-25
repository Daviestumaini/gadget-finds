require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
"/api/auth",
require("./routes/auth")
);

app.use(
"/api/login",
require("./routes/login")
);

app.use(
  "/api/orders",
  require("./routes/orders")
);

app.get("/", (req, res) => {

    res.json({
        message: "Gadget Finds Backend Running"
    });

});

const PORT = process.env.PORT || 5000;
app.get("/test-order", async(req,res)=>{

const supabase =
require("./config/supabase");

const { data,error } =
await supabase
.from("Orders")
.insert([{

user_id:
"938af471-f869-420a-8492-742bcfa13658",

order_id:
"GF123",

tracking_id:
"TRK123",

amount:5000,

mpesa_code:
"QWE123XYZ",

payment_status:
"Paid",

shipment_status:
"Processing"

}])
.select();

res.json({
data,
error
});

});
app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});