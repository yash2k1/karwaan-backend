import ProductMetaData from './ProductMetaData';
import CartItem from './cartItem';
import Order from './order';
import Product from './product';
import User from './user';

export const initializeModel = () => {
    new User();
    new Product();
    new CartItem();
    new Order();
    new ProductMetaData();

    return;
}