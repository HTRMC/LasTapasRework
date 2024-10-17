'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './MenuPage.module.css';
import OrderForm from '@/app/_components/OrderForm';
import { Allergy, allergyIcons, allergyNames } from '@/app/_lib/allergies';

interface Dish {
  id: number;
  name: string;
  image: string;
  allergies: Allergy[];
  category: string;
  subcategory?: string;
}

interface OrderItem extends Dish {
  quantity: number;
}

const dishes: Dish[] = [
  { id: 1, name: 'Paella Valenciana', image: '/images/paella.webp', allergies: ['shellfish', 'gluten'], category: 'Main Courses' },
  { id: 2, name: 'Gazpacho', image: '/images/gazpacho.webp', allergies: [], category: 'Appetizers' },
  { id: 3, name: 'Tortilla Española', image: '/images/tortilla.webp', allergies: ['eggs'], category: 'Appetizers' },
  { id: 4, name: 'Patatas Bravas', image: '/images/patatas-bravas.webp', allergies: ['eggs'], category: 'Side Dishes' },
  { id: 5, name: 'Gambas al Ajillo', image: '/images/gambas.webp', allergies: ['shellfish'], category: 'Appetizers' },
  { id: 6, name: 'Croquetas de Jamón', image: '/images/croquetas.webp', allergies: ['gluten', 'dairy'], category: 'Appetizers' },
  { id: 7, name: 'Pulpo a la Gallega', image: '/images/pulpo.webp', allergies: ['shellfish'], category: 'Main Courses' },
  { id: 8, name: 'Calamares a la Romana', image: '/images/calamares.webp', allergies: ['gluten', 'shellfish'], category: 'Appetizers' },
  { id: 9, name: 'Churros con Chocolate', image: '/images/churros.webp', allergies: ['gluten', 'dairy'], category: 'Desserts' },
  { id: 10, name: 'Sangria', image: '/images/sangria.webp', allergies: [], category: 'Drinks', subcategory: 'Alcoholic' },
  { id: 11, name: 'Tinto de Verano', image: '/images/tinto-de-verano.webp', allergies: [], category: 'Drinks', subcategory: 'Alcoholic' },
  { id: 12, name: 'Horchata', image: '/images/horchata.webp', allergies: ['nuts'], category: 'Drinks', subcategory: 'Non-Alcoholic' },
  { id: 13, name: 'Café con Leche', image: '/images/cafe-con-leche.webp', allergies: ['dairy'], category: 'Drinks', subcategory: 'Hot Beverages' },
];

const categories = ['All', 'Appetizers', 'Main Courses', 'Side Dishes', 'Desserts', 'Drinks'];
const drinkSubcategories = ['All Drinks', 'Alcoholic', 'Non-Alcoholic', 'Hot Beverages'];

function MenuContent({ initialTableNumber }: { initialTableNumber: string | null }) {
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState<string | null>(initialTableNumber);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDrinkSubcategory, setActiveDrinkSubcategory] = useState('All Drinks');
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

  const filteredDishes = dishes.filter(dish => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Drinks') {
      return dish.category === 'Drinks' && (activeDrinkSubcategory === 'All Drinks' || dish.subcategory === activeDrinkSubcategory);
    }
    return dish.category === activeCategory;
  });

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
        <span>{isOrderMenuOpen ? '×' : '☰'}</span>
      {!isOrderMenuOpen && totalItems > 0 && (
        <span className={styles.notificationBadge}>
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
      </button>

      <div className={`${styles.orderMenu} ${isOrderMenuOpen ? styles.open : ''}`}>
        {tableNumber && (
          <OrderForm order={order} setOrder={setOrder} tableNumber={Number(tableNumber)} />
        )}
      </div>

      <div className={styles.categoryTabs}>
        {categories.map(category => (
          <button
            key={category}
            className={`${styles.categoryTab} ${activeCategory === category ? styles.active : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {activeCategory === 'Drinks' && (
        <div className={styles.subcategoryTabs}>
          {drinkSubcategories.map(subcategory => (
            <button
              key={subcategory}
              className={`${styles.subcategoryTab} ${activeDrinkSubcategory === subcategory ? styles.active : ''}`}
              onClick={() => setActiveDrinkSubcategory(subcategory)}
            >
              {subcategory}
            </button>
          ))}
        </div>
      )}

      <div className={styles.menuGrid}>
        {filteredDishes.map((dish) => (
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
    return null;
  }

  return <MenuContent initialTableNumber={null} />;
}