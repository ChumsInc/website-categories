import React from 'react';
import { Item } from "../types";
import "./ItemCard.scss";
interface ItemCardProps {
    item: Item;
    index: number;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
}
declare const ItemCard: React.FC<ItemCardProps>;
export default ItemCard;
