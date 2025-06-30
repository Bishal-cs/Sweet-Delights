import React, { useState } from "react";

const initialCakes = [
    {
        id: 1,
        name: "Chocolate Truffle",
        category: "chocolate",
        price: 500,
        stock: 10,
        featured: true,
    },
    {
        id: 2,
        name: "Classic Vanilla",
        category: "vanilla",
        price: 400,
        stock: 8,
        featured: true,
    },
    {
        id: 3,
        name: "Fresh Fruit Cake",
        category: "fruit",
        price: 600,
        stock: 5,
        featured: false,
    },
    {
        id: 4,
        name: "Red Velvet",
        category: "special",
        price: 650,
        stock: 7,
        featured: false,
    },
];

export default function CakeManagementSystem() {
    const [cakes, setCakes] = useState(initialCakes);
    const [filter, setFilter] = useState("all");
    const [form, setForm] = useState({ name: "", category: "chocolate", price: "", stock: "" });
    const [editId, setEditId] = useState(null);

    const filteredCakes = filter === "all" ? cakes : cakes.filter((c) => c.category === filter);

    function handleInput(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleAddOrEdit(e) {
        e.preventDefault();
        if (!form.name || !form.price || !form.stock) return;
        if (editId) {
            setCakes((prev) =>
                prev.map((c) =>
                    c.id === editId ? { ...c, ...form, price: +form.price, stock: +form.stock } : c
                )
            );
            setEditId(null);
        } else {
            setCakes((prev) => [
                ...prev,
                {
                    ...form,
                    id: Date.now(),
                    price: +form.price,
                    stock: +form.stock,
                    featured: false,
                },
            ]);
        }
        setForm({ name: "", category: "chocolate", price: "", stock: "" });
    }

    function handleEdit(cake) {
        setForm({ name: cake.name, category: cake.category, price: cake.price, stock: cake.stock });
        setEditId(cake.id);
    }

    function handleDelete(id) {
        setCakes((prev) => prev.filter((c) => c.id !== id));
        if (editId === id) setEditId(null);
    }

    function toggleFeatured(id) {
        setCakes((prev) =>
            prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
        );
    }

    return (
        <div style={{ maxWidth: 700, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px #0001" }}>
            <h1 style={{ textAlign: "center", marginBottom: 24 }}>Cake Management System</h1>
            <form onSubmit={handleAddOrEdit} style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                <input name="name" value={form.name} onChange={handleInput} placeholder="Cake Name" required style={{ flex: 2 }} />
                <select name="category" value={form.category} onChange={handleInput} style={{ flex: 1 }}>
                    <option value="chocolate">Chocolate</option>
                    <option value="vanilla">Vanilla</option>
                    <option value="fruit">Fruit</option>
                    <option value="special">Special</option>
                </select>
                <input name="price" value={form.price} onChange={handleInput} placeholder="Price" type="number" min="1" required style={{ flex: 1 }} />
                <input name="stock" value={form.stock} onChange={handleInput} placeholder="Stock" type="number" min="0" required style={{ flex: 1 }} />
                <button type="submit" style={{ flex: 1, background: "#ffb347", color: "#fff", border: 0, borderRadius: 6, fontWeight: 700 }}>
                    {editId ? "Update" : "Add"}
                </button>
            </form>
            <div style={{ marginBottom: 16 }}>
                <b>Filter:</b>{" "}
                {['all', 'chocolate', 'vanilla', 'fruit', 'special'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        style={{
                            margin: "0 4px",
                            background: filter === cat ? "#d72660" : "#eee",
                            color: filter === cat ? "#fff" : "#333",
                            border: 0,
                            borderRadius: 4,
                            padding: "4px 12px",
                            cursor: "pointer",
                        }}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fafafa" }}>
                <thead>
                    <tr style={{ background: "#ffb34722" }}>
                        <th style={{ padding: 8 }}>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Featured</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCakes.map((cake) => (
                        <tr key={cake.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: 8 }}>{cake.name}</td>
                            <td>{cake.category}</td>
                            <td>₹{cake.price}</td>
                            <td>{cake.stock}</td>
                            <td>
                                <input type="checkbox" checked={cake.featured} onChange={() => toggleFeatured(cake.id)} />
                            </td>
                            <td>
                                <button onClick={() => handleEdit(cake)} style={{ marginRight: 8 }}>Edit</button>
                                <button onClick={() => handleDelete(cake.id)} style={{ color: "#d72660" }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
