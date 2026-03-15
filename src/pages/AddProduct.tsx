import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductFormData, FormErrors } from '../types';
import { addProduct } from '../services/productService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import '../styles/AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Numele produsului este obligatoriu';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Numele trebuie să aibă minim 3 caractere';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Categoria este obligatorie';
    }

    if (!formData.price) {
      newErrors.price = 'Prețul este obligatoriu';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Prețul trebuie să fie mai mare ca 0';
    }

    if (!formData.stock) {
      newErrors.stock = 'Stocul este obligatoriu';
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stocul nu poate fi negativ';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrierea este obligatorie';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrierea trebuie să aibă minim 10 caractere';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'URL-ul imaginii este obligatoriu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (validateForm()) {
      const newProduct = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        imageUrl: formData.imageUrl
      };

      addProduct(newProduct);
      setSuccessMessage('Produsul a fost adăugat cu succes!');
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        imageUrl: ''
      });

      // Redirect to products page after 2 seconds
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <h1>Adaugă Produs Nou</h1>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <Input
            label="Nume Produs"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Ex: Placute Frana"
            required
          />

          <Input
            label="Categorie"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            placeholder="Ex: Frane"
            required
          />

          <div className="form-row">
            <Input
              label="Preț (MDL)"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              placeholder="150"
              required
            />

            <Input
              label="Stoc (bucăți)"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              error={errors.stock}
              placeholder="25"
              required
            />
          </div>

          <Input
            label="Descriere"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Descrie produsul..."
            required
            multiline
          />

          <Input
            label="URL Imagine"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            error={errors.imageUrl}
            placeholder="https://example.com/image.jpg"
            required
          />

          <div className="form-actions">
            <Button type="submit" variant="primary">
              Adaugă Produs
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/admin')}>
              Anulează
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
