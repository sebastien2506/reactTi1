// Variables globales
let produits = [];
const panier = [];
let panierOuvert = false;

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

document.getElementById('confirmer-panier').addEventListener('click', function() {

    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    
    localStorage.setItem('panierConfirme', JSON.stringify(panier));
    
    window.location.href = 'formulaire.html';
});

function calculerTotal() {
    return panier.reduce((total, item) => total + item.prix * item.quantite, 0);
}


function mettreAJourPanier() {
    const contenuPanier = document.getElementById('panier-contenu');
    const totalPanier = document.getElementById('panier-total');
    
    contenuPanier.innerHTML = '';
    
    panier.forEach(item => {
        const element = document.createElement('div');
        element.className = 'panier-item';
        element.innerHTML = `
            <span class="item-nom">${item.nom}</span>
            <div class="item-quantite">
                <button class="btn-quantite" onclick="retirerUnArticle(${item.id})"><i class="fas fa-chevron-down"></i></button>
                <span>${item.quantite}</span>
                <button class="btn-quantite" onclick="ajouterAuPanier(${item.id})"><i class="fas fa-chevron-up"></i></button>
            </div>
            <span class="item-prix">${(item.prix * item.quantite).toFixed(2)} €</span>
            <button class="btn-supprimer" onclick="supprimerDuPanier(${item.id})"><i class="fas fa-trash"></i></button>
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
    if (panierElement && !panierOuvert) {
        panierElement.style.display = 'block';
        panierElement.style.transform = 'translateX(100%)';
        panierElement.style.transition = 'transform 0.9s ease-out';
        setTimeout(() => {
            panierElement.style.transform = 'translateX(0)';
        }, 10);
        panierOuvert = true;
    } else if (panierElement) {
        panierElement.style.display = 'block';
    }
}



