'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './MenuPage.module.css';
import OrderForm from '../components/OrderForm';
import { Allergy, allergyIcons, allergyNames } from '@/lib/allergies';

interface Dish {
  id: number;
  name: string;
  image: string;
  allergies: Allergy[];
}

interface OrderItem extends Dish {
  quantity: number;
}

const dishes: Dish[] = [
  { id: 1, name: 'Paella Valenciana', image: '/images/paella.webp', allergies: ['shellfish', 'gluten'] },
  { id: 2, name: 'Gazpacho', image: '/images/gazpacho.webp', allergies: [] },
  { id: 3, name: 'Tortilla Española', image: '/images/tortilla.webp', allergies: ['eggs'] },
  { id: 4, name: 'Patatas Bravas', image: '/images/patatas-bravas.webp', allergies: ['eggs'] },
  { id: 5, name: 'Gambas al Ajillo', image: '/images/gambas.webp', allergies: ['shellfish'] },
  { id: 6, name: 'Croquetas de Jamón', image: '/images/croquetas.webp', allergies: ['gluten', 'dairy'] },
  { id: 7, name: 'Pulpo a la Gallega', image: '/images/pulpo.webp', allergies: ['shellfish'] },
  { id: 8, name: 'Calamares a la Romana', image: '/images/calamares.webp', allergies: ['gluten', 'shellfish'] },
  { id: 9, name: 'Churros con Chocolate', image: '/images/churros.webp', allergies: ['gluten', 'dairy'] },
];

function MenuContent({ initialTableNumber }: { initialTableNumber: string | null }) {
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState<string | null>(initialTableNumber);
  const searchParams = useSearchParams();

  useEffect(() => {
    setTableNumber(searchParams.get('table'));
  }, [searchParams]);

  const addToOrder = (dish: Dish) => {
    setOrder(currentOrder => {
      const existingItem = currentOrder.find(item => item.id === dish.id);
      if (existingItem) {
        return currentOrder.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentOrder, { ...dish, quantity: 1 }];
    });
  };

  const totalItems = order.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Our Tapas Menu</h1>
      {tableNumber && (
        <p className={styles.description}>Table {tableNumber}: Choose your favorite tapas for your next round!</p>
      )}
      
      <button 
        className={styles.menuToggle} 
        onClick={() => setIsOrderMenuOpen(!isOrderMenuOpen)}
      >
        {isOrderMenuOpen ? '×' : '☰'}
        {!isOrderMenuOpen && totalItems > 0 && (
          <span className={styles.notificationBadge}>{totalItems}</span>
        )}
      </button>

      <div className={`${styles.orderMenu} ${isOrderMenuOpen ? styles.open : ''}`}>
        {tableNumber && (
          <OrderForm order={order} setOrder={setOrder} tableNumber={Number(tableNumber)} />
        )}
      </div>

      <div className={styles.menuGrid}>
        {dishes.map((dish) => (
          <div key={dish.id} className={styles.dishCard}>
            <Image 
              src={dish.image} 
              alt={dish.name} 
              width={500} 
              height={500} 
              className={styles.dishImage}
              style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
            />
            <h3 className={styles.dishName}>{dish.name}</h3>
            <div className={styles.allergyIcons}>
              {dish.allergies.map((allergy) => (
                <span 
                  key={allergy} 
                  className={styles.allergyIcon} 
                  title={allergyNames[allergy]}
                >
                  {allergyIcons[allergy]}
                </span>
              ))}
            </div>
            <button onClick={() => addToOrder(dish)} className={styles.addButton}>
              Add to Round
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function MenuPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return <MenuContent initialTableNumber={null} />;
}