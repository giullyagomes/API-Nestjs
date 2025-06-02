import { Role } from '../enums/role.enum';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class User {
    id: string;
    email: string;
    fullName: string;
    password: string;
    role: Role;
    cart: Cart[];
    orders: Order[];
    createdAt: Date;
    updatedAt: Date;
}
