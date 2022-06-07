import React, { useMemo } from 'react'
//styles
import { Wrapper } from './Cart.styles'
//Components
import CartItem from './CartItem'

//types
import { CartItemType } from '../../App'


type Props = {
    cartItems: CartItemType[];
    addToCart: (clickedItem: CartItemType) => void;
    removeFromCart: (id: number) => void;
}


const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
    const getTotalItems = useMemo(() => cartItems ? cartItems.reduce((ack: number, item) => ack + item.amount * item.price, 0) : 0, [cartItems]);
    return (
        <Wrapper>
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? <p>No Items In The Cart</p> : null}
            {cartItems?.map((item) => (<CartItem key={item.id} item={item} addToCart={addToCart} removeFromCart={removeFromCart} />))}
            <p>Total Amount :- {getTotalItems}</p>
        </Wrapper>
    )
}

export default Cart