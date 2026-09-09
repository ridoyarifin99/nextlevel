"use strict";
(function () {
    if (!/\/admin-orders\.html$/i.test(window.location.pathname)) return;

    const addButton = () => {
        const actions = document.querySelector('.header-actions');
        if (!actions || document.getElementById('adminProductManagementLink')) return;

        const link = document.createElement('a');
        link.id = 'adminProductManagementLink';
        link.className = 'icon-btn';
        link.href = 'admin-products.html';
        link.title = 'Product Management';
        link.setAttribute('aria-label', 'Product Management');
        link.innerHTML = '<i class="fas fa-boxes-stacked"></i>';
        actions.insertBefore(link, actions.firstChild);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButton, { once: true });
    } else {
        addButton();
    }
})();
