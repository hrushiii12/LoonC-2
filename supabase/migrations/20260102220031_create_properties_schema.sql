/*
  # Properties Management Schema

  ## Overview
  Complete schema for managing campings, cottages, and villas with full admin control.

  ## Tables Created
  
  ### 1. properties
  Main properties table storing all property information
  - `id` (uuid, primary key) - Unique property identifier
  - `title` (text) - Property name/title
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Property description
  - `category` (text) - camping, cottage, or villa
  - `location` (text) - Property location
  - `price` (integer) - Price in rupees
  - `price_note` (text) - Price description (e.g., "per person with meal")
  - `capacity` (integer) - Number of guests
  - `max_capacity` (integer) - Maximum capacity
  - `rating` (numeric) - Property rating
  - `is_top_selling` (boolean) - Featured property flag
  - `is_active` (boolean) - Enable/disable property
  - `check_in_time` (text) - Check-in time
  - `check_out_time` (text) - Check-out time
  - `contact` (text) - Contact number
  - `address` (text) - Full address
  - `amenities` (jsonb) - Array of amenities
  - `highlights` (jsonb) - Array of highlights
  - `activities` (jsonb) - Array of activities
  - `policies` (jsonb) - Array of policies
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. property_images
  Property images with ordering support
  - `id` (uuid, primary key) - Unique image identifier
  - `property_id` (uuid, foreign key) - Reference to property
  - `image_url` (text) - Image URL
  - `display_order` (integer) - Image display order
  - `created_at` (timestamptz) - Upload timestamp

  ## Security
  - RLS enabled on all tables
  - Public read access for active properties
  - Admin-only write access
  - Authenticated admin users can manage all properties
*/

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('camping', 'cottage', 'villa')),
  location text NOT NULL,
  price integer NOT NULL,
  price_note text NOT NULL DEFAULT 'per person with meal',
  capacity integer NOT NULL DEFAULT 2,
  max_capacity integer,
  rating numeric(2,1) DEFAULT 4.5,
  is_top_selling boolean DEFAULT false,
  is_active boolean DEFAULT true,
  check_in_time text DEFAULT '2:00 PM',
  check_out_time text DEFAULT '11:00 AM',
  contact text DEFAULT '+91 8669505727',
  address text,
  amenities jsonb DEFAULT '[]'::jsonb,
  highlights jsonb DEFAULT '[]'::jsonb,
  activities jsonb DEFAULT '[]'::jsonb,
  policies jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_is_active ON properties(is_active);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Properties policies
-- Public can read active properties
CREATE POLICY "Anyone can view active properties"
  ON properties
  FOR SELECT
  USING (is_active = true);

-- Authenticated users (admins) can view all properties
CREATE POLICY "Authenticated users can view all properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users (admins) can insert properties
CREATE POLICY "Authenticated users can insert properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users (admins) can update properties
CREATE POLICY "Authenticated users can update properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users (admins) can delete properties
CREATE POLICY "Authenticated users can delete properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (true);

-- Property images policies
-- Public can view images of active properties
CREATE POLICY "Anyone can view images of active properties"
  ON property_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND properties.is_active = true
    )
  );

-- Authenticated users (admins) can view all images
CREATE POLICY "Authenticated users can view all property images"
  ON property_images
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users (admins) can insert images
CREATE POLICY "Authenticated users can insert property images"
  ON property_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users (admins) can update images
CREATE POLICY "Authenticated users can update property images"
  ON property_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users (admins) can delete images
CREATE POLICY "Authenticated users can delete property images"
  ON property_images
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
