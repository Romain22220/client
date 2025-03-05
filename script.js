fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
    })
    .catch(error => console.error('Erreur lors du chargement de la navbar:', error));

document.addEventListener("DOMContentLoaded", function () {
    configurerEvenementsPage();
});

function creerEtudiantFictif() {
    const etudiantFictif = {
        number: 12345,
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
        password: "password123",
        year: "2eme",
        options: "Informatique",
        registrationStep: 2,
        isCompleted: true
    };

    const etudiantsEnregistres = JSON.parse(localStorage.getItem('registeredStudents') || '[]');

    const etudiantFictifExistant = etudiantsEnregistres.find(
        student => student.email === etudiantFictif.email
    );

    if (!etudiantFictifExistant) {
        etudiantsEnregistres.push(etudiantFictif);
        localStorage.setItem('registeredStudents', JSON.stringify(etudiantsEnregistres));

        alert(`Compte fictif créé !\nNuméro étudiant : ${etudiantFictif.number}\nMot de passe : ${etudiantFictif.password}`);
    } else {
        alert("Un compte fictif existe déjà.");
    }
}

function configurerEvenementsPage() {
    const formulaireConnexion = document.getElementById("loginForm");
    if (formulaireConnexion) {
        formulaireConnexion.addEventListener("submit", gererConnexion);
    }

    const formulaireInscription = document.getElementById("registrationForm");
    if (formulaireInscription) {
        formulaireInscription.addEventListener("submit", gererInscription);
    }

    const formulaireChoixAnnee = document.getElementById("yearSelectionForm");
    if (formulaireChoixAnnee) {
        formulaireChoixAnnee.addEventListener("submit", gererChoixAnnee);
    }

    const boutonRetour = document.getElementById("goBack");
    if (boutonRetour) {
        boutonRetour.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }
}

function gererConnexion(event) {
    event.preventDefault();

    const numeroEtudiant = document.getElementById("studentNumber").value;
    const motDePasse = document.getElementById("password").value;

    const etudiantsEnregistres = JSON.parse(localStorage.getItem('registeredStudents') || '[]');

    const etudiantFictif = {
        number: "24001",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
        password: "password123",
        year: "2eme",
        options: "Informatique",
        registrationStep: 2,
        isCompleted: true
    };

    const etudiantFictifExistant = etudiantsEnregistres.some(s => s.number === etudiantFictif.number);

    if (!etudiantFictifExistant) {
        etudiantsEnregistres.push(etudiantFictif);
        localStorage.setItem('registeredStudents', JSON.stringify(etudiantsEnregistres));
    }

    const etudiant = etudiantsEnregistres.find(
        s => s.number === numeroEtudiant && s.password === motDePasse
    );

    if (etudiant) {
        localStorage.setItem("currentStudent", JSON.stringify(etudiant));
        window.location.href = 'dashboard.html';
    } else {
        alert("Numéro d'étudiant ou mot de passe incorrect !");
    }
}

function gererInscription(event) {
    event.preventDefault();

    const prenom = document.getElementById('firstName').value;
    const nom = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const motDePasse = document.getElementById('password').value;
    const confirmerMotDePasse = document.getElementById('confirmPassword').value;

    if (motDePasse !== confirmerMotDePasse) {
        alert("Les mots de passe ne correspondent pas !");
        return;
    }

    const numeroEtudiant = genererNumeroEtudiant();

    const nouvelEtudiant = {
        number: numeroEtudiant,
        firstName: prenom,
        lastName: nom,
        email: email,
        password: motDePasse,
        registrationStep: 1,
        isCompleted: false
    };

    const etudiantsEnregistres = JSON.parse(localStorage.getItem('registeredStudents') || '[]');
    etudiantsEnregistres.push(nouvelEtudiant);
    localStorage.setItem('registeredStudents', JSON.stringify(etudiantsEnregistres));

    localStorage.setItem('newStudentData', JSON.stringify(nouvelEtudiant));

    alert(`Bienvenue ${prenom} ! Votre numéro étudiant est : ${numeroEtudiant}\n\nVous allez maintenant choisir votre année de formation.`);
    window.location.href = 'choix-annee.html';
}

function gererChoixAnnee(event) {
    event.preventDefault();

    const donneesEtudiant = JSON.parse(localStorage.getItem('newStudentData'));
    if (!donneesEtudiant) {
        alert("Erreur : Aucune donnée d'inscription trouvée.");
        return;
    }

    const anneeEtude = document.getElementById('studyYear').value;
    const options = document.getElementById('options').value;

    donneesEtudiant.year = anneeEtude;
    donneesEtudiant.options = options;
    donneesEtudiant.registrationStep = 2;
    donneesEtudiant.isCompleted = true;

    const etudiantsEnregistres = JSON.parse(localStorage.getItem('registeredStudents') || '[]');
    const indexEtudiant = etudiantsEnregistres.findIndex(s => s.number === donneesEtudiant.number);

    if (indexEtudiant !== -1) {
        etudiantsEnregistres[indexEtudiant] = donneesEtudiant;
        localStorage.setItem('registeredStudents', JSON.stringify(etudiantsEnregistres));
    }

    localStorage.removeItem('newStudentData');

    alert(`Votre profil a été mis à jour. Vous pouvez maintenant vous connecter.`);
    window.location.href = 'accueil.html';
}

function genererNumeroEtudiant() {
    const anneeCourante = new Date().getFullYear().toString().slice(-2);
    const partieAleatoire = Math.floor(10000 + Math.random() * 90000);
    return anneeCourante + partieAleatoire.toString();
}

function afficherInfosEtudiant() {
    const etudiantActuel = JSON.parse(localStorage.getItem("currentStudent"));
    if (etudiantActuel) {
        const conteneurInfosEtudiant = document.getElementById("studentInfo");

        if (conteneurInfosEtudiant) {
            conteneurInfosEtudiant.style.display = "block";

            document.getElementById("infoNumber").textContent = etudiantActuel.number || "Non disponible";
            document.getElementById("infoName").textContent = `${etudiantActuel.firstName} ${etudiantActuel.lastName}`;
            document.getElementById("infoEmail").textContent = etudiantActuel.email;
            document.getElementById("infoYear").textContent = etudiantActuel.year || "Non renseigné";
            document.getElementById("infoOptions").textContent = etudiantActuel.options || "Non renseigné";
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const etudiantActuel = localStorage.getItem("currentStudent");
    if (etudiantActuel) {
        const formulaireConnexion = document.getElementById("loginForm");
        if (formulaireConnexion) {
            formulaireConnexion.style.display = "none";
        }
        afficherInfosEtudiant();
    }
});