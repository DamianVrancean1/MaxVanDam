import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addProduct, getProductById, updateProduct } from '../../services/productService';

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
  'Direcție'
];

const IMAGE_OPTIONS = Array.from({ length: 100 }, (_, index) => `/products/${index + 1}.jpg`);

const ProductFormPage = ({ mode }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const existingProduct = useMemo(() => {
    if (mode !== 'edit' || !id) return undefined;
    return getProductById(Number(id));
  }, [id, mode]);

  const [formData, setFormData] = useState({
    name: existingProduct?.name ?? '',
    brand: existingProduct?.brand ?? '',
    model: existingProduct?.model ?? '',
    category: existingProduct?.category ?? '',
    price: existingProduct?.price?.toString() ?? '',
    stock: existingProduct?.stock?.toString() ?? '',
    warehouseLocation: existingProduct?.warehouseLocation ?? '',
    shortDescription: existingProduct?.shortDescription ?? '',
    description: existingProduct?.description ?? '',
    imageUrl: existingProduct?.imageUrl ?? existingProduct?.image ?? '',
    compatibility: existingProduct?.compatibility?.join(', ') ?? ''
  });

  const handleChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const digitsOnly = value.replace(/[^\d]/g, '');
    setFormData(prev => ({ ...prev, [name]: digitsOnly }));
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = event.target.value.toUpperCase().replace(/[^A-Z0-9\-/ ]/g, '');
    setFormData(prev => ({ ...prev, warehouseLocation: formattedValue }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

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
      image: formData.imageUrl,
      compatibility: formData.compatibility
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)
    };

    if (mode === 'edit' && existingProduct) {
      updateProduct(existingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    navigate('/admin/products');
  };

  if (mode === 'edit' && !existingProduct) {
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
              {CATEGORY_OPTIONS.map(category => (
                  <option key={category} value={category}>{category}</option>
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
            <select name="imageUrl" value={formData.imageUrl} onChange={handleChange} required>
              <option value="">Alege o imagine din folder</option>
              {IMAGE_OPTIONS.map(image => (
                  <option key={image} value={image}>{image}</option>
              ))}
            </select>
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
            <button type="submit" className="admin-primary-button">
              {mode === 'edit' ? 'Salvează modificările' : 'Creează produs'}
            </button>
          </div>
        </form>
      </section>
  );
};

export default ProductFormPage;
