document.addEventListener('DOMContentLoaded', function() {
    console.log("Script d'affichage du panier chargé");
    
    // Récupérer le panier depuis le localStorage
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    console.log("Panier récupéré :", panier);

    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsElement || !cartTotalElement) {
        console.error("Éléments du DOM non trouvés");
        return;
    }

    let total = 0;

    if (panier.length === 0) {
        console.log("Le panier est vide");
        cartItemsElement.innerHTML = '<tr><td colspan="3">Votre panier est vide</td></tr>';
    } else {
        // Afficher les articles du panier
        panier.forEach(item => {
            console.log("Ajout de l'article :", item);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.nom}</td>
                <td>${item.quantite}</td>
                <td>${(item.prix * item.quantite).toFixed(2)} €</td>
            `;
            cartItemsElement.appendChild(row);
            total += item.prix * item.quantite;
        });
    }

    // Mettre à jour le total
    cartTotalElement.textContent = `${total.toFixed(2)} €`;
    console.log("Total calculé :", total);
});
