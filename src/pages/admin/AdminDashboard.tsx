import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  LogOut,
  Edit,
  Trash2,
  Star,
  MapPin,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Property {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  price: number;
  is_active: boolean;
  is_top_selling: boolean;
  rating: number;
}

const AdminDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { signOut, user } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, slug, category, location, price, is_active, is_top_selling, rating')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load properties');
      console.error(error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const handleToggleActive = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('properties')
      .update({ is_active: !currentValue })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update property');
    } else {
      toast.success(currentValue ? 'Property disabled' : 'Property enabled');
      loadProperties();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast.error('Failed to delete property');
    } else {
      toast.success('Property deleted successfully');
      loadProperties();
    }
    setDeleteId(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'camping':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cottage':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'villa':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-50 bg-header backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-primary rounded-full flex items-center justify-center">
                <span className="text-primary font-display text-lg font-semibold">LC</span>
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-header-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-header-foreground/60">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="rounded-xl border-border/50"
              >
                View Website
              </Button>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="rounded-xl text-header-foreground hover:text-primary"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">
              Property Management
            </h2>
            <p className="text-muted-foreground">
              Manage your campings, cottages, and villas
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/properties/new')}
            className="rounded-xl shadow-gold hover:shadow-gold-lg h-12 px-6"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Property
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <Card className="p-12 text-center rounded-3xl border-dashed">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">No properties yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by adding your first property
            </p>
            <Button
              onClick={() => navigate('/admin/properties/new')}
              className="rounded-xl"
            >
              Add Property
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="p-6 rounded-2xl border-border/50 hover:shadow-card transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-xl font-semibold text-foreground">
                        {property.title}
                      </h3>
                      {property.is_top_selling && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Top Selling
                        </Badge>
                      )}
                      <Badge className={getCategoryColor(property.category)}>
                        {property.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-current text-gold" />
                        {property.rating}
                      </div>
                      <div className="font-semibold text-primary">
                        ₹{property.price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl">
                      {property.is_active ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={property.is_active}
                        onCheckedChange={() =>
                          handleToggleActive(property.id, property.is_active)
                        }
                      />
                      <span className="text-xs font-medium">
                        {property.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/admin/properties/${property.id}`)}
                      className="rounded-xl"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteId(property.id)}
                      className="rounded-xl border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the property
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
