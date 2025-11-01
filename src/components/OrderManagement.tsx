import { useState, useEffect } from 'react';
import { supabase, Order, Customer, OrderItem, Product } from '../lib/supabase';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface OrderWithDetails extends Order {
  customer?: Customer;
  items?: (OrderItem & { product?: Product })[];
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersData) {
      const ordersWithDetails = await Promise.all(
        ordersData.map(async (order) => {
          const { data: customer } = await supabase
            .from('customers')
            .select('*')
            .eq('id', order.customer_id)
            .maybeSingle();

          const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          const itemsWithProducts = await Promise.all(
            (items || []).map(async (item) => {
              const { data: product } = await supabase
                .from('products')
                .select('*')
                .eq('id', item.product_id)
                .maybeSingle();

              return { ...item, product };
            })
          );

          return {
            ...order,
            customer: customer || undefined,
            items: itemsWithProducts,
          };
        })
      );

      setOrders(ordersWithDetails);
    }

    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    fetchOrders();
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      processing: 'En cours',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Commandes</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucune commande</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedOrders.has(order.id) ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>

                      <div>
                        <p className="text-sm text-gray-500">
                          Commande #{order.id.substring(0, 8)}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {order.customer?.name || 'Client inconnu'}
                        </p>
                        <p className="text-sm text-gray-600">{order.customer?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Montant</p>
                      <p className="text-xl font-bold text-gray-900">
                        {Number(order.total_amount).toFixed(2)} €
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Statut</p>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as Order['status'])
                        }
                        className={`px-3 py-1 text-sm font-semibold rounded-full border-0 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option value="pending">En attente</option>
                        <option value="processing">En cours</option>
                        <option value="shipped">Expédié</option>
                        <option value="delivered">Livré</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-sm text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>

                {expandedOrders.has(order.id) && (
                  <div className="mt-6 pl-9">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Adresse de livraison</h4>
                      <p className="text-sm text-gray-700">{order.shipping_address}</p>

                      <h4 className="font-semibold text-gray-900 mt-6 mb-3">Articles</h4>
                      <div className="space-y-3">
                        {order.items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-white p-3 rounded"
                          >
                            <div className="flex items-center space-x-3">
                              {item.product && (
                                <img
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.product?.name || 'Produit inconnu'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {item.size} / {item.color} - Qté: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {Number(item.price).toFixed(2)} €
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
