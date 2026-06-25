let notifications =
JSON.parse(
localStorage.getItem(
"notifications"
)
)||[];

const notificationsList =
document.getElementById(
"notificationsList"
);

function renderNotifications(){

notificationsList.innerHTML="";

if(notifications.length===0){

notificationsList.innerHTML=`

<div class="empty">

<h2>No notifications 🔔</h2>

</div>

`;

return;

}

notifications.reverse().forEach(notification=>{

notificationsList.innerHTML+=`

<div class="notificationCard">

<div class="icon">

🔔

</div>

<div>

<h3>

${notification.title}

</h3>

<p>

${notification.message}

</p>

<span>

${notification.time}

</span>

</div>

</div>

`;

});

}

renderNotifications();