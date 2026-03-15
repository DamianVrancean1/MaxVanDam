import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { addProduct, getProductById, updateProduct } from '../../services/productService';

type Props = {
  mode: 'create' | 'edit';
};

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
    shortDescription: existingProduct?.shortDescription ?? '',
    description: existingProduct?.description ?? '',
    imageUrl: existingProduct?.imageUrl ?? existingProduct?.image ?? '',
    compatibility: existingProduct?.compatibility?.join(', ') ?? ''
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        {[
          ['name', 'Nume produs'],
          ['brand', 'Brand'],
          ['model', 'Model'],
          ['category', 'Categorie'],
          ['price', 'Preț'],
          ['stock', 'Stoc'],
          ['imageUrl', 'Imagine URL']
        ].map(([name, label]) => (
          <label className="admin-field" key={name}>
            <span>{label}</span>
            <input name={name} value={(formData as Record<string, string>)[name]} onChange={handleChange} required={name !== 'model' && name !== 'brand' && name !== 'imageUrl'} />
          </label>
        ))}

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
