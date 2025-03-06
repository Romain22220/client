document.addEventListener("DOMContentLoaded", function () {
    fetch('navbar-etudiant.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
        })
        .catch(error => console.error('Erreur lors du chargement de la navbar:', error));

    afficherInfosEtudiant();
    document.getElementById("formChoixAnnee").addEventListener("submit", choisirNouvelleAnnee);
});

function afficherInfosEtudiant() {
    const etudiantActuel = JSON.parse(localStorage.getItem("currentUser"));
    if (!etudiantActuel) return;

    document.getElementById("infoNumber").textContent = etudiantActuel.numero || "Non disponible";
    document.getElementById("infoName").textContent = `${etudiantActuel.nom}`;
    document.getElementById("infoPrenom").textContent = `${etudiantActuel.prenom}`;
    document.getElementById("infoDate").textContent = `${etudiantActuel.date_naissance}`;

    document.getElementById("infoEmail").textContent = etudiantActuel.adresse_mail;
    document.getElementById("infoYear").textContent = etudiantActuel.annee || "Non renseigné";
    document.getElementById("infoOptions").textContent = etudiantActuel.options || "Non renseigné";
    document.getElementById("infoTD").textContent = etudiantActuel.groupeTD || "Non défini";
    document.getElementById("infoTP").textContent = etudiantActuel.groupeTP || "Non défini";
}

async function choisirNouvelleAnnee(event) {
    event.preventDefault();
    const etudiantActuel = JSON.parse(localStorage.getItem("currentUser"));
    if (!etudiantActuel) return;

    const nouvelleAnnee = document.getElementById("annee").value;
    etudiantActuel.annee = nouvelleAnnee;
    localStorage.setItem("currentUser", JSON.stringify(etudiantActuel));

    alert("Votre demande d'inscription à l'année " + nouvelleAnnee + " a été envoyée pour validation.");
    afficherInfosEtudiant();
}
