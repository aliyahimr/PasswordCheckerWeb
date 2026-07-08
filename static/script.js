/* =========================================================
   SMART PASSWORD STRENGTH CHECKER
========================================================= */


/* =========================================================
   PASSWORD ANALYSIS
========================================================= */
function checkPassword() {
    const password = document.getElementById("passwordInput").value;

    // safety check
    if (!password) {
        alert("Please enter a password first!");
        return;
    }

    fetch("/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: password })
    })
    .then(res => res.json())
    .then(data => {
        console.log("SERVER RESPONSE:", data);

/* =========================================================
   UPDATE UI
========================================================= */

        // =========================
        // SCORE
        // =========================
        document.getElementById("scoreText").innerText = "Score: " + data.score + " / 100";

        // progress bar
        document.getElementById("progressBar").style.width = data.score + "%";
         progressBar.style.width =
        `${data.score}%`;

        progressBar.classList.remove(
            "weak",
            "medium",
            "strong"
        );

        if(data.strength === "Weak"){

            progressBar.classList.add("weak");

        }

        else if(data.strength === "Medium"){

            progressBar.classList.add("medium");

        }

        else{

            progressBar.classList.add("strong");

        }


        // =========================
        // STRENGTH
        // =========================
        document.getElementById("strengthResult").innerText = "Strength: " + data.strength;

        // =========================
        // CRACK TIME
        // =========================
        document.getElementById("crackTime").innerText = data.crack_time;

        // =========================
        // RISKS
        // =========================
        let riskHTML = "";
        if (data.risks && data.risks.length > 0) {
            data.risks.forEach(r => {
                riskHTML += "<li>" + r + "</li>";
            });
        } else {
            riskHTML = "<li>No risk detected</li>";
        }
        document.getElementById("riskList").innerHTML = riskHTML;

        // =========================
        // SUGGESTIONS
        // =========================
        let sugHTML = "";
        if (data.suggestions && data.suggestions.length > 0) {
            data.suggestions.forEach(s => {
                sugHTML += "<li>" + s + "</li>";
            });
        } else {
            sugHTML = "<li>Password is strong 👍</li>";
        }
        document.getElementById("suggestionList").innerHTML = sugHTML;

        // =========================
        // PASSWORD GENERATOR- ENHANCED PASSWORD 
        // =========================
        document.getElementById("generatedPassword").innerText =
            data.recommended
            ? "Enhanced Password: " + data.recommended
            : "No enhancement needed (Strong Password)";
    })
    .catch(error => {
        console.error("ERROR:", error);
        alert("Something went wrong. Check console (F12).");
    });
}

/* =========================================================
   REFRESH SECURITY TIP 
   ========================================================= */
async function refreshTip() {
    try {
        // Tambah timestamp rawak (?_=${new Date().getTime()}) supaya browser tak simpan cache tip lama
        const response = await fetch(`/tip?_=${new Date().getTime()}`);
        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const resData = await response.json();
        console.log("NEW TIP RECEIVED:", resData.tip);

    
        const tipElement = document.getElementById("securityTip");
        if (tipElement) {
            tipElement.innerText = resData.tip;
        }

    } catch (error) {
        console.error("Error fetching new tip:", error);
    }
}



/* =========================================================
   ENTER KEY SUPPORT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        const passwordInput =
            document.getElementById(
                "passwordInput"
            );

        passwordInput.addEventListener(
            "keypress",
            function(event){

                if(event.key === "Enter"){

                    checkPassword();

                }

            }
        );

    }
);


/* =========================================================
   AUTO ANIMATION ON PAGE LOAD
========================================================= */

window.onload = function(){

    const progressBar =
        document.getElementById("progressBar");

    progressBar.style.width = "0%";

}