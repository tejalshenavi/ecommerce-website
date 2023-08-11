import React from 'react';

const CartContext = React.createContext({
    items: [],
    totalAmount: 0,
    isLoggedIn: false, // Add an initial value for the user's login status
    login: (token, email) => {},
    logout: () => {}, // Define the logout method
    removeItem: (itemId) => {},
});

export default CartContext;
