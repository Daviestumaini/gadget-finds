const loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = async () => {

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const adminCode = document.getElementById("adminCode").value;

    try{

        const response = await fetch(

            "http://localhost:5000/api/admin/login",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    email,

                    password,

                    adminCode

                })

            }

        );

        const result = await response.json();

        if(!response.ok){

            document.getElementById("message").innerHTML =
            result.message;

            return;

        }

        localStorage.setItem(

            "admin_access_token",

            result.session.access_token

        );

        localStorage.setItem(

            "admin_id",

            result.user.id

        );

        localStorage.setItem(

            "admin_name",

            result.user.name

        );

        localStorage.setItem(

            "admin_role",

            result.user.role

        );

        window.location.href =
        "admin-dashboard.html";

    }

    catch(err){

        console.log(err);

        document.getElementById("message").innerHTML =
        "Server Error";

    }

};