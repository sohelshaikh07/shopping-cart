import { useQuery } from 'react-query';
import { useState } from "react"

//components
// import Drawer from '@material-ui/core/Drawer';
import { LinearProgress, Drawer, Grid, Badge } from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';
import Item from './Components/Item/Item'
//styles
import { Wrapper, StyledButton } from './App.Styles';
import Cart from './Components/Cart/Cart';



//types
export type CartItemType = {
  id: number;
  category: string;
  description: string;
  price: number;
  title: string;
  amount: number;
  rating: Object;
  image: string;
}


const getProducts = async (): Promise<CartItemType[]> => {
  return await (await fetch('https://fakestoreapi.com/products')).json();
}

function App() {
  // let regex = /([A-Za-z][A-Za-z0-9][0-9].?[0-9]){3-7}/;
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartsItems] = useState([] as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>('products', getProducts);
  const getTotalItems = (items: CartItemType[]) => cartItems.reduce((ack: number, item) => ack + item.amount, 0)

  const handleAddToCart = (clickedItem: CartItemType) => {

    setCartsItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item => item.id === clickedItem.id
          ? { ...item, amount: item.amount + 1 } : item)
      }

      return [...prev, { ...clickedItem, amount: 1 }]
    });
  }

  const handleRemoveFromCart = (id: number) => {
    setCartsItems(prev => prev.reduce((ack, item) => {
      if (item.id === id) {
        if (item.amount === 1) return ack;
        return [...ack, { ...item, amount: item.amount - 1 }]
      } else {
        return [...ack, item];
      }
    }, [] as CartItemType[]));
  }

  if (isLoading) return <LinearProgress />
  if (error) return <div>Something went wrong.</div>

  return (
    <Wrapper>

      <Drawer anchor='right' open={isCartOpen} onClose={() => setIsCartOpen(false)}>
        <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart} />
      </Drawer>
      <StyledButton
        onClick={() => setIsCartOpen(true)}
      >
        <Badge badgeContent={getTotalItems(cartItems)} color="error"></Badge>
        <AddShoppingCart />
      </StyledButton>

      <Grid container spacing={3}>
        {data?.map((item) => <Grid item key={item.id} xs={12} sm={4}><Item item={item} handleAddToCart={handleAddToCart} /></Grid>)}
      </Grid>
    </Wrapper>
  );
}

export default App;
