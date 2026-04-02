import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total_amount: number;
  guest_count: number;
  time_slot: string;
  created_at: string;
  customer_name: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  price_at_time: number;
  menu_item?: MenuItem;
}

// Database helper functions
export async function getMenuItems(category?: string) {
  let query = supabase.from('menu_items').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query.order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
  
  return data as MenuItem[];
}

export async function createOrder(order: Partial<Order>, items: { menu_item_id: string; quantity: number; price: number }[]) {
  // Start a transaction
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();
  
  if (orderError) {
    console.error('Error creating order:', orderError);
    return null;
  }
  
  // Insert order items
  const orderItems = items.map(item => ({
    order_id: orderData.id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    price_at_time: item.price
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return null;
  }
  
  return orderData as Order;
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        menu_item:menu_items (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  
  return data;
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating order status:', error);
    return null;
  }
  
  return data as Order;
}
