import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsList, type Product } from "./data";
import { productsOptions } from "./use-products";

type Line = { slug: string; qty: number };
type Ctx = {
  lines: (Line & { product: Product })[];
  count: number; subtotal: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};
const CartCtx = createContext<Ctx | null>(null);
const KEY = "pest-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  useEffect(() => { try { setRaw(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch {} }, []);
  const { data: dbProducts } = useQuery(productsOptions);
  const all: Product[] = dbProducts ?? productsList;
  const save = (l: Line[]) => { setRaw(l); localStorage.setItem(KEY, JSON.stringify(l)); };
  const lines = raw.flatMap((l) => { const product = all.find((p) => p.slug === l.slug); return product ? [{ ...l, product }] : []; });
  const value: Ctx = {
    lines,
    count: lines.reduce((s, l) => s + l.qty, 0),
    subtotal: lines.reduce((s, l) => s + l.qty * l.product.price, 0),
    add: (slug, qty = 1) => { const ex = raw.find((l) => l.slug === slug); save(ex ? raw.map((l) => l.slug === slug ? { ...l, qty: l.qty + qty } : l) : [...raw, { slug, qty }]); },
    setQty: (slug, qty) => save(qty <= 0 ? raw.filter((l) => l.slug !== slug) : raw.map((l) => l.slug === slug ? { ...l, qty } : l)),
    remove: (slug) => save(raw.filter((l) => l.slug !== slug)),
    clear: () => save([]),
  };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
