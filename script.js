// Variables globales
let produits = [];
const panier = [];

// Fonction pour charger les produits depuis le fichier JSON
function chargerProduits() {
    fetch('produits.json')
        .then(response => response.json())
        .then(data => {
            produits = data.produits;
            afficherProduits();
        })
        .catch(error => console.error('Erreur lors du chargement des produits:', error));
}


function afficherProduits() {
    const catalogue = document.getElementById('catalogue');
    catalogue.innerHTML = ''; // Vider le catalogue avant d'ajouter les produits

    produits.forEach(produit => {
        const element = document.createElement('div');
        element.className = 'produit';
        const descriptionCourte = produit.description.length > 50 
            ? produit.description.substring(0, 50) + '...' 
            : produit.description;
        element.innerHTML = `
            <img src="${produit.image}" alt="${produit.nom}">
            <h3>${produit.nom}</h3>
            <p>${descriptionCourte}</p>
            <p>Prix : ${produit.prix} €</p>
            <button onclick="ajouterAuPanier(${produit.id})">Ajouter au panier</button>
        `;
        catalogue.appendChild(element);
    });
}

// Fonction pour ajouter un produit au panier
function ajouterAuPanier(id) {
    const produit = produits.find(p => p.id === id);
    const item = panier.find(i => i.id === id);
    if (item) {
        item.quantite++;
    } else {
        panier.push({ ...produit, quantite: 1 });
    }
    mettreAJourPanier();
    ouvrirPanier();
}



// Fonction pour supprimer un produit du panier
function supprimerDuPanier(id) {
    const index = panier.findIndex(item => item.id === id);
    if (index !== -1) {
        panier.splice(index, 1);
        mettreAJourPanier();
    }
}

function ouvrirPanier() {
    document.getElementById('panier').classList.remove('panier-ferme');
    document.getElementById('panier').classList.add('panier-ouvert');
}

// Gestion du formulaire de commande
document.getElementById('formulaire-commande').addEventListener('submit', function(e) {
    e.preventDefault();
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
});

// Fermeture de la fenêtre modale
document.querySelector('.fermer').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});

// Gestion du bouton de confirmation du panier
document.getElementById('confirmer-panier').addEventListener('click', function() {
    if (panier.length > 0) {
        // Afficher la fenêtre modale de confirmation du panier
        document.getElementById('modal-panier').style.display = 'block';
    }
});

// Fermeture des fenêtres modales
document.querySelectorAll('.fermer').forEach(function(bouton) {
    bouton.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Fermer les modales si on clique en dehors
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    chargerProduits();
    mettreAJourPanier();
});

// Ajoutez ces fonctions à votre fichier JavaScript

function afficherConfirmation() {
    const modal = document.getElementById('modal-confirmation');
    const prixTotal = document.getElementById('modal-prix-total');
    const total = calculerTotal();
    
    prixTotal.textContent = total.toFixed(2);
    modal.style.display = 'block';

    // Ajouter un gestionnaire d'événements pour le bouton de confirmation
    const boutonConfirmer = document.getElementById('bouton-confirmer-commande');
    boutonConfirmer.addEventListener('click', function() {
        window.location.href = 'formulaire.html';
    });
}

function calculerTotal() {
    return panier.reduce((total, item) => total + item.prix * item.quantite, 0);
}

function fermerModal() {
    const modal = document.getElementById('modal-confirmation');
    modal.style.display = 'none';
}

// Modifiez la fonction mettreAJourPanier pour utiliser calculerTotal
function mettreAJourPanier() {
    const contenuPanier = document.getElementById('panier-contenu');
    const totalPanier = document.getElementById('panier-total');
    
    contenuPanier.innerHTML = '';
    
    panier.forEach(item => {
        const element = document.createElement('div');
        element.innerHTML = `
            <span style="font-size: 16px; color: #333; padding: 5px;">${item.nom}</span>
            <span style="font-size: 20px; color: #4CAF50; padding: 5px;"><strong>x${item.quantite}</strong></span>
            <span style="font-size: 18px; color: #FF5722; padding: 5px;">${(item.prix * item.quantite).toFixed(2)} €</span>
                <button onclick="supprimerDuPanier(${item.id})" style="background-color: #F44336; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 5px;">Supprimer</button>
        `;
        contenuPanier.appendChild(element);
    });

    totalPanier.textContent = calculerTotal().toFixed(2);
}

// Ajoutez ces gestionnaires d'événements
document.getElementById('confirmer-panier').addEventListener('click', afficherConfirmation);
document.querySelector('.fermer').addEventListener('click', fermerModal);
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal-confirmation');
    if (event.target == modal) {
        fermerModal();
    }
});

function confirmerPanier() {
    localStorage.setItem('panier', JSON.stringify(panier));
    console.log("Panier stocké :", JSON.parse(localStorage.getItem('panier')));
    window.location.href = 'formulaire.html';
}

