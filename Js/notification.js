const API = `${API_BASE}/notifications`;

const user_id = localStorage.getItem("user_id");

let notifications = [];
let currentFilter = "all";

const notificationsList =
document.getElementById("notificationsList");

const emptyState =
document.getElementById("emptyState");

// =======================================
// LOAD NOTIFICATIONS
// =======================================

async function loadNotifications() {

    try {

        const response = await fetch(

            `${API}/${user_id}`

        );

        notifications = await response.json();

        renderNotifications();

    }

    catch (err) {

        console.log(err);

        alert("Failed to load notifications.");

    }

}

loadNotifications();

// =======================================
// RENDER
// =======================================

function renderNotifications() {

    notificationsList.innerHTML = "";

    let list = notifications;

    if (currentFilter === "read") {

        list = notifications.filter(n => n.is_read);

    }

    if (currentFilter === "unread") {

        list = notifications.filter(n => !n.is_read);

    }

    if (list.length === 0) {

        notificationsList.style.display = "none";

        emptyState.style.display = "block";

        return;

    }

    notificationsList.style.display = "block";

    emptyState.style.display = "none";

    list.forEach(notification => {

        let icon = "🔔";

        if (notification.type === "login")
            icon = "🔐";

        if (notification.type === "order")
            icon = "📦";

        if (notification.type === "payment")
            icon = "💳";

        if (notification.type === "shipment")
            icon = "🚚";

        notificationsList.innerHTML += `

<div class="notificationCard ${notification.is_read ? "read" : "unread"}">

<div class="icon">

${icon}

</div>

<div class="content">

<h3>

${notification.title}

</h3>

<p>

${notification.message}

</p>

<small>

${new Date(notification.created_at).toLocaleString()}

</small>

</div>

<div>

${notification.is_read

? "<span class='readBadge'>✓ Read</span>"

: "<span class='unreadBadge'>● Unread</span>"}

</div>

</div>

`;

    });

}

// =======================================
// FILTERS
// =======================================

document.querySelectorAll(".filter").forEach(button => {

    button.onclick = () => {

        document
            .querySelector(".filter.active")
            .classList.remove("active");

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderNotifications();

    };

});

// =======================================
// MARK ALL READ
// =======================================

document.getElementById("markAllRead").onclick = async () => {

    try {

        await fetch(

            `${API}/read-all/${user_id}`,

            {

                method: "PUT"

            }

        );

        notifications.forEach(n => n.is_read = true);

        renderNotifications();

    }

    catch (err) {

        console.log(err);

    }

};