require("dotenv").config();

const supabase = require("./config/supabase");

async function test() {

    const { data, error } =
    await supabase
    .from("orders")
    .select("*");

    if(error){

        console.log(error);

    }else{

        console.log(data);

    }

}

test();