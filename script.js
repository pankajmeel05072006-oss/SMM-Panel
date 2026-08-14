import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


/* ================= FIREBASE ================= */

const firebaseConfig = {

    apiKey: "AIzaSyDK_EcMMwzJ9VA4fU-S4PDiqipDIQJUNYA",

    authDomain: "smm-panel-85e80.firebaseapp.com",

    projectId: "smm-panel-85e80",

    storageBucket: "smm-panel-85e80.firebasestorage.app",

    messagingSenderId: "1067760109873",

    appId: "1:1067760109873:web:072298e1345d2b08780810",

    measurementId: "G-MXVE0EFK6H"

};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

// /* ================= GOOGLE LOGIN ================= */

// async function googleLogin() {

//     try {

//         const result =
//             await signInWithPopup(
//                 auth,
//                 googleProvider
//             );

//         const user = result.user;

//         isLoggedIn = true;

//         closeLogin();

//         showUserPanel();

//         showUserInfo(user);

//         showOrderMessage(
//             "Google login successful!"
//         );

//     } catch (error) {

//         console.error(
//             "Google Login Error:",
//             error
//         );

//         document.getElementById(
//             "loginMessage"
//         ).innerText =
//             "Google login failed. Please try again.";

//     }

// }
/* ================= GOOGLE LOGIN ================= */

async function googleLogin() {

    try {

        const result = await signInWithPopup(
            auth,
            googleProvider
        );

        const user = result.user;

        isLoggedIn = true;

        /* ================= SEND LOGIN TO BACKEND ================= */

        try {

            await fetch("https://smm-panel-ukkc.onrender.com/notify-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: user.displayName,
                    email: user.email
                })
            });

            console.log("Login record sent to backend");

        } catch (backendError) {

            console.error(
                "Backend notification error:",
                backendError
            );

        }

        closeLogin();

        showUserPanel();

        showUserInfo(user);

        showOrderMessage(
            "Google login successful!"
        );

    } catch (error) {

        console.error(
            "Google Login Error:",
            error
        );

        document.getElementById(
            "loginMessage"
        ).innerText =
            "Google login failed. Please try again.";

    }

}

// /* ================= USER INFO ================= */

// function showUserInfo(user) {

//     console.log("User Name:", user.displayName);

//     console.log("User Email:", user.email);

//     console.log("User Photo:", user.photoURL);

// }

/* ================= USER PROFILE ================= */

function showUserInfo(user) {

    const profileBox =
        document.getElementById("dashboardProfileBox");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profileUid =
        document.getElementById("profileUid");

    const profilePhoto =
        document.getElementById("profilePhoto");


    if (!profileBox) return;


    profileName.innerText =
        user.displayName || "Not available";

    profileEmail.innerText =
        user.email || "Not available";

    profileUid.innerText =
        user.uid || "Not available";


    if (user.photoURL) {

        profilePhoto.src =
            user.photoURL;

    } else {

        profilePhoto.style.display =
            "none";
    }


    profileBox.style.display =
        "none";
}
/* ================= DATA ================= */

let isLoggedIn = false;

let balance = 500;

let orders = [];

let selectedService = "";

let selectedRate = 0;


/* Service Rates */

const rates = {

    "Instagram Followers": 8,

    "Instagram Likes": 1,

    "YouTube Views": 12,

    "YouTube Likes": 15,

    "YouTube Subscribers": 200,

    "Facebook Page Likes": 6,

    "Facebook Post Likes": 8

};


/* ================= SELECT SERVICE ================= */

