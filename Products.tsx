import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Product } from "../types";

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    const { data, error } = await supabase.from("products")
      .select("id,slug,sku,name,wholesale_price,stock_qty,is_active,price_verified,moq")
      .order("name");
    if (error) setError(error.message); else setItems((data ?? []) as Product[]);
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (p: Product) => {
    setError("");
    const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    if (error) setError(error.message.includes("active_requires_verified_price")
      ? `"${p.name}" cannot go live until its price is marked verified.`
      : error.message);
    else load();
  };

  return (
    <section>
      <h2>Products</h2>
      {error && <p role="alert" style={{ color: "#B42318" }}>{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th>Name</th><th>SKU</th><th>Price</th><th>MOQ</th><th>Stock</th><th>Price verified</th><th>Live</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} style={{ borderTop: "1px solid #DDE2EA" }}>
              <td>{p.name}</td><td>{p.sku}</td><td>₹{p.wholesale_price}</td><td>{p.moq}</td><td>{p.stock_qty}</td>
              <td>{p.price_verified ? "Yes" : "No"}</td>
              <td><button onClick={() => toggleActive(p)}>{p.is_active ? "Live" : "Hidden"}</button></td>
              <td><Link to={`/products/${p.id}`}>Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && !error && <p>No products yet.</p>}
    </section>
  );
}
