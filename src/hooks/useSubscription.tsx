import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

export const MOONJAB_PRO = {
  price_id: "price_1TBPv4E84vzDx9ysTSlmjd2j",
  product_id: "prod_U9jNmi5ibVDe1c",
};

interface SubscriptionState {
  subscribed: boolean;
  productId: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
}

export function useSubscription() {
  const { isAuthenticated } = useAuthStore();
  const [state, setState] = useState<SubscriptionState>({
    subscribed: false,
    productId: null,
    subscriptionEnd: null,
    loading: false,
  });

  const checkSubscription = useCallback(async () => {
    if (!isAuthenticated) return;
    setState(s => ({ ...s, loading: true }));
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setState({
        subscribed: data?.subscribed ?? false,
        productId: data?.product_id ?? null,
        subscriptionEnd: data?.subscription_end ?? null,
        loading: false,
      });
    } catch {
      setState(s => ({ ...s, loading: false }));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    checkSubscription();
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [checkSubscription]);

  const openCheckout = async () => {
    const { data, error } = await supabase.functions.invoke('create-checkout');
    if (error) throw error;
    if (data?.url) window.open(data.url, '_blank');
  };

  const openPortal = async () => {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    if (error) throw error;
    if (data?.url) window.open(data.url, '_blank');
  };

  return { ...state, checkSubscription, openCheckout, openPortal };
}
