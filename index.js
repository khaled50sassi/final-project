document.addEventListener('DOMContentLoaded', function () {
  // Modal Switch
  const signUpButton = document.getElementById('signUp');
  const signInButton = document.getElementById('signIn');
  const container = document.getElementById('container');

  signUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
  });

  signInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
  });

  // Cart Functionality
  const checkoutButton = document.getElementById('checkout-button');

  const checkoutSection = document.getElementById('checkout-section');
  var btnpanier=document.querySelectorAll(".add-to-cart")
  var prix=document.querySelectorAll("#priceunitaire")
  var title=document.querySelectorAll(".product h4")
  var image=document.querySelectorAll(".product img")
  var quantity=document.querySelectorAll(".quantity-controls input")
  for (let i = 0; i < btnpanier.length; i++) {
    btnpanier[i].addEventListener("click",function addToCart() {
      // Vérifier si le produit existe déjà dans le panier
      const product = cart.find(item => item.name === title[i].innerHTML);
      
      if (product) {
          product.quantity ++;
      } else {
          cart.push({
            image:image[i].src,
              name: title[i].innerHTML,
              price: prix[i].innerHTML,
              quantity: quantity[i].value
          });
      }
  
      // Sauvegarder le panier dans le localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartIcon();
  })
    
  }

  

  var increaseButtons = document.querySelectorAll('.quantity-controls .increase');
 
  const decreaseButtons = document.querySelectorAll('.quantity-controls .decrease');
  const removeButtons = document.querySelectorAll('.remove-item');

  increaseButtons.forEach(button => {
      button.addEventListener('click', () => {
          const input = button.previousElementSibling;
          console.log(input.value);
          input.value = parseInt(input.value) + 1;
          updateTotalPrice();
      });
  });
  
  decreaseButtons.forEach(button => {
      button.addEventListener('click', () => {
          const input = button.nextElementSibling;
          if (parseInt(input.value) > 1) {
              input.value = parseInt(input.value) - 1;
              updateTotalPrice();
          }
      });
  });
  
  removeButtons.forEach(button => {
      button.addEventListener('click', () => {
          button.parentElement.remove();
          updateTotalPrice();
      });
  });
  checkoutButton.addEventListener('click', () => {
    checkoutSection.style.display = 'block';
});
  function updateTotalPrice() {
      let total = 0;
      document.querySelectorAll('.cart-item').forEach(item => {
          const price = parseFloat(item.querySelector('p').textContent.replace(' DT', ''));
          const quantity = parseInt(item.querySelector('input').value);
          total += price * quantity;
      });
      document.getElementById('total-price').textContent = `${total.toFixed(2)} DT`;
  }
  
  updateTotalPrice(); // Initial update

  // Checkout Summary and Stripe Payment
  const checkoutSummary = document.getElementById('checkoutSummary');
  const payButton = document.getElementById('payButton');
  
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let total = 0;

  function renderCheckoutSummary() {
      checkoutSummary.innerHTML = '<h2>Order Summary</h2>';
      cartItems.forEach(item => {
          total += parseFloat(item.price);
          checkoutSummary.innerHTML += `
              <div class="checkout-item">
                  <h3>${item.name}</h3>
                  <p>Price: ${item.price} €</p>
              </div>
          `;
      });
      checkoutSummary.innerHTML += `<h3>Total: ${total.toFixed(2)} €</h3>`;
  }

  renderCheckoutSummary();

  const stripe = Stripe('your-publishable-key-here'); // Replace with your Stripe public key

  payButton.addEventListener('click', async function () {
      try {
          const response = await fetch('/create-checkout-session', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ cartItems })
          });
          const sessionId = await response.json();
          await stripe.redirectToCheckout({ sessionId });
      } catch (error) {
          console.error('Error during checkout:', error);
          alert('An error occurred. Please try again.');
      }
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const checkoutSummary = document.getElementById('checkout-summary');
  const payButton = document.getElementById('pay-button');

  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let total = 0;

  function renderCheckoutSummary() {
      checkoutSummary.innerHTML = '<h2>Résumé de la commande</h2>';
      cartItems.forEach(item => {
          const itemTotal = item.price * item.quantity;
          total += itemTotal;

          checkoutSummary.innerHTML += `
              <div class="checkout-item">
                  <h3>${item.name}</h3>
                  <p>Prix : ${item.price} DT</p>
                  <p>Quantité : ${item.quantity}</p>
                  <p>Total : ${itemTotal.toFixed(2)} DT</p>
              </div>
          `;
      });

      checkoutSummary.innerHTML += `<h3>Total à payer : ${total.toFixed(2)} DT</h3>`;
  }

  renderCheckoutSummary();

  payButton.addEventListener('click', function () {
      // Simuler le processus de paiement
      alert('Merci pour votre achat ! Votre commande a été passée avec succès.');
      localStorage.removeItem('cartItems'); // Vider le panier après la commande
      window.location.href = 'index.html'; // Redirection vers la page d'accueil
  });
});


// Tableau pour stocker les articles du panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fonction pour ajouter un produit au panier



// Fonction pour mettre à jour l'icône du panier avec le nombre d'articles
function updateCartIcon() {
    const cartCount = cart.reduce((total, item) => total + Number(item.quantity), 0);
    document.querySelector('.icons a').innerHTML = `<img src="imag/panier.png" width="30px" alt="Panier"> (${cartCount})`;
}

// Fonction pour afficher les articles du panier sur la page "Panier"
function displayCartItems() {
    const cartItemsContainer = document.querySelector('#cart-items table tbody');
    cartItemsContainer.innerHTML = ''; // Vider le conteneur

    let totalPrice = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        cartItemsContainer.innerHTML += `
            <tr>
                <td> <img src=${item.image} width="100px"/>        </td>
                <td>${item.name}</td>
                <td><input type="number" class="form-control" value="${item.quantity}" min="1"/></td>
                <td>${Number(item.price).toFixed(2)} DT</td>
                <td>${itemTotal.toFixed(2)} DT</td>
                <td><button id="supprimer" class="btn btn-danger" onclick="removeFromCart('${item.name}')">Supprimer</button></td>
            </tr>
            <br/>
        `;
    });

    // Afficher le prix total
    document.getElementById('total-price').innerText = totalPrice.toFixed(2) + ' DT';
}

// Fonction pour modifier la quantité d'un article
function updateQuantity(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = parseInt(newQuantity);
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartIcon();
        }
    }
}

// Fonction pour retirer un article du panier
function removeFromCart(productname) {
    cart = cart.filter(item => item.name != productname);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartIcon();
}

// Fonction pour gérer le checkout
function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide !');
    } else {
        alert('Merci pour votre achat ! Un reçu a été envoyé à votre email.');
        cart = []; // Vider le panier
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon();
        displayCartItems();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();

    // Si on est sur la page "Panier", afficher les articles du panier
    if (document.getElementById('cart-items')) {
        displayCartItems();
    }

    // Si on est sur la page de checkout
    if (document.getElementById('checkout-button')) {
        document.getElementById('checkout-button').addEventListener('click', checkout);
    }
});

