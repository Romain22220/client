fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
    })
    .catch(error => console.error('Erreur lors du chargement de la navbar:', error));

document.addEventListener("DOMContentLoaded", function () {
    // Configuration des événements selon la page
    setupPageEvents();
});
function createMockStudent() {
    // Données fictives de l'étudiant
    const mockStudent = {
        number: 12345, // Utilise la fonction existante de génération de numéro
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
        password: "password123",
        year: "2eme",
        options: "Informatique",
        registrationStep: 2,
        isCompleted: true
    };

    // Récupérer la liste des étudiants existants
    const registeredStudents = JSON.parse(localStorage.getItem('registeredStudents') || '[]');

    // Vérifier si un étudiant fictif existe déjà
    const existingMockStudent = registeredStudents.find(
        student => student.email === mockStudent.email
    );

    if (!existingMockStudent) {
        // Ajouter l'étudiant fictif à la liste
        registeredStudents.push(mockStudent);
        localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));

        alert(`Compte fictif créé !\nNuméro étudiant : ${mockStudent.number}\nMot de passe : ${mockStudent.password}`);
    } else {
        alert("Un compte fictif existe déjà.");
    }
}
function setupPageEvents() {
    // Gestion du formulaire de connexion sur accueil.html
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    // Gestion du formulaire d'inscription
    const registrationForm = document.getElementById("registrationForm");
    if (registrationForm) {
        registrationForm.addEventListener("submit", handleRegistration);
    }

    // Gestion du formulaire de choix d'année
    const yearSelectionForm = document.getElementById("yearSelectionForm");
    if (yearSelectionForm) {
        yearSelectionForm.addEventListener("submit", handleYearSelection);
    }

    // Gestion des boutons de navigation
    const goBackButton = document.getElementById("goBack");
    if (goBackButton) {
        goBackButton.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }
}

function handleLogin(event) {
    event.preventDefault();

    const studentNumber = document.getElementById("studentNumber").value;
    const password = document.getElementById("password").value;

    // Récupérer les étudiants enregistrés
    const registeredStudents = JSON.parse(localStorage.getItem('registeredStudents') || '[]');

    // Ajouter un compte fictif par défaut s'il n'existe pas
    const mockStudent = {
        number: "24001", // Numéro étudiant fixe pour le compte fictif
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
        password: "password123",
        year: "2eme",
        options: "Informatique",
        registrationStep: 2,
        isCompleted: true
    };

    // Vérifier si le compte fictif existe déjà
    const mockStudentExists = registeredStudents.some(s => s.number === mockStudent.number);

    if (!mockStudentExists) {
        registeredStudents.push(mockStudent);
        localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));
    }

    // Trouver l'étudiant correspondant
    const student = registeredStudents.find(
        s => s.number === studentNumber && s.password === password
    );

    if (student) {
        // Stocker les données de connexion
        localStorage.setItem("currentStudent", JSON.stringify(student));

        // Rediriger vers une page de tableau de bord ou d'accueil personnalisé
        window.location.href = 'dashboard.html';
    } else {
        alert("Numéro d'étudiant ou mot de passe incorrect !");
    }
}
// Fonction d'inscription
function handleRegistration(event) {
    event.preventDefault();

    // Récupérer les informations du formulaire
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (password !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas !");
        return;
    }

    // Générer un numéro étudiant
    const studentNumber = generateStudentNumber();

    // Créer l'objet étudiant
    const newStudent = {
        number: studentNumber,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        registrationStep: 1,
        isCompleted: false
    };

    // Récupérer et mettre à jour la liste des étudiants
    const registeredStudents = JSON.parse(localStorage.getItem('registeredStudents') || '[]');
    registeredStudents.push(newStudent);
    localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));

    // Stocker temporairement les données du nouvel étudiant
    localStorage.setItem('newStudentData', JSON.stringify(newStudent));

    // Message de bienvenue
    alert(`Bienvenue ${firstName} ! Votre numéro étudiant est : ${studentNumber}\n\nVous allez maintenant choisir votre année de formation.`);

    // Rediriger vers la page de choix d'année
    window.location.href = 'choix-annee.html';
}

// Fonction de sélection d'année
function handleYearSelection(event) {
    event.preventDefault();

    // Récupérer les données temporaires
    const studentData = JSON.parse(localStorage.getItem('newStudentData'));
    if (!studentData) {
        alert("Erreur : Aucune donnée d'inscription trouvée.");
        return;
    }

    // Récupérer l'année de formation
    const studyYear = document.getElementById('studyYear').value;
    const options = document.getElementById('options').value;

    // Mettre à jour l'étudiant
    studentData.year = studyYear;
    studentData.options = options;
    studentData.registrationStep = 2;
    studentData.isCompleted = true;

    // Mettre à jour dans la liste des étudiants
    const registeredStudents = JSON.parse(localStorage.getItem('registeredStudents') || '[]');
    const studentIndex = registeredStudents.findIndex(s => s.number === studentData.number);

    if (studentIndex !== -1) {
        registeredStudents[studentIndex] = studentData;
        localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));
    }

    // Supprimer les données temporaires
    localStorage.removeItem('newStudentData');

    alert(`Votre profil a été mis à jour. Vous pouvez maintenant vous connecter.`);
    window.location.href = 'accueil.html';
}

// Générer un numéro étudiant unique
function generateStudentNumber() {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    return currentYear + randomPart.toString();
}

// Afficher les informations de l'étudiant connecté

function displayStudentInfo() {
    const currentStudent = JSON.parse(localStorage.getItem("currentStudent"));
    if (currentStudent) {
        const studentInfoContainer = document.getElementById("studentInfo");

        if (studentInfoContainer) {
            studentInfoContainer.style.display = "block";

            document.getElementById("infoNumber").textContent = currentStudent.number || "Non disponible";
            document.getElementById("infoName").textContent = `${currentStudent.firstName} ${currentStudent.lastName}`;
            document.getElementById("infoEmail").textContent = currentStudent.email;
            document.getElementById("infoYear").textContent = currentStudent.year || "Non renseigné";
            document.getElementById("infoOptions").textContent = currentStudent.options || "Non renseigné";
        }
    }
}

// Vérifier si l'utilisateur est déjà connecté au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    const currentStudent = localStorage.getItem("currentStudent");
    if (currentStudent) {
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.style.display = "none";
        }
        displayStudentInfo();
    }
});