// Modular payment registry: add a real provider here later.
export type PaymentMethod = { id: string; label: string; description: string; enabled: boolean };

export const paymentMethods: PaymentMethod[] = [
  { id: "cod", label: "الدفع عند الاستلام", description: "ادفع نقدًا عند استلام طلبك.", enabled: true },
  { id: "online", label: "الدفع الإلكتروني", description: "قريبًا — بطاقات بنكية ومحافظ إلكترونية.", enabled: false },
];
