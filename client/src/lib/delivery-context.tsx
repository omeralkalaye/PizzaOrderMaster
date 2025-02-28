import { createContext, useContext, ReactNode, useState } from 'react';

type DeliveryType = 'delivery' | 'pickup';

interface DeliveryContextType {
  deliveryType: DeliveryType;
  setDeliveryType: (type: DeliveryType) => void;
  getPriceMultiplier: () => number;
}

const DeliveryContext = createContext<DeliveryContextType | null>(null);

export function DeliveryProvider({ children }: { children: ReactNode }) {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');

  const getPriceMultiplier = () => {
    return deliveryType === 'delivery' ? 1.1 : 1; // 10% תוספת למשלוח
  };

  return (
    <DeliveryContext.Provider value={{ deliveryType, setDeliveryType, getPriceMultiplier }}>
      {children}
    </DeliveryContext.Provider>
  );
}

export function useDelivery() {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
}
