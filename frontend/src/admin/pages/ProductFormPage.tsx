import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addProduct, getProductById, updateProduct } from '../../services/productService';
import { useAxios } from '../../context/AxiosContext';
import type { Product } from '../../types';

type Props = {
  mode: 'create' | 'edit';
};

const CATEGORY_OPTIONS = [
  'Filtre de aer',
  'Filtre de ulei',
  'Filtre de combustibil',
  'Filtre de habitaclu',
  'Sistem de frânare',
  'Suspensie',
  'Transmisie',
  'Electric',
  'Motor',
  'Răcire',
  'Alimentare',
  'Senzori',
  'Rulare',
  'Direcție',
];

const ProductFormPage = ({ mode }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const axios = useAxios();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(mode === 'edit');
  const [notFound, setNotFound] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    category: '',
    price: '',
    stock: '',
    warehouseLocation: '',
    shortDescription: '',
    description: '',
    imageUrl: '',
    compatibility: '',
  });

  useEffect(() => {
    if (mode !== 'edit' || !id) return;
    getProductById(axios, Number(id))
      .then((product: Product) => {
        setFormData({
          name: product.name ?? '',
          brand: product.brand ?? '',
          model: product.model ?? '',
          category: product.category ?? '',
          price: product.price?.toString() ?? '',
          stock: product.stock?.toString() ?? '',
          warehouseLocation: product.warehouseLocation ?? '',
          shortDescription: product.shortDescription ?? '',
          description: product.description ?? '',
          imageUrl: product.imageUrl ?? '',
          compatibility: product.compatibility?.join(', ') ?? '',
        });
        setImagePreview(product.imageUrl ?? '');
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.replace(/[^\d]/g, '') }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.toUpperCase().replace(/[^A-Z0-9\-/ ]/g, '');
    setFormData(prev => ({ ...prev, warehouseLocation: formatted }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Tip de fișier invalid. Sunt acceptate: JPG, PNG, WEBP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Fișierul depășește limita de 2 MB.');
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const response = await axios.post<{ url: string }>('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData(prev => ({ ...prev, imageUrl: response.data.url }));
      setImagePreview(response.data.url);
      toast.success('Imaginea a fost încărcată.');
    } catch {
      toast.error('Eroare la încărcarea imaginii.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      brand: formData.brand,
      model: formData.model,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      warehouseLocation: formData.warehouseLocation.trim(),
      shortDescription: formData.shortDescription,
      description: formData.description,
      imageUrl: formData.imageUrl,
      compatibility: formData.compatibility
        .split(',')
        .map(item => item.trim())
        .filter(Boolean),
    };

    try {
      if (mode === 'edit' && id) {
        await updateProduct(axios, Number(id), payload);
        toast.success('Produsul a fost actualizat cu succes.');
      } else {
        await addProduct(axios, payload);
        toast.success('Produsul a fost adăugat cu succes.');
      }
      navigate('/admin/products');
    } catch {
      toast.error('Eroare la salvarea produsului.');
    }
  };

  if (loading) {
    return <section className="admin-card"><p>Se încarcă...</p></section>;
  }

  if (mode === 'edit' && notFound) {
    return (
      <section className="admin-card">
        <h2>Produsul nu a fost găsit.</h2>
        <Link to="/admin/products" className="admin-inline-link">Înapoi la produse</Link>
      </section>
    );
  }

  return (
    <section className="admin-card">
      <div className="admin-section-header">
        <div>
          <span className="admin-eyebrow">{mode === 'edit' ? 'Editare' : 'Creare'}</span>
          <h2>{mode === 'edit' ? 'Editează produs' : 'Adaugă produs nou'}</h2>
        </div>
      </div>

      <form className="admin-form-grid" onSubmit={handleSubmit}>
        <label className="admin-field">
          <span>Nume produs</span>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label className="admin-field">
          <span>Brand</span>
          <input name="brand" value={formData.brand} onChange={handleChange} />
        </label>

        <label className="admin-field">
          <span>Model</span>
          <input name="model" value={formData.model} onChange={handleChange} />
        </label>

        <label className="admin-field">
          <span>Categorie</span>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Selectează categoria</option>
            {CATEGORY_OPTIONS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Preț</span>
          <input
            name="price"
            value={formData.price}
            onChange={handleNumericChange}
            inputMode="numeric"
            pattern="[0-9]*"
            required
          />
        </label>

        <label className="admin-field">
          <span>Stoc</span>
          <input
            name="stock"
            value={formData.stock}
            onChange={handleNumericChange}
            inputMode="numeric"
            pattern="[0-9]*"
            required
          />
        </label>

        <label className="admin-field">
          <span>Locație depozit (ex: A-1)</span>
          <input
            name="warehouseLocation"
            value={formData.warehouseLocation}
            onChange={handleLocationChange}
            placeholder="A-1"
            pattern="[A-Z0-9\-/ ]+"
            required
          />
        </label>

        <label className="admin-field">
          <span>Imagine</span>
          <div className="admin-upload-area">
            {imagePreview && (
              <img src={imagePreview} alt="preview" className="admin-upload-preview" />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="admin-upload-input"
            />
            {uploading && <span className="admin-upload-status">Se încarcă...</span>}
          </div>
        </label>

        <label className="admin-field admin-field-full">
          <span>Descriere scurtă</span>
          <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={3} />
        </label>

        <label className="admin-field admin-field-full">
          <span>Compatibilitate (separate prin virgulă)</span>
          <textarea name="compatibility" value={formData.compatibility} onChange={handleChange} rows={3} />
        </label>

        <label className="admin-field admin-field-full">
          <span>Descriere completă</span>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={6} required />
        </label>

        <div className="admin-form-actions">
          <Link to="/admin/products" className="admin-secondary-link">Anulează</Link>
          <button type="submit" className="admin-primary-button" disabled={uploading}>
            {mode === 'edit' ? 'Salvează modificările' : 'Creează produs'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProductFormPage;
