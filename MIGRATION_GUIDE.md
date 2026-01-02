# Property Data Migration Guide

This guide helps you migrate existing hardcoded property data to the Supabase database.

## Option 1: Manual Migration via Admin Panel (Recommended)

The easiest way is to manually add properties through the admin panel:

1. Login to admin panel: `http://localhost:5000/admin`
2. Click "Add New Property"
3. Fill in the details from each property in `src/components/Properties.tsx`
4. Add images one by one
5. Save the property

**Pros:**
- No coding required
- You can review and modify data before adding
- Safe and controlled

**Cons:**
- Time-consuming for many properties

## Option 2: Automatic Migration Script

For bulk migration, you can use the provided migration script.

### Steps:

1. **Ensure Supabase is configured**
   - Check that `.env` has correct Supabase credentials
   - Verify you can login to admin panel

2. **Create a temporary migration page**

   Create `src/pages/admin/MigrateData.tsx`:
   ```tsx
   import { useState } from 'react';
   import { Button } from '@/components/ui/button';
   import { Card } from '@/components/ui/card';
   import { migratePropertiesToDatabase } from '@/scripts/migrateProperties';

   const MigrateData = () => {
     const [migrating, setMigrating] = useState(false);
     const [result, setResult] = useState('');

     const handleMigrate = async () => {
       setMigrating(true);
       setResult('Migrating...');
       try {
         await migratePropertiesToDatabase();
         setResult('Migration completed successfully!');
       } catch (error: any) {
         setResult(`Migration failed: ${error.message}`);
       }
       setMigrating(false);
     };

     return (
       <div className="min-h-screen flex items-center justify-center bg-background p-6">
         <Card className="p-8 max-w-md w-full">
           <h1 className="text-2xl font-bold mb-4">Migrate Property Data</h1>
           <p className="text-muted-foreground mb-6">
             This will migrate all hardcoded properties to the database.
             Run this only once!
           </p>
           <Button
             onClick={handleMigrate}
             disabled={migrating}
             className="w-full mb-4"
           >
             {migrating ? 'Migrating...' : 'Start Migration'}
           </Button>
           {result && (
             <div className="p-4 bg-secondary rounded-lg">
               <pre className="text-sm whitespace-pre-wrap">{result}</pre>
             </div>
           )}
         </Card>
       </div>
     );
   };

   export default MigrateData;
   ```

3. **Add route to App.tsx**

   Add this route in `src/App.tsx`:
   ```tsx
   <Route
     path="/admin/migrate"
     element={
       <ProtectedRoute>
         <MigrateData />
       </ProtectedRoute>
     }
   />
   ```

4. **Run the migration**
   - Start the dev server: `npm run dev`
   - Login to admin panel
   - Navigate to: `http://localhost:5000/admin/migrate`
   - Click "Start Migration"
   - Wait for completion
   - Check admin dashboard to verify properties

5. **Clean up (Important!)**
   - Remove the migration route from App.tsx
   - Delete the MigrateData.tsx file
   - Delete the migrateProperties.ts script

## Post-Migration Steps

1. **Verify Data**
   - Check all properties in admin dashboard
   - Verify images are loading correctly
   - Check that all fields are populated

2. **Update Property Details Page**

   The PropertyDetails page needs to be updated to fetch from database instead of hardcoded data.

   Replace the property loading logic in `src/pages/PropertyDetails.tsx`:

   ```tsx
   // Replace the static properties import with database fetch
   useEffect(() => {
     const loadProperty = async () => {
       const { data, error } = await supabase
         .from('properties')
         .select(`
           *,
           property_images (
             image_url,
             display_order
           )
         `)
         .eq('slug', propertyId)
         .eq('is_active', true)
         .single();

       if (error || !data) {
         navigate('/');
         return;
       }

       const images = data.property_images
         .sort((a, b) => a.display_order - b.display_order)
         .map((img: any) => img.image_url);

       setPropertyData({
         ...data,
         images: images.length > 0 ? images : [data.image || '']
       });
     };

     loadProperty();
   }, [propertyId]);
   ```

3. **Update Home Page**

   Update the Index page to fetch properties from database in `src/pages/Index.tsx`:

   ```tsx
   // Add this to Index component
   const [properties, setProperties] = useState([]);

   useEffect(() => {
     const loadProperties = async () => {
       const { data } = await supabase
         .from('properties')
         .select(`
           *,
           property_images (
             image_url,
             display_order
           )
         `)
         .eq('is_active', true)
         .order('created_at', { ascending: false });

       if (data) {
         const formattedProperties = data.map(prop => ({
           ...prop,
           images: prop.property_images
             .sort((a, b) => a.display_order - b.display_order)
             .map(img => img.image_url)
         }));
         setProperties(formattedProperties);
       }
     };

     loadProperties();
   }, []);

   // Pass properties to Properties component
   <Properties properties={properties} />
   ```

## Rollback

If something goes wrong:

1. Delete all data from Supabase:
   ```sql
   -- In Supabase SQL Editor
   DELETE FROM property_images;
   DELETE FROM properties;
   ```

2. Try migration again or add properties manually

## Notes

- The migration script uses the existing property data structure
- All properties will be set to "active" by default
- Default contact number is +91 8669505727
- Make sure to backup any important data before migration
- Test on a development environment first
