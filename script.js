fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
    })
    .catch(error => console.error('Erreur lors du chargement de la navbar:', error));

document.addEventListener("DOMContentLoaded", function () {
    configurerEvenementsPage();
});

const apiUrl = "http://localhost:8090/students";

// Fonction pour récupérer le dernier ID et l'incrémenter
async function getNextId() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des étudiants");
        }
        const students = await response.json();
        return students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1; // Si aucun étudiant, commencer à 1
    } catch (error) {
        console.error("Erreur API:", error);
        return null; // En cas d'erreur, renvoyer null
    }
}

// Fonction d'inscription
async function registerStudent(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    // Récupération des valeurs du formulaire
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const date_naissance = document.getElementById("date_naissance").value;
    const numero = document.getElementById("numero").value;
    const email = document.getElementById("email").value;

    // Récupérer le prochain ID
    const newId = await getNextId();
    if (newId === null) {
        alert("Erreur lors de l'inscription. Veuillez réessayer.");
        return;
    }

    // Création de l'objet étudiant à envoyer
    const studentData = {
        id: newId,
        prenom: firstName,
        nom: lastName,
        date_naissance: date_naissance,
        numero: numero,
        adresse_mail: email
    };

    try {
        // Envoyer les données à l'API avec une requête POST
        const postResponse = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData)
        });

        if (!postResponse.ok) {
            throw new Error("Erreur lors de l'inscription");
        }

        // Stocker les informations de l'utilisateur après l'inscription
        localStorage.setItem("currentUser", JSON.stringify(studentData));

        alert("Inscription réussie ! Vous êtes maintenant connecté.");
        window.location.href = "etudiant.html"; // Redirection vers la page personnelle

    } catch (error) {
        console.error("Erreur API:", error);
        alert("Erreur lors de l'inscription.");
    }
}

// Ajouter l'événement d'inscription
document.addEventListener("DOMContentLoaded", function () {
    const formulaireInscription = document.getElementById("registrationForm");
    if (formulaireInscription) {
        formulaireInscription.addEventListener("submit", registerStudent);
    }
});

// Fonction de connexion
async function gererConnexion(event) {
    event.preventDefault();

    const numeroEtudiant = document.getElementById("studentNumber").value;

    try {
        // Récupérer tous les étudiants
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des étudiants");
        }

        const students = await response.json();
        const utilisateur = students.find(u => u.numero.toString() === numeroEtudiant);

        if (utilisateur) {
            // Récupérer les détails de l'utilisateur
            const userDetailsResponse = await fetch(`${apiUrl}/${utilisateur.id}`);
            if (!userDetailsResponse.ok) {
                throw new Error("Erreur lors de la récupération des détails de l'étudiant");
            }

            const userDetails = await userDetailsResponse.json();

            // Stocker les informations dans localStorage
            localStorage.setItem("currentUser", JSON.stringify(userDetails));

            alert("Connexion réussie !");
            window.location.href = "etudiant.html";

        } else {
            alert("Numéro étudiant incorrect !");
        }
    } catch (error) {
        console.error("Erreur API:", error);
        alert("Erreur lors de la connexion.");
    }
}

// Attacher l'événement de connexion si sur la bonne page
document.addEventListener("DOMContentLoaded", function () {
    const formulaireConnexion = document.getElementById("loginForm");
    if (formulaireConnexion) {
        formulaireConnexion.addEventListener("submit", gererConnexion);
    }
});

// Vérifier si un utilisateur est déjà connecté, mais uniquement sur `etudiant.html`
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("etudiant.html")) {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
            window.location.href = "index.html"; // Rediriger vers la connexion si pas connecté
        }
    }
});
