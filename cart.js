// cart.js — handles cart logic, sidebar, auth check

document.addEventListener("DOMContentLoaded", function () {

    // ── USERNAME DISPLAY ──────────────────────────────────────────
    const username = localStorage.getItem("username");
    const userDisplay = document.getElementById("userDisplay");

    if (username && userDisplay) {
        userDisplay.style.display = "block";
        userDisplay.innerText = "👤 " + username;
    }

    // ── LOGOUT ───────────────────────────────────────────────────
    const logoutBtn = document.getElementById("logoutBtn");
    if (username && logoutBtn) {
        logoutBtn.style.display = "inline-block";
    }
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("username");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("cart");
            window.location.reload();
        });
    }

    // ── CART HELPERS ──────────────────────────────────────────────
    function getCart() {
        try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
        catch(e) { return []; }
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    function updateCartCount() {
        const total = getCart().reduce(function(sum, item){ return sum + item.qty; }, 0);
        const el = document.getElementById("cartCount");
        if (el) el.innerText = total;
    }

    function renderCart() {
        const cart = getCart();
        const cartItems  = document.getElementById("cartItems");
        const cartFooter = document.getElementById("cartFooter");
        if (!cartItems) return;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
            if (cartFooter) cartFooter.style.display = "none";
            return;
        }

        if (cartFooter) cartFooter.style.display = "block";
        var html = "";
        var total = 0;

        cart.forEach(function(item, index) {
            total += item.price * item.qty;
            html += '<div class="cart-item">'
                  + '<div class="cart-item-name">' + item.name + '</div>'
                  + '<div class="cart-item-controls">'
                  + '<button class="qty-btn" data-action="dec" data-index="' + index + '">−</button>'
                  + '<span class="qty-value">' + item.qty + '</span>'
                  + '<button class="qty-btn" data-action="inc" data-index="' + index + '">+</button>'
                  + '<span class="cart-item-price">₹' + (item.price * item.qty).toLocaleString() + '</span>'
                  + '<button class="remove-btn" data-index="' + index + '">🗑</button>'
                  + '</div></div>';
        });

        cartItems.innerHTML = html;
        var totalEl = document.getElementById("cartTotal");
        if (totalEl) totalEl.innerText = "₹" + total.toLocaleString();

        cartItems.querySelectorAll(".qty-btn").forEach(function(btn) {
            btn.addEventListener("click", function() {
                var idx    = parseInt(btn.dataset.index);
                var action = btn.dataset.action;
                var c = getCart();
                if (action === "inc") {
                    c[idx].qty++;
                } else {
                    c[idx].qty--;
                    if (c[idx].qty <= 0) c.splice(idx, 1);
                }
                saveCart(c);
                renderCart();
                updateCartCount();
            });
        });

        cartItems.querySelectorAll(".remove-btn").forEach(function(btn) {
            btn.addEventListener("click", function() {
                var c = getCart();
                c.splice(parseInt(btn.dataset.index), 1);
                saveCart(c);
                renderCart();
                updateCartCount();
            });
        });
    }

    // ── SIDEBAR OPEN / CLOSE ──────────────────────────────────────
    var cartBtn     = document.getElementById("cartBtn");
    var cartSidebar = document.getElementById("cartSidebar");
    var cartOverlay = document.getElementById("cartOverlay");
    var closeCart   = document.getElementById("closeCart");

    function openCart()  { renderCart(); cartSidebar.classList.add("open");    cartOverlay.classList.add("open"); }
    function closePanel(){ cartSidebar.classList.remove("open"); cartOverlay.classList.remove("open"); }

    if (cartBtn)     cartBtn.addEventListener("click", openCart);
    if (closeCart)   closeCart.addEventListener("click", closePanel);
    if (cartOverlay) cartOverlay.addEventListener("click", closePanel);

    // ── ADD TO CART ───────────────────────────────────────────────
    document.querySelectorAll(".add-to-cart-btn").forEach(function(btn) {
        btn.addEventListener("click", function() {
            if (!localStorage.getItem("username")) {
                var modal = document.getElementById("authPromptModal");
                if (modal) modal.style.display = "flex";
                return;
            }

            var name  = btn.dataset.name;
            var price = parseInt(btn.dataset.price);
            var cart  = getCart();
            var existing = null;
            for (var i = 0; i < cart.length; i++) {
                if (cart[i].name === name) { existing = cart[i]; break; }
            }

            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name: name, price: price, qty: 1 });
            }

            saveCart(cart);
            updateCartCount();

            btn.innerText = "✓ Added!";
            btn.style.background = "#28a745";
            setTimeout(function() {
                btn.innerText = "+ Add to Cart";
                btn.style.background = "";
            }, 1200);
        });
    });

    // ── AUTH PROMPT CLOSE ─────────────────────────────────────────
    var closePrompt = document.getElementById("closeAuthPrompt");
    if (closePrompt) {
        closePrompt.addEventListener("click", function() {
            document.getElementById("authPromptModal").style.display = "none";
        });
    }

    updateCartCount();
});
