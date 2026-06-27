const token = localStorage.getItem("admin_access_token");

if(!token){

window.location.href="admin-login.html";

};