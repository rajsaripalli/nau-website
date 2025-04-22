document.getElementById("userForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const nauid = document.getElementById("nauid").value;
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirmpassword").value;

    if (password !== confirmpassword) {
        alert("Passwords do not match.");
        return;
    }

    const userData = {
        firstname,
        lastname,
        email,
        nauid,
        password,
        confirmpassword
    };

    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        console.log("Success:", data);
        alert("Sign up successful!");
        // Optionally redirect
        // window.location.href = "login.html";
    })
    .catch((error) => {
        console.error("Error:", error);
        if (error.message) {
            alert(error.message);
        } else {
            alert("Error signing up.");
        }
    });
});
