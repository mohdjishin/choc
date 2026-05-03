import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  User, 
  Shield, 
  Settings, 
  ShoppingBag, 
  Users, 
  BarChart3,
  Package,
  Plus,
  X,
  Loader2,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ChevronDown
} from 'lucide-react';

// Shared UI Components (Defined outside to prevent re-mounting and focus loss)
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(45,27,20,0.05)] border border-white/50 ${className}`}>
    {children}
  </div>
);

const SectionHeading = ({ sub, main }) => (
  <div className="mb-12">
    <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-copper-accent mb-4">{sub}</p>
    <h1 className="text-6xl font-headline-lg italic text-ganache-rich tracking-tight leading-tight">{main}</h1>
  </div>
);

const Dashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(null); 
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'Truffles',
    stock: '',
    description: '',
    images: [],
    videos: [],
    details: [{ title: 'Contents & Composition', content: '' }, { title: 'Storage & Care', content: '' }],
    origins_craft: [],
    is_selected: false
  });

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [metadata, setMetadata] = useState({ total_pages: 1 });

  const fetchProducts = async (page = 1) => {
    setIsLoadingProducts(true);
    try {
      const data = await api.get(`/products?page=${page}&limit=10`);
      setProducts(data.products || []);
      setMetadata(data.metadata || { total_pages: 1 });
      setCurrentPage(page);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  React.useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      fetchProducts(1);
    }
  }, [user]);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(type);
    const uploadToast = toast.loading(`Uploading ${file.name}...`);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const data = await api.post('/products/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Upload successful:', data.url);
      const currentMedia = [...productForm[type]];
      const emptyIndex = currentMedia.findIndex(url => url === '');
      if (emptyIndex !== -1) currentMedia[emptyIndex] = data.url;
      else currentMedia.push(data.url);
      setProductForm({ ...productForm, [type]: currentMedia });
      toast.success('Upload complete', { id: uploadToast });
    } catch (error) {
      toast.error(error.message || 'Upload failed', { id: uploadToast });
    } finally {
      setIsUploading(null);
    }
  };

  const handleMediaChange = (index, value, type) => {
    const newMedia = [...productForm[type]];
    newMedia[index] = value;
    setProductForm({ ...productForm, [type]: newMedia });
  };

  const moveMedia = (index, direction, type) => {
    const newMedia = [...productForm[type]];
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newMedia.length) return;
    [newMedia[index], newMedia[newIndex]] = [newMedia[newIndex], newMedia[index]];
    setProductForm({ ...productForm, [type]: newMedia });
  };

  const removeMedia = (index, type) => {
    const newMedia = productForm[type].filter((_, i) => i !== index);
    setProductForm({ ...productForm, [type]: newMedia.length ? newMedia : [''] });
  };

  const startEditing = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price.toString(),
      category: prod.category,
      stock: prod.stock.toString(),
      description: prod.description,
      images: prod.images?.length ? prod.images : [''],
      videos: prod.videos?.length ? prod.videos : [''],
      details: prod.details?.length ? prod.details : [{ title: '', content: '' }],
      origins_craft: prod.origins_craft?.length ? prod.origins_craft : [],
      is_selected: prod.is_selected || false
    });
    setActiveTab('studio');
  };

  const cancelStudio = () => {
    setEditingProduct(null);
    setProductForm({ 
      name: '', price: '', category: 'Truffles', stock: '', description: '', 
      images: [''], videos: [''],
      details: [{ title: 'Contents & Composition', content: '' }, { title: 'Storage & Care', content: '' }],
      origins_craft: [],
      is_selected: false
    });
    setActiveTab('inventory');
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const images = productForm.images.filter(url => url.trim() !== '');
      const videos = productForm.videos.filter(url => url.trim() !== '');
      const payload = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        images,
        videos
      };

      if (editingProduct) {
        await api.put(`/products?id=${editingProduct.id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      
      cancelStudio();
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    const deleteToast = toast.loading('Deleting...');
    try {
      await api.delete(`/products?id=${id}`);
      toast.success('Product deleted', { id: deleteToast });
      fetchProducts();
    } catch (error) {
      toast.error('Delete failed', { id: deleteToast });
    }
  };

  const renderSuperAdmin = () => (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
      <SectionHeading sub="Admin Panel" main="All Products" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {[
          { label: 'Total Users', value: '1,284', icon: Users, sub: 'Active Accounts' },
          { label: 'Total Sales', value: 'AED 45,290', icon: BarChart3, sub: 'Growth' },
          { label: 'Admins', value: '12', icon: Shield, sub: 'Admin Team' },
          { label: 'System Status', value: 'Normal', icon: Package, sub: 'All Systems Running' },
        ].map((stat, i) => (
          <Card key={i} className="p-12 relative overflow-hidden group hover:-translate-y-2 transition-all duration-700">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-silk-base/50 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
            <stat.icon className="w-6 h-6 text-copper-accent mb-10 opacity-30 group-hover:opacity-100 transition-opacity" />
            <p className="text-ganache-rich/20 text-[9px] uppercase tracking-[0.4em] font-black mb-3">{stat.label}</p>
            <p className="text-4xl font-headline-md text-ganache-rich tracking-tighter mb-4">{stat.value}</p>
            <p className="text-[9px] text-copper-accent/40 font-bold uppercase tracking-widest">{stat.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="p-16">
        <SectionHeading sub="System Settings" main="Manage" />
        <div className="space-y-4">
          {[
            { title: 'User Access', desc: 'Turn store access on or off', active: true },
            { title: 'New Admin Signup', desc: 'Allow new admins to join', active: false },
            { title: 'File Security', desc: 'Protect images and videos', active: true }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-8 border-b border-ganache-rich/[0.03] last:border-none group">
              <div>
                <p className="text-ganache-rich font-bold text-[12px] uppercase tracking-widest group-hover:text-copper-accent transition-colors">{item.title}</p>
                <p className="text-ganache-rich/30 text-[10px] mt-2 italic">{item.desc}</p>
              </div>
              <div className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-500 ${item.active ? 'bg-green-500' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-sm ${item.active ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );

  const renderInventoryTab = () => (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
      <div className="flex justify-between items-end">
        <SectionHeading sub="Manage Items" main="Product List" />
        <button 
          onClick={() => setActiveTab('studio')}
          className="bg-ganache-rich text-silk-base p-5 px-12 rounded-full transition-all uppercase tracking-[0.4em] text-[9px] font-bold shadow-2xl shadow-ganache-rich/20 flex items-center gap-4 hover:bg-copper-accent group active:scale-95"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
          Add New
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="p-12 pb-0 flex justify-between items-center">
          <h3 className="text-2xl font-headline-md italic text-ganache-rich opacity-40">All Items</h3>
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-ganache-rich/20">{products.length} Items</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-none">
            <thead>
              <tr className="bg-silk-base/10 border-none">
                <th className="px-12 py-8 text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/20 border-none">Product</th>
                <th className="px-8 py-8 text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/20 border-none">Category</th>
                <th className="px-8 py-8 text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/20 text-right border-none">Price</th>
                <th className="px-8 py-8 text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/20 text-center border-none">Stock</th>
                <th className="px-12 py-8 text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/20 text-right border-none">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ganache-rich/[0.01]">
              {isLoadingProducts ? (
                [...Array(5)].map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-3xl shimmer" />
                        <div className="space-y-3">
                          <div className="h-3 w-32 shimmer rounded-full" />
                          <div className="h-2 w-20 shimmer rounded-full" />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="h-6 w-24 shimmer rounded-full" />
                    </td>
                    <td className="px-8 py-8">
                      <div className="h-8 w-28 shimmer rounded-full ml-auto" />
                    </td>
                    <td className="px-8 py-8">
                      <div className="h-4 w-12 shimmer rounded-full mx-auto" />
                    </td>
                    <td className="px-12 py-8">
                      <div className="flex justify-end gap-4">
                        <div className="w-12 h-12 rounded-2xl shimmer" />
                        <div className="w-12 h-12 rounded-2xl shimmer" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : products.map((prod) => (
                <tr key={prod.id} className="group hover:bg-silk-base/20 transition-all duration-500 cursor-default">
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-3xl bg-silk-base overflow-hidden border border-ganache-rich/5 shadow-sm group-hover:scale-105 transition-transform duration-700">
                        {prod.images?.[0] ? <img src={prod.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-copper-accent/30 italic text-xl font-headline-md">{prod.name?.charAt(0)}</div>}
                      </div>
                      <div>
                        <p className="text-ganache-rich font-bold text-[14px] uppercase tracking-widest leading-none mb-2">{prod.name}</p>
                        <p className="text-ganache-rich/20 text-[9px] uppercase tracking-widest font-medium">Ref: {prod.id?.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-ganache-rich/40 bg-silk-base/40 px-5 py-2 rounded-full border border-ganache-rich/5">{prod.category}</span>
                  </td>
                  <td className="px-8 py-8 text-right text-2xl font-headline-md italic text-ganache-rich">AED {prod.price?.toFixed(2)}</td>
                  <td className="px-8 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[12px] font-bold text-ganache-rich/40 mb-3">{prod.stock}</span>
                      <div className="w-16 h-[2px] bg-ganache-rich/5 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-copper-accent/40 rounded-full" style={{ width: `${Math.min(100, (prod.stock / 100) * 100)}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-right flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    <button onClick={() => startEditing(prod)} className="w-12 h-12 rounded-2xl bg-white shadow-xl border border-ganache-rich/5 flex items-center justify-center text-ganache-rich hover:bg-ganache-rich hover:text-white transition-all"><Settings className="w-5 h-5" /></button>
                    <button onClick={() => handleDeleteProduct(prod.id)} className="w-12 h-12 rounded-2xl bg-white shadow-xl border border-ganache-rich/5 flex items-center justify-center text-red-800/40 hover:bg-red-800 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {metadata.total_pages > 1 && (
          <div className="p-8 border-t border-ganache-rich/[0.01] flex justify-center items-center gap-12">
            <button 
              onClick={() => fetchProducts(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-4 rounded-full transition-all ${currentPage === 1 ? 'text-ganache-rich/10' : 'text-ganache-rich hover:bg-silk-base'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-6">
              {[...Array(metadata.total_pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => fetchProducts(i + 1)}
                  className={`text-[10px] uppercase tracking-[0.4em] font-black transition-all pb-1 relative ${currentPage === i + 1 ? 'text-copper-accent' : 'text-ganache-rich/20 hover:text-ganache-rich'}`}
                >
                  {String(i + 1).padStart(2, '0')}
                  {currentPage === i + 1 && (
                    <motion.div layoutId="dash-pagination-underline" className="absolute bottom-0 left-0 w-full h-[1px] bg-copper-accent" />
                  )}
                </button>
              ))}
            </div>

            <button 
              onClick={() => fetchProducts(currentPage + 1)}
              disabled={currentPage === metadata.total_pages}
              className={`p-4 rounded-full transition-all ${currentPage === metadata.total_pages ? 'text-ganache-rich/10' : 'text-ganache-rich hover:bg-silk-base'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </Card>
    </motion.div>
  );

  const renderProductStudio = () => (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <button onClick={cancelStudio} className="text-[10px] uppercase tracking-[0.5em] font-bold text-copper-accent hover:-translate-x-3 transition-all flex items-center gap-4">
          ← Back to List
        </button>
        <div className="w-2 h-2 rounded-full bg-copper-accent/20"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 h-full min-h-[800px]">
        {/* Left: Redesigned Input Form */}
        <Card className="md:col-span-7 p-20 flex flex-col border border-ganache-rich/5">
          <SectionHeading sub={editingProduct ? "Edit Item" : "New Item"} main={editingProduct ? "Edit" : "Create"} />
          <form onSubmit={handleCreateProduct} className="flex-1 flex flex-col mt-12 space-y-16">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.5em] font-black text-ganache-rich/30 ml-8 italic">Product Name</label>
              <input type="text" required value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} placeholder="Product Name" className="text-6xl font-headline-md italic text-ganache-rich bg-white/40 border border-ganache-rich/5 py-8 px-12 rounded-[2rem] outline-none placeholder:text-ganache-rich/5 w-full focus:bg-white focus:shadow-xl transition-all tracking-tight" />
            </div>

            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-6">
                <label className="text-[10px] uppercase tracking-[0.5em] font-black text-ganache-rich/30 ml-8 italic">Category</label>
                <div className="relative">
                  <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full bg-white/40 border border-ganache-rich/5 py-6 px-10 rounded-full text-ganache-rich text-[11px] font-bold tracking-widest outline-none focus:bg-white focus:shadow-xl transition-all appearance-none cursor-pointer">
                    {['Truffles', 'Pralines', 'Ganache', 'Boutique Boxes', 'Seasonal'].map(cat => <option key={cat}>{cat}</option>)}
                  </select>
                  <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-ganache-rich/20 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-6">
                <label className="text-[10px] uppercase tracking-[0.5em] font-black text-ganache-rich/30 ml-8 italic">Price (AED)</label>
                <input type="number" step="0.01" required value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="w-full bg-white/40 border border-ganache-rich/5 py-6 px-10 rounded-full text-ganache-rich text-[11px] font-bold tracking-widest outline-none focus:bg-white focus:shadow-xl transition-all" placeholder="0.00" />
              </div>
            </div>

            <div className="flex items-center justify-between p-8 bg-silk-base/10 rounded-[2rem] border border-ganache-rich/5">
              <div>
                <p className="text-ganache-rich font-bold text-[12px] uppercase tracking-widest">Selected Works</p>
                <p className="text-ganache-rich/30 text-[10px] mt-2 italic">Feature this product on the home page</p>
              </div>
              <div 
                onClick={() => setProductForm({...productForm, is_selected: !productForm.is_selected})}
                className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-500 ${productForm.is_selected ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-sm ${productForm.is_selected ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-center px-8">
                <label className="text-[10px] uppercase tracking-[0.5em] font-black text-ganache-rich/30 italic">Product Details</label>
                <button type="button" onClick={() => setProductForm({...productForm, details: [...productForm.details, { title: '', content: '' }]})} className="text-[9px] uppercase tracking-widest font-black text-copper-accent flex items-center gap-3 hover:scale-105 transition-transform">
                  <Plus className="w-3 h-3" /> Add More Info
                </button>
              </div>
              
              <div className="space-y-6">
                {productForm.details.map((detail, idx) => (
                  <div key={`detail-${idx}`} className="group relative bg-silk-base/10 p-10 rounded-[2rem] border border-ganache-rich/5 space-y-6">
                    <div className="flex gap-6">
                      <input 
                        type="text" 
                        placeholder="Title (e.g. Ingredients)" 
                        value={detail.title} 
                        onChange={(e) => {
                          const newDetails = [...productForm.details];
                          newDetails[idx].title = e.target.value;
                          setProductForm({...productForm, details: newDetails});
                        }}
                        className="flex-1 bg-white/60 border border-ganache-rich/5 py-4 px-8 rounded-full text-[10px] uppercase tracking-widest font-bold text-ganache-rich outline-none focus:bg-white transition-all"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          const newDetails = productForm.details.filter((_, i) => i !== idx);
                          setProductForm({...productForm, details: newDetails.length ? newDetails : [{ title: '', content: '' }]});
                        }}
                        className="w-10 h-10 rounded-full bg-red-800/5 text-red-800/40 flex items-center justify-center hover:bg-red-800 hover:text-white transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea 
                      rows="3" 
                      placeholder="Write more info about the product here..." 
                      value={detail.content}
                      onChange={(e) => {
                        const newDetails = [...productForm.details];
                        newDetails[idx].content = e.target.value;
                        setProductForm({...productForm, details: newDetails});
                      }}
                      className="w-full bg-white/40 border border-ganache-rich/5 p-8 rounded-[1.5rem] text-ganache-rich text-[11px] outline-none focus:bg-white transition-all resize-none"
                    ></textarea>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-12 pt-12 border-t border-ganache-rich/5">
              <div className="flex justify-between items-center px-8">
                <p className="text-[10px] uppercase tracking-[0.5em] font-black text-ganache-rich/30 italic">Product Story (Images & Text)</p>
                <button 
                  type="button" 
                  onClick={() => setProductForm({...productForm, origins_craft: [...productForm.origins_craft, { type: 'mixed', title: '', content: '', image: '', tag: '' }]})} 
                  className="text-[9px] uppercase tracking-widest font-black text-copper-accent flex items-center gap-3 hover:scale-105 transition-transform"
                >
                  <Plus className="w-3 h-3" /> Add Chapter
                </button>
              </div>

              <div className="space-y-12">
                {productForm.origins_craft.map((block, idx) => (
                  <div key={`craft-${idx}`} className="group relative bg-ganache-rich/[0.02] p-12 rounded-[2.5rem] border border-ganache-rich/5 space-y-10 shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="flex justify-between items-center border-b border-ganache-rich/5 pb-6">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-copper-accent/10 flex items-center justify-center text-[10px] font-black text-copper-accent">{idx + 1}</span>
                        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-ganache-rich/40">Editorial Chapter</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newCraft = productForm.origins_craft.filter((_, i) => i !== idx);
                          setProductForm({...productForm, origins_craft: newCraft});
                        }}
                        className="w-10 h-10 rounded-full bg-red-800/5 text-red-800/40 flex items-center justify-center hover:bg-red-800 hover:text-white transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <label className="text-[8px] uppercase tracking-widest font-bold text-ganache-rich/30 ml-4">Title</label>
                        <input type="text" value={block.title} onChange={(e) => {
                          const newCraft = [...productForm.origins_craft];
                          newCraft[idx].title = e.target.value;
                          setProductForm({...productForm, origins_craft: newCraft});
                        }} className="w-full bg-white/80 border border-ganache-rich/5 py-4 px-8 rounded-full text-[10px] text-ganache-rich outline-none font-bold tracking-wider focus:bg-white transition-all" placeholder="e.g. Our Cacao" />
                      </div>
                      <div className="space-y-6">
                        <label className="text-[8px] uppercase tracking-widest font-bold text-ganache-rich/30 ml-4">Tag / Label</label>
                        <input type="text" value={block.tag} onChange={(e) => {
                          const newCraft = [...productForm.origins_craft];
                          newCraft[idx].tag = e.target.value;
                          setProductForm({...productForm, origins_craft: newCraft});
                        }} className="w-full bg-white/80 border border-ganache-rich/5 py-4 px-8 rounded-full text-[10px] text-ganache-rich outline-none font-bold tracking-wider focus:bg-white transition-all" placeholder="e.g. ORIGIN" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="text-[8px] uppercase tracking-widest font-bold text-ganache-rich/30 ml-4">Image URL</label>
                      <input type="text" value={block.image} onChange={(e) => {
                        const newCraft = [...productForm.origins_craft];
                        newCraft[idx].image = e.target.value;
                        setProductForm({...productForm, origins_craft: newCraft});
                      }} className="w-full bg-white/80 border border-ganache-rich/5 py-4 px-8 rounded-full text-[10px] text-ganache-rich outline-none focus:bg-white transition-all" placeholder="URL of editorial image" />
                    </div>

                    <div className="space-y-6">
                      <label className="text-[8px] uppercase tracking-widest font-bold text-ganache-rich/30 ml-4">Story Text</label>
                      <textarea rows="4" value={block.content} onChange={(e) => {
                        const newCraft = [...productForm.origins_craft];
                        newCraft[idx].content = e.target.value;
                        setProductForm({...productForm, origins_craft: newCraft});
                      }} className="w-full bg-white/80 border border-ganache-rich/5 p-8 rounded-[2rem] text-ganache-rich text-[11px] leading-relaxed outline-none focus:bg-white transition-all resize-none" placeholder="Write the story here..."></textarea>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-12">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.5em] font-black text-ganache-rich/30 ml-8 italic">Stock Count</label>
                <input type="number" required value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} className="w-full max-w-[160px] bg-white/40 border border-ganache-rich/5 py-5 px-10 rounded-full text-ganache-rich text-[11px] font-bold tracking-widest outline-none" placeholder="Qty" />
              </div>
              <button disabled={isSubmitting} className="group bg-ganache-rich text-silk-base py-8 px-20 rounded-[2.5rem] font-bold text-[10px] uppercase tracking-[0.6em] shadow-[0_40px_100px_rgba(45,27,20,0.2)] hover:bg-copper-accent transition-all flex items-center gap-6 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Shield className="w-4 h-4 group-hover:scale-125 transition-transform" /> {editingProduct ? 'Save Changes' : 'Save Product'}</>}
              </button>
            </div>
          </form>
        </Card>

        {/* Right: Media & Live Demo Preview */}
        <Card className="md:col-span-5 p-12 flex flex-col bg-ganache-rich/[0.02] border border-ganache-rich/5 overflow-hidden">
          <div className="space-y-12 h-full flex flex-col">
            
            {/* Live Storefront Preview */}
            <div className="space-y-6">
               <p className="text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/20 text-center">Store Preview</p>
               <div className="max-w-[280px] mx-auto scale-90 origin-top">
                  <div className="bg-white rounded-sm overflow-hidden shadow-2xl">
                    <div className="aspect-[4/5] bg-silk-base/50 relative overflow-hidden">
                      {productForm.images[0] ? (
                        <img src={productForm.images[0]} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center italic text-[10px] text-ganache-rich/10">No Imagery Set</div>
                      )}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-ganache-rich px-6 py-3 rounded-full text-[8px] uppercase tracking-widest font-black flex items-center gap-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        <ShoppingBag className="w-2 h-2" /> Quick Add
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-copper-accent/60">{productForm.category || 'Category'}</p>
                      <h3 className="text-lg font-headline-md italic text-ganache-rich truncate">{productForm.name || 'Product Name'}</h3>
                      <p className="text-md font-headline-sm text-ganache-rich opacity-40 italic">AED {Number(productForm.price).toFixed(2)}</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-12 pr-4 custom-scrollbar">
              {/* Asset Management */}
              <div className="space-y-10">
                <div className="flex justify-between items-center border-b border-ganache-rich/5 pb-4">
                  <p className="text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/40">Product Photos</p>
                  <button type="button" onClick={() => setProductForm({...productForm, images: [...productForm.images, '']})} className="text-[8px] uppercase tracking-widest font-black text-copper-accent flex items-center gap-2">
                    <Plus className="w-2.5 h-2.5" /> Add Photo
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  {productForm.images.map((url, i) => (
                    <motion.div 
                      layout
                      key={`img-${i}`} 
                      className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-lg group border border-ganache-rich/5"
                    >
                      {url ? (
                        <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-ganache-rich/10 text-[9px] uppercase tracking-widest font-black gap-4">
                          <UploadCloud className="w-6 h-6 opacity-20" />
                          Empty Slot
                        </div>
                      )}
                      
                      {/* Main Image Badge */}
                      {i === 0 && url && (
                        <div className="absolute top-6 left-6 bg-copper-accent text-white text-[8px] uppercase tracking-[0.3em] font-black px-4 py-2 rounded-full shadow-xl z-20">
                          Main Photo
                        </div>
                      )}

                      <div className="absolute inset-0 bg-ganache-rich/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col items-center justify-center p-8 gap-6 z-30">
                        <div className="w-full space-y-4">
                          <p className="text-[8px] uppercase tracking-[0.4em] font-black text-white/40 text-center">Image URL</p>
                          <input 
                            type="text" 
                            value={url} 
                            placeholder="Enter URL..." 
                            onChange={(e) => handleMediaChange(i, e.target.value, 'images')} 
                            className="w-full bg-white/10 border border-white/20 py-3 px-6 rounded-full text-[9px] text-white outline-none focus:bg-white/20 focus:border-white/40 transition-all text-center" 
                          />
                        </div>

                        <div className="flex items-center gap-4">
                          <label className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-ganache-rich transition-all cursor-pointer shadow-xl">
                            <UploadCloud className="w-5 h-5" />
                            <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'images')} />
                          </label>
                          
                          <div className="h-8 w-[1px] bg-white/10 mx-2"></div>

                          <button 
                            type="button" 
                            onClick={() => moveMedia(i, 'left', 'images')} 
                            disabled={i === 0}
                            className={`w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center transition-all shadow-xl ${i === 0 ? 'opacity-20 pointer-events-none' : 'hover:bg-white hover:text-ganache-rich'}`}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <button 
                            type="button" 
                            onClick={() => removeMedia(i, 'images')} 
                            className="w-12 h-12 rounded-full bg-red-500/20 text-red-200 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                          <button 
                            type="button" 
                            onClick={() => moveMedia(i, 'right', 'images')} 
                            disabled={i === productForm.images.length - 1}
                            className={`w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center transition-all shadow-xl ${i === productForm.images.length - 1 ? 'opacity-20 pointer-events-none' : 'hover:bg-white hover:text-ganache-rich'}`}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Order Number */}
                      <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md text-white text-[10px] font-black flex items-center justify-center border border-white/10">
                        {i + 1}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Cinematic Section */}
              <div className="space-y-6 pt-6 border-t border-ganache-rich/5">
                <div className="flex justify-between items-center">
                  <p className="text-[9px] uppercase tracking-[0.4em] font-black text-ganache-rich/40">Video</p>
                  <button type="button" onClick={() => setProductForm({...productForm, videos: [...productForm.videos, '']})} className="text-[8px] uppercase tracking-widest font-black text-copper-accent">Add Video</button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {productForm.videos.map((url, i) => (
                    <div key={`vid-${i}`} className="relative aspect-square rounded-[2rem] overflow-hidden bg-white shadow-sm group border border-ganache-rich/5">
                      {url ? <video src={url} className="w-full h-full object-cover" autoPlay muted loop /> : <div className="w-full h-full flex items-center justify-center text-ganache-rich/5 text-[9px] italic">Empty</div>}
                      <div className="absolute inset-0 bg-ganache-rich/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 gap-4">
                        <input type="text" value={url} placeholder="URL" onChange={(e) => handleMediaChange(i, e.target.value, 'videos')} className="w-full bg-white/10 border border-white/20 py-2 px-4 rounded-full text-[8px] text-white outline-none" />
                        <label className="cursor-pointer text-white/60 hover:text-white transition-colors"><UploadCloud className="w-4 h-4" /><input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e, 'videos')} /></label>
                        <button type="button" onClick={() => removeMedia(i, 'videos')} className="w-8 h-8 rounded-full bg-red-800/40 text-white flex items-center justify-center hover:bg-red-800"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="space-y-16 min-h-screen">
      {activeTab === 'inventory' ? renderInventoryTab() : renderProductStudio()}
    </div>
  );

  const renderCustomer = () => (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
      <SectionHeading sub="Customer Area" main={`Welcome, ${user?.email.split('@')[0]}`} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card className="p-16 group cursor-pointer hover:bg-ganache-rich transition-all duration-700">
          <ShoppingBag className="w-10 h-10 text-copper-accent mb-12 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
          <h3 className="text-4xl font-headline-md italic text-ganache-rich group-hover:text-silk-base transition-colors mb-6">My Orders</h3>
          <p className="text-ganache-rich/40 group-hover:text-silk-base/40 text-sm leading-relaxed mb-12 max-w-xs transition-colors">See all your previous orders and collections here.</p>
          <button className="text-copper-accent text-[9px] uppercase tracking-[0.5em] font-black flex items-center gap-4 group-hover:gap-8 transition-all">
            Open Orders <span>→</span>
          </button>
        </Card>

        <Card className="p-16 group cursor-pointer hover:bg-copper-accent transition-all duration-700">
          <User className="w-10 h-10 text-ganache-rich mb-12 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all" />
          <h3 className="text-4xl font-headline-md italic text-ganache-rich group-hover:text-silk-base transition-colors mb-6">My Profile</h3>
          <p className="text-ganache-rich/40 group-hover:text-silk-base/40 text-sm leading-relaxed mb-12 max-w-xs transition-colors">Change your personal details and delivery addresses.</p>
          <button className="text-ganache-rich text-[9px] uppercase tracking-[0.5em] font-black flex items-center gap-4 group-hover:gap-8 transition-all group-hover:text-silk-base">
            Edit Profile <span>→</span>
          </button>
        </Card>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-ganache-rich pt-32 pb-24 px-8 md:px-24 font-body-md relative overflow-x-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1600px] mx-auto z-10 relative">
        {user?.role === 'super_admin' && renderSuperAdmin()}
        {user?.role === 'admin' && renderAdmin()}
        {user?.role === 'customer' && renderCustomer()}
      </motion.div>
    </div>
  );
};

export default Dashboard;
