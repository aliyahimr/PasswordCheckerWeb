/* =========================================================
   SMART PASSWORD STRENGTH CHECKER
========================================================= */


/* =========================================================
   PASSWORD ANALYSIS
========================================================= */

async function checkPassword() {

    const password =
        document.getElementById("passwordInput").value;

    if(password.trim() === ""){

        alert("Please enter a password.");

        return;
    }

    try{

        const response =
            await fetch("/analyze",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    password:password
                })

            });

        const data = await response.json();

        updateResults(data);

    }

    catch(error){

        console.error(error);

        alert("Error analyzing password.");
    }

}


/* =========================================================
   UPDATE UI
========================================================= */

function updateResults(data){

    /* =========================
       SCORE
    ========================= */

    document.getElementById("scoreText").innerHTML =
        `Score: ${data.score} / 100`;

    const progressBar =
        document.getElementById("progressBar");

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


    /* =========================
       STRENGTH RESULT
    ========================= */

    document.getElementById("strengthResult")
        .innerHTML =

        `
        <h3>Password Strength</h3>
        <p><strong>${data.strength}</strong></p>
        `;


    /* =========================
       RISK ANALYSIS
    ========================= */

    const riskList =
        document.getElementById("riskList");

    riskList.innerHTML = "";

    data.risks.forEach(risk => {

        const li =
            document.createElement("li");

        li.textContent = risk;

        riskList.appendChild(li);

    });


    /* =========================
       CRACK TIME
    ========================= */

    document.getElementById("crackTime")
        .innerHTML = data.crack_time;


    /* =========================
       SUGGESTIONS
    ========================= */

    const suggestionList =
        document.getElementById("suggestionList");

    suggestionList.innerHTML = "";

    if(data.suggestions.length === 0){

        suggestionList.innerHTML =
            "<li>Excellent password. No improvements needed.</li>";

    }

    else{

        data.suggestions.forEach(item => {

            const li =
                document.createElement("li");

            li.textContent = item;

            suggestionList.appendChild(li);

        });

    }

}


/* =========================================================
   PASSWORD GENERATOR
========================================================= */

async function generatePassword(){

    try{

        const response =
            await fetch("/generate");

        const data =
            await response.json();

        document.getElementById(
            "generatedPassword"
        ).innerHTML =

        `
        <strong>${data.password}</strong>
        `;

    }

    catch(error){

        console.error(error);

    }

}


/* =========================================================
   REFRESH SECURITY TIP
========================================================= */

async function refreshTip(){

    try{

        const response =
            await fetch("/tip");

        const data =
            await response.json();

        document.getElementById(
            "securityTip"
        ).innerHTML =
            data.tip;

    }

    catch(error){

        console.error(error);

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