const express = require("express");
const router = express.Router();

const supabase =
require("../config/supabase");

router.post(
"/register",
async (req,res)=>{
console.log(req.body);
try{

console.log("BODY:", req.body);

const email = "test999@test.com";
const password = "12345678";

const {
data,
error
} =
await supabase.auth.admin.createUser({

  email,
  password,
  email_confirm: true

});

if(error){

return res
.status(400)
.json(error);

}

res.json({
message:
"User registered",
data
});

}catch(err){

res
.status(500)
.json(err);

}

});

module.exports = router;