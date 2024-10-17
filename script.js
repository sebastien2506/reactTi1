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
    ouvrirPanier(); // Assurez-vous que cette fonction existe
    mettreAJourNombreArticles();
    afficherPanier();
}

// Fonction pour supprimer un produit du panier
function supprimerDuPanier(id) {
    const index = panier.findIndex(item => item.id === id);
    if (index !== -1) {
        panier.splice(index, 1);
        mettreAJourPanier();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    chargerProduits();
    mettreAJourPanier();
});



function calculerTotal() {
    return panier.reduce((total, item) => total + item.prix * item.quantite, 0);
}


// Modifiez la fonction mettreAJourPanier pour utiliser calculerTotal
function mettreAJourPanier() {
    const contenuPanier = document.getElementById('panier-contenu');
    const totalPanier = document.getElementById('panier-total');
    
    contenuPanier.innerHTML = '';
    
    panier.forEach(item => {
        const element = document.createElement('div');
        element.innerHTML = `
            <span>${item.nom}</span>
            <span>x${item.quantite}</span>
            <span>${(item.prix * item.quantite).toFixed(2)} €</span>
            <button onclick="retirerUnArticle(${item.id})">-</button>
            <button onclick="supprimerDuPanier(${item.id})">🗑️</button>
        `;
        contenuPanier.appendChild(element);
    });

    totalPanier.textContent = calculerTotal().toFixed(2);
    mettreAJourNombreArticles();
}

function mettreAJourNombreArticles() {
    const nombreArticles = panier.reduce((total, item) => total + item.quantite, 0);
    const badgePanier = document.getElementById('badge-panier');
    if (badgePanier) {
        badgePanier.textContent = nombreArticles;
        badgePanier.style.display = nombreArticles > 0 ? 'block' : 'none';
    }
}

function retirerUnArticle(id) {
    const item = panier.find(i => i.id === id);
    if (item) {
        item.quantite--;
        if (item.quantite === 0) {
            supprimerDuPanier(id);
        } else {
            mettreAJourPanier();
        }
    }
}

function ouvrirPanier() {
    const panierElement = document.getElementById('panier');
    if (panierElement) {
        panierElement.style.display = 'block';
    }
}
