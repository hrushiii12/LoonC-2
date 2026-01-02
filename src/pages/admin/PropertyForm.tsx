import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, Save, Plus, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface PropertyFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  price: number;
  price_note: string;
  capacity: number;
  max_capacity: number;
  rating: number;
  is_top_selling: boolean;
  is_active: boolean;
  check_in_time: string;
  check_out_time: string;
  contact: string;
  address: string;
  amenities: string[];
  highlights: string[];
  activities: string[];
  policies: string[];
}

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    slug: '',
    description: '',
    category: 'camping',
    location: '',
    price: 0,
    price_note: 'per person with meal',
    capacity: 2,
    max_capacity: 4,
    rating: 4.5,
    is_top_selling: false,
    is_active: true,
    check_in_time: '2:00 PM',
    check_out_time: '11:00 AM',
    contact: '+91 8669505727',
    address: '',
    amenities: [],
    highlights: [],
    activities: [],
    policies: [],
  });

  const [images, setImages] = useState<string[]>([]);
  const [newItem, setNewItem] = useState({
    amenity: '',
    highlight: '',
    activity: '',
    policy: '',
  });
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Failed to load property');
      navigate('/admin/dashboard');
      return;
    }

    setFormData(data);

    const { data: imageData } = await supabase
      .from('property_images')
      .select('image_url')
      .eq('property_id', id)
      .order('display_order');

    if (imageData) {
      setImages(imageData.map((img) => img.image_url));
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleChange = (field: keyof PropertyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'title' && !isEdit) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  const addArrayItem = (field: 'amenities' | 'highlights' | 'activities' | 'policies') => {
    const key = field.slice(0, -3) as keyof typeof newItem;
    const value = newItem[key].trim();
    if (value) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
      }));
      setNewItem((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const removeArrayItem = (
    field: 'amenities' | 'highlights' | 'activities' | 'policies',
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        const { error } = await supabase
          .from('properties')
          .update(formData)
          .eq('id', id);

        if (error) throw error;

        await supabase.from('property_images').delete().eq('property_id', id);

        if (images.length > 0) {
          const imageRecords = images.map((url, index) => ({
            property_id: id,
            image_url: url,
            display_order: index,
          }));

          await supabase.from('property_images').insert(imageRecords);
        }

        toast.success('Property updated successfully');
      } else {
        const { data: property, error } = await supabase
          .from('properties')
          .insert(formData)
          .select()
          .single();

        if (error) throw error;

        if (images.length > 0) {
          const imageRecords = images.map((url, index) => ({
            property_id: property.id,
            image_url: url,
            display_order: index,
          }));

          await supabase.from('property_images').insert(imageRecords);
        }

        toast.success('Property created successfully');
      }

      navigate('/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-50 bg-card backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin/dashboard')}
              className="rounded-xl"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                {isEdit ? 'Edit Property' : 'Add New Property'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-8 rounded-3xl border-border/50">
            <h2 className="font-display text-2xl font-bold mb-6">Basic Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title">Property Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Luxury Lakeside Cottage"
                  required
                  className="rounded-xl h-12"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="luxury-lakeside-cottage"
                  required
                  className="rounded-xl h-12"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the property..."
                  required
                  rows={4}
                  className="rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="camping">Camping</SelectItem>
                    <SelectItem value="cottage">Cottage</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Pawna Lake"
                  required
                  className="rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
                  required
                  className="rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="price_note">Price Note</Label>
                <Input
                  id="price_note"
                  value={formData.price_note}
                  onChange={(e) => handleChange('price_note', e.target.value)}
                  placeholder="per person with meal"
                  className="rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
                  required
                  className="rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="max_capacity">Max Capacity</Label>
                <Input
                  id="max_capacity"
                  type="number"
                  value={formData.max_capacity}
                  onChange={(e) => handleChange('max_capacity', parseInt(e.target.value) || 0)}
                  className="rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
                  className="rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                  placeholder="+91 8669505727"
                  className="rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="check_in_time">Check-in Time</Label>
                <Input
                  id="check_in_time"
                  value={formData.check_in_time}
                  onChange={(e) => handleChange('check_in_time', e.target.value)}
                  placeholder="2:00 PM"
                  className="rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="check_out_time">Check-out Time</Label>
                <Input
                  id="check_out_time"
                  value={formData.check_out_time}
                  onChange={(e) => handleChange('check_out_time', e.target.value)}
                  placeholder="11:00 AM"
                  className="rounded-xl h-12"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Full property address"
                  rows={2}
                  className="rounded-xl"
                />
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  checked={formData.is_top_selling}
                  onCheckedChange={(checked) => handleChange('is_top_selling', checked)}
                />
                <Label>Top Selling</Label>
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange('is_active', checked)}
                />
                <Label>Active</Label>
              </div>
            </div>
          </Card>

          <Card className="p-8 rounded-3xl border-border/50">
            <h2 className="font-display text-2xl font-bold mb-6">Images</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Enter image URL"
                  className="rounded-xl h-12"
                />
                <Button
                  type="button"
                  onClick={addImage}
                  className="rounded-xl h-12 px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-border">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {['amenities', 'highlights', 'activities', 'policies'].map((field) => (
            <Card key={field} className="p-8 rounded-3xl border-border/50">
              <h2 className="font-display text-2xl font-bold mb-6 capitalize">
                {field}
              </h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newItem[field.slice(0, -3) as keyof typeof newItem]}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        [field.slice(0, -3)]: e.target.value,
                      })
                    }
                    placeholder={`Add ${field.slice(0, -3)}`}
                    className="rounded-xl h-12"
                  />
                  <Button
                    type="button"
                    onClick={() => addArrayItem(field as any)}
                    className="rounded-xl h-12 px-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData[field as keyof PropertyFormData].map((item: any, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-2 text-sm flex items-center gap-2"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem(field as any, index)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
              className="rounded-xl h-12 px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl h-12 px-8 shadow-gold"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : isEdit ? 'Update Property' : 'Create Property'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PropertyForm;