function selectService(service, rate) {

    selectedService = service;

    selectedRate = rate;

    document.getElementById("service").value =
        service;

    calculatePrice();

    document.getElementById("order")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ================= PRICE ================= */

function calculatePrice() {

    const service =
        document.getElementById("service").value;

    const quantity =
        Number(
            document.getElementById("quantity").value
        );

    if (!service || !quantity) {

        document.getElementById("totalPrice")
            .innerText = "₹0.00";

        return;
    }


    const rate = rates[service];

    const price =
        (quantity / 100) * rate;


    document.getElementById("totalPrice")
        .innerText =
        "₹" + price.toFixed(2);

}


/* Service dropdown change */

document
    .getElementById("service")
    .addEventListener("change", function() {

        selectedService = this.value;

        selectedRate = rates[this.value] || 0;

        calculatePrice();

    });


/* ================= SCROLL ================= */

function scrollToServices() {

    document.getElementById("services")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// /* ================= ORDER ================= */

// function placeOrder() {

//     const service =
//         document.getElementById("service").value;

//     const url =
//         document.getElementById("targetUrl").value;

//     const quantity =
//         Number(
//             document.getElementById("quantity").value
//         );


//     if (!service) {

//         showOrderMessage(
//             "Please select a service."
//         );

//         return;
//     }


//     if (!url) {

//         showOrderMessage(
//             "Please enter your profile/post URL."
//         );

//         return;
//     }


//     if (quantity < 100) {

//         showOrderMessage(
//             "Minimum quantity is 100."
//         );

//         return;
//     }


//     /* Calculate price */

//     const price =
//         (quantity / 1000) *
//         rates[service];


//     /*
//        IMPORTANT:

//        User can create/select an order
//        without login.

//        Login is required ONLY here,
//        when actually submitting.
//     */

//     if (!isLoggedIn) {

//         openLogin();

//         return;

//     }


//     submitOrder(
//         service,
//         url,
//         quantity,
//         price
//     );

// }

/* ================= ORDER ================= */

function placeOrder() {

    const service =
        document.getElementById("service").value;

    const url =
        document.getElementById("targetUrl").value;

    const quantity =
        Number(
            document.getElementById("quantity").value
        );


    if (!service) {

        showOrderMessage(
            "Please select a service."
        );

        return;
    }


    if (!url) {

        showOrderMessage(
            "Please enter your profile/post URL."
        );

        return;
    }


    if (!quantity || quantity <= 0) {

        showOrderMessage(
            "Please enter a valid quantity."
        );

        return;
    }


    /* ================= PRICE ================= */

    const price =
        (quantity / 100) *
        rates[service];


    /* ================= LOGIN ================= */

    if (!isLoggedIn) {

        openLogin();

        return;

    }


    submitOrder(
        service,
        url,
        quantity,
        price
    );

}
// /* ================= SUBMIT ORDER ================= */

// function submitOrder(
//     service,
//     url,
//     quantity,
//     price
// ) {

//     if (price > balance) {

//         showOrderMessage(
//             "Insufficient wallet balance."
//         );

//         return;
//     }


//     balance -= price;


//     const order = {

//         id:
//             Math.floor(
//                 Math.random() * 900000
//             ) + 100000,

//         service:
//             service,

//         url:
//             url,

//         quantity:
//             quantity,

//         price:
//             price,

//         status:
//             "Pending"

//     };


//     orders.push(order);


//     updateDashboard();

//     renderOrders();


//     showOrderMessage(
//         "Order successfully submitted!"
//     );


//     document.getElementById("targetUrl")
//         .value = "";


//     document.getElementById("quantity")
//         .value = 100;


//     calculatePrice();

// }

/* ================= SUBMIT ORDER ================= */

function submitOrder(
    service,
    url,
    quantity,
    price
) {

    if (price > balance) {

        showOrderMessage(
            "Insufficient wallet balance."
        );

        return;
    }

    balance -= price;

    const order = {

        id:
            Math.floor(
                Math.random() * 900000
            ) + 100000,

        service:
            service,

        url:
            url,

        quantity:
            quantity,

        price:
            price,

        status:
            "Pending",

        date:
            new Date().toLocaleString()
    };

    orders.push(order);

    updateDashboard();

    renderOrders();

    showOrderMessage(
        "Order successfully submitted!"
    );

    document.getElementById("targetUrl")
        .value = "";

    document.getElementById("quantity")
        .value = "";

    calculatePrice();
}

/* ================= LOGIN MODAL ================= */

function openLogin() {

    document.getElementById("loginModal")
        .style.display = "flex";

}


function closeLogin() {

    document.getElementById("loginModal")
        .style.display = "none";

}


// /* ================= GOOGLE LOGIN ================= */

// function googleLogin() {

//     /*
//        DEMO LOGIN

//        Real Google Login ke liye
//        Firebase Authentication required hai.
//     */

//     isLoggedIn = true;

//     closeLogin();

//     showUserPanel();

//     showOrderMessage(
//         "Login successful."
//     );

// }


// /* ================= PHONE OTP ================= */

// function sendOTP() {

//     const phone =
//         document.getElementById("phone").value;


//     if (phone.length < 10) {

//         document.getElementById("loginMessage")
//             .innerText =
//             "Please enter a valid phone number.";

//         return;
//     }


//     document.getElementById("otpArea")
//         .style.display = "block";


//     document.getElementById("loginMessage")
//         .innerText =
//         "Demo OTP sent. Enter any 6-digit OTP.";

// }


// /* ================= VERIFY OTP ================= */

// function verifyOTP() {

//     const otp =
//         document.getElementById("otp").value;


//     if (otp.length !== 6) {

//         document.getElementById("loginMessage")
//             .innerText =
//             "Please enter 6-digit OTP.";

//         return;
//     }


//     isLoggedIn = true;


//     closeLogin();

//     showUserPanel();


//     document.getElementById("loginMessage")
//         .innerText = "";

// }


/* ================= USER PANEL ================= */

function showUserPanel() {

    const panel =
        document.getElementById("userPanel");

    panel.style.display = "block";


    panel.scrollIntoView({
        behavior: "smooth"
    });


    updateDashboard();

    renderOrders();

}


/* ================= DASHBOARD ================= */

function updateDashboard() {

    document.getElementById("balance")
        .innerText =
        "₹" + balance.toFixed(2);


    document.getElementById("totalOrders")
        .innerText =
        orders.length;


    const completed =
        orders.filter(
            order =>
                order.status === "Completed"
        ).length;


    document.getElementById("completedOrders")
        .innerText =
        completed;

}


/* ================= ORDERS TABLE ================= */

function renderOrders() {

    const table =
        document.getElementById("ordersTable");


    table.innerHTML = "";


    if (orders.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="5">
                    No orders yet.
                </td>

            </tr>

        `;

        return;
    }


    orders.forEach(order => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                #${order.id}
            </td>

            <td>
                ${order.service}
            </td>

            <td>
                ${order.quantity}
            </td>

            <td>
                ₹${order.price.toFixed(2)}
            </td>

            <td>
                ${order.status}
            </td>

        `;


        table.appendChild(row);

    });

}


// /* ================= LOGOUT ================= */

// function logout() {

//     isLoggedIn = false;


//     document.getElementById("userPanel")
//         .style.display = "none";


//     window.scrollTo({
//         top: 0,
//         behavior: "smooth"
//     });

// }

/* ================= LOGOUT ================= */

async function logout() {

    try {

        await signOut(auth);

        isLoggedIn = false;

        document.getElementById("userPanel")
            .style.display = "none";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(
            "Logout Error:",
            error
        );

    }

}
/* ================= MESSAGE ================= */

function showOrderMessage(message) {

    document.getElementById("orderMessage")
        .innerText = message;

}


/* ================= MODAL OUTSIDE CLICK ================= */

window.addEventListener(
    "click",
    function(event) {

        const modal =
            document.getElementById("loginModal");


        if (event.target === modal) {

            closeLogin();

        }

    }
);
/* ================= AUTH STATE ================= */

onAuthStateChanged(auth, (user) => {

    if (user) {

        isLoggedIn = true;

        showUserPanel();

        showUserInfo(user);

    } else {

        isLoggedIn = false;

        document.getElementById("userPanel")
            .style.display = "none";

    }

});
/* ================= MAKE FUNCTIONS AVAILABLE TO HTML ================= */

window.selectService = selectService;
window.calculatePrice = calculatePrice;
window.scrollToServices = scrollToServices;
window.placeOrder = placeOrder;

window.openLogin = openLogin;
window.closeLogin = closeLogin;
window.googleLogin = googleLogin;

window.showUserPanel = showUserPanel;
window.logout = logout;


/* ================================================= */
/* ============ DASHBOARD MENU ===================== */
/* ================================================= */

function toggleDashboardMenu() {

    const sidebar =
        document.getElementById("dashboardSidebar");

    const overlay =
        document.getElementById("dashboardOverlay");

    if (!sidebar || !overlay) {
        return;
    }

    sidebar.classList.toggle("active");

    overlay.classList.toggle("active");
}


/* ================= CLOSE MENU ================= */

function closeDashboardMenu() {

    const sidebar =
        document.getElementById("dashboardSidebar");

    const overlay =
        document.getElementById("dashboardOverlay");

    if (!sidebar || !overlay) {
        return;
    }

    sidebar.classList.remove("active");

    overlay.classList.remove("active");
}


/* ================= HOME ================= */

function dashboardHome() {

    closeDashboardMenu();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ================= SERVICES ================= */

function dashboardServices() {

    closeDashboardMenu();

    const services =
        document.getElementById("services");

    if (services) {

        services.scrollIntoView({
            behavior: "smooth"
        });

    }
}


/* ================= MY ORDERS ================= */

function dashboardOrders() {

    closeDashboardMenu();

    const ordersBox =
        document.getElementById("dashboardOrdersBox");

    if (ordersBox) {

        ordersBox.scrollIntoView({
            behavior: "smooth"
        });

    }
}


/* ================= WALLET ================= */

// function dashboardWallet() {

//     closeDashboardMenu();

//     const balance =
//         document.getElementById("balance");

//     if (balance) {

//         balance.scrollIntoView({
//             behavior: "smooth"
//         });

//     }
// }

/* ================= WALLET ================= */

function dashboardWallet() {

    closeDashboardMenu();

    const wallet =
        document.getElementById("walletBox");

    if (wallet) {

        wallet.style.display = "block";

        wallet.scrollIntoView({
            behavior: "smooth"
        });

    }

}

/* ================= OPEN ADD MONEY ================= */

function openAddMoney() {

    const form =
        document.getElementById("addMoneyForm");

    if (form) {

        form.style.display = "block";

        form.scrollIntoView({
            behavior: "smooth"
        });

    }

}

/* ================= PROFILE ================= */

// function dashboardProfile() {

//     closeDashboardMenu();

//     const welcome =
//         document.getElementById("dashboardWelcome");

//     if (welcome) {

//         welcome.scrollIntoView({
//             behavior: "smooth"
//         });

//     }
// }

function dashboardProfile() {

    closeDashboardMenu();

    const profile =
        document.getElementById(
            "dashboardProfileBox"
        );

    if (profile) {

        profile.style.display = "block";

        profile.scrollIntoView({
            behavior: "smooth"
        });

    }
}


/* ================= HELP ================= */

function dashboardHelp() {

    closeDashboardMenu();

    const help =
        document.getElementById("dashboardHelpBox");

    if (help) {

        help.scrollIntoView({
            behavior: "smooth"
        });

    }
}


/* ================= MAKE FUNCTIONS AVAILABLE ================= */

window.toggleDashboardMenu =
    toggleDashboardMenu;

window.dashboardHome =
    dashboardHome;

window.dashboardServices =
    dashboardServices;

window.dashboardOrders =
    dashboardOrders;

window.dashboardWallet =
    dashboardWallet;

window.dashboardProfile =
    dashboardProfile;

window.dashboardHelp =
    dashboardHelp;

window.showPaymentOptions =
showPaymentOptions;

window.submitWalletPayment =
    submitWalletPayment;

window.openAddMoney =
openAddMoney;

    /* ================================================= */
/* ================ WALLET PAYMENT ================= */
/* ================================================= */

// function dashboardWallet() {

//     closeDashboardMenu();

//     const wallet =
//         document.getElementById("walletBox");

//     if (wallet) {

//         wallet.style.display = "block";

//         wallet.scrollIntoView({
//             behavior: "smooth"
//         });

//     }
// }


/* ================= SHOW PAYMENT ================= */

// function showPaymentOptions() {

//     const amount =
//         Number(
//             document.getElementById("walletAmount").value
//         );

//     const message =
//         document.getElementById(
//             "walletPaymentMessage"
//         );


//     if (!amount || amount <= 0) {

//         message.innerText =
//             "Please enter a valid amount.";

//         return;
//     }


//     document.getElementById(
//         "paymentOptions"
//     ).style.display = "block";


//     message.innerText =
//         "";
// }

/* ================= UPI DIRECT PAYMENT ================= */

function showPaymentOptions() {

    const amount =
        Number(
            document.getElementById("walletAmount").value
        );

    const message =
        document.getElementById(
            "walletPaymentMessage"
        );

    if (!amount || amount <= 0) {

        message.innerText =
            "Please enter a valid amount.";

        return;
    }

    /*
       अपनी वास्तविक UPI ID यहां डालें
    */
    const upiId = "pankaj1252@ptyes";

    const merchantName = "SocialBoost";

    const upiUrl =
        "upi://pay" +
        "?pa=" + encodeURIComponent(upiId) +
        "&pn=" + encodeURIComponent(merchantName) +
        "&am=" + encodeURIComponent(amount.toFixed(2)) +
        "&cu=INR";

    /*
       Mobile में UPI app खोलने की कोशिश
    */
    window.location.href = upiUrl;

}
/* ================= SUBMIT UTR ================= */

function submitWalletPayment() {

    const amount =
        Number(
            document.getElementById("walletAmount").value
        );

    const utr =
        document.getElementById("walletUTR").value
            .trim();

    const message =
        document.getElementById(
            "walletPaymentMessage"
        );


    if (!amount || amount <= 0) {

        message.innerText =
            "Please enter a valid amount.";

        return;
    }


    if (!utr) {

        message.innerText =
            "Please enter your UTR / Transaction ID.";

        return;
    }


    /*
       IMPORTANT:

       Money is NOT added to wallet here.

       Payment will remain Pending
       until admin verifies it.
    */


    message.innerText =
        "Payment submitted. Status: Pending verification.";

    message.style.color =
        "#facc15";


    document.getElementById(
        "walletUTR"
    ).value = "";

}

