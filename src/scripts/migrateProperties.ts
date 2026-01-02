import { supabase } from '@/lib/supabase';
import { properties } from '@/components/Properties';

export async function migratePropertiesToDatabase() {
  console.log('Starting property migration...');

  for (const property of properties) {
    const propertyData = {
      title: property.title,
      slug: property.id || property.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: property.description,
      category: property.category,
      location: property.location,
      price: parseInt(property.price.replace(/[^\d]/g, '')) || 0,
      price_note: property.priceNote,
      capacity: property.capacity,
      max_capacity: property.maxCapacity || property.capacity,
      rating: property.rating,
      is_top_selling: property.isTopSelling,
      is_active: true,
      check_in_time: property.checkInTime || '2:00 PM',
      check_out_time: property.checkOutTime || '11:00 AM',
      contact: property.contact || '+91 8669505727',
      address: property.address || '',
      amenities: property.amenities,
      highlights: property.highlights || [],
      activities: property.activities || [],
      policies: property.policies || [],
    };

    const { data: newProperty, error: propertyError } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single();

    if (propertyError) {
      console.error(`Failed to migrate property: ${property.title}`, propertyError);
      continue;
    }

    console.log(`Migrated property: ${property.title}`);

    const images = property.images || [property.image];
    if (images.length > 0) {
      const imageRecords = images.map((url, index) => ({
        property_id: newProperty.id,
        image_url: url,
        display_order: index,
      }));

      const { error: imageError } = await supabase
        .from('property_images')
        .insert(imageRecords);

      if (imageError) {
        console.error(`Failed to migrate images for: ${property.title}`, imageError);
      } else {
        console.log(`Migrated ${images.length} images for: ${property.title}`);
      }
    }
  }

  console.log('Migration complete!');
}
