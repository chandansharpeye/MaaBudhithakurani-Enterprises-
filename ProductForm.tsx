import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Category, Product } from "../types";

const empty: Product = {
  id: "", slug: "", sku: "", name: "", category_id: null, brand: "", model: "", description: "",
  specifications: "", wholesale_price: 0, retail_price: null, price_unit: "per piece", moq: 1,
  stock_qty: 0, gst_rate: null, is_featured: false, price_verified: false, is_active: false,
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ProductForm() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const [form, setForm] = useState<Product>(empty);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    supabase.from("categories").select("id,name").order("sort_order")
      .then(({ data }) => setCategories((data ?? []) as Category[]));
    if (!isNew && id) {
      supabase.from("products").select("*").eq("id", id).single()
        .then(({ data, error }) => {
          if (error) setServerError(error.message); else setForm(data as Product);
        });
    }
  }, [id, isNew]);

  const set = <K extends keyof Product>(key: K, value: Product[K]) => setForm((f) => ({ ...f, [key]: value }));

  const validate = (): string[] => {
    const e: string[] = [];
    if (form.name.trim().length < 2) e.push("Name is required.");
    if (!/^[a-z0-9-]+$/.test(form.slug)) e.push("Slug may only contain lowercase letters, numbers and hyphens.");
    if (form.sku.trim().length < 3) e.push("SKU must be at least 3 characters.");
    if (!(form.wholesale_price >= 0)) e.push("Wholesale price must be 0 or more.");
    if (form.retail_price !== null && form.retail_price < 0) e.push("Retail price must be 0 or more.");
    if (!(form.moq >= 1)) e.push("MOQ must be at least 1.");
    if (!(form.stock_qty >= 0)) e.push("Stock cannot be negative.");
    if (form.gst_rate !== null && (form.gst_rate < 0 || form.gst_rate > 100)) e.push("GST rate must be between 0 and 100.");
    if (form.is_active && !form.price_verified) e.push("Mark the price as verified before making the product live.");
    return e;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const v = validate();
    setErrors(v);
    if (v.length) return;
    setSaving(true);
    const { id: _id, ...payload } = form;
    const query = isNew
      ? supabase.from("products").insert(payload).select("id").single()
      : supabase.from("products").update(payload).eq("id", id!).select("id").single();
    const { error } = await query;
    setSaving(false);
    if (error) {
      setServerError(error.message.includes("products_slug_key") ? "This slug is already used."
        : error.message.includes("products_sku_key") ? "This SKU is already used."
        : error.message);
      return;
    }
    navigate("/");
  };

  const field = (label: string, node: JSX.Element) => <label style={{ display: "grid", gap: 4 }}>{label}{node}</label>;

  return (
    <form onSubmit={save} style={{ display: "grid", gap: 12, maxWidth: 640 }}>
      <h2>{isNew ? "New product" : "Edit product"}</h2>
      {errors.length > 0 && <ul role="alert" style={{ color: "#B42318" }}>{errors.map((x) => <li key={x}>{x}</li>)}</ul>}
      {serverError && <p role="alert" style={{ color: "#B42318" }}>{serverError}</p>}

      {field("Name", <input value={form.name} onChange={(e) => { set("name", e.target.value); if (isNew) set("slug", slugify(e.target.value)); }} />)}
      {field("Slug (URL)", <input value={form.slug} onChange={(e) => set("slug", e.target.value)} />)}
      {field("SKU", <input value={form.sku} onChange={(e) => set("sku", e.target.value.toUpperCase())} />)}
      {field("Category", (
        <select value={form.category_id ?? ""} onChange={(e) => set("category_id", e.target.value || null)}>
          <option value="">No category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      ))}
      {field("Brand", <input value={form.brand ?? ""} onChange={(e) => set("brand", e.target.value)} />)}
      {field("Model", <input value={form.model ?? ""} onChange={(e) => set("model", e.target.value)} />)}
      {field("Description", <textarea rows={3} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />)}
      {field("Specifications", <textarea rows={3} value={form.specifications ?? ""} onChange={(e) => set("specifications", e.target.value)} />)}
      {field("Wholesale price (₹)", <input type="number" min={0} step="0.01" value={form.wholesale_price} onChange={(e) => set("wholesale_price", Number(e.target.value))} />)}
      {field("Retail price (₹, optional)", <input type="number" min={0} step="0.01" value={form.retail_price ?? ""} onChange={(e) => set("retail_price", e.target.value === "" ? null : Number(e.target.value))} />)}
      {field("Price unit", <input value={form.price_unit} onChange={(e) => set("price_unit", e.target.value)} />)}
      {field("Minimum order quantity", <input type="number" min={1} value={form.moq} onChange={(e) => set("moq", Number(e.target.value))} />)}
      {field("Stock quantity", <input type="number" min={0} value={form.stock_qty} onChange={(e) => set("stock_qty", Number(e.target.value))} />)}
      {field("GST rate (%, leave empty if not confirmed)", <input type="number" min={0} max={100} step="0.01" value={form.gst_rate ?? ""} onChange={(e) => set("gst_rate", e.target.value === "" ? null : Number(e.target.value))} />)}
      <label><input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} /> Featured</label>
      <label><input type="checkbox" checked={form.price_verified} onChange={(e) => set("price_verified", e.target.checked)} /> Price verified by owner</label>
      <label><input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)} /> Live on website</label>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save product"}</button>
        <button type="button" onClick={() => navigate("/")}>Cancel</button>
      </div>
    </form>
  );
}
