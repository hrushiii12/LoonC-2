# LoonCamp Admin Panel Setup Guide

## Overview

The admin panel allows you to manage all properties (campings, cottages, villas) for the LoonCamp website. You can add, edit, delete, and enable/disable properties through a secure, user-friendly interface.

## Features

- Secure authentication with Supabase Auth
- Add new properties with full details
- Edit existing properties
- Delete properties
- Enable/disable properties (show/hide from public)
- Manage property images
- Manage amenities, highlights, activities, and policies
- Mark properties as "Top Selling"
- Real-time updates to the website

## Setup Instructions

### Step 1: Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to be ready
3. The database schema has already been created with the migration file

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   You can find these values in:
   - Supabase Dashboard > Settings > API
   - Project URL: `VITE_SUPABASE_URL`
   - Anon/Public Key: `VITE_SUPABASE_ANON_KEY`

### Step 3: Create Admin User

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add User" > "Create new user"
4. Enter:
   - Email: your-admin@email.com
   - Password: your-secure-password
5. Click "Create user"

### Step 4: Run the Application

```bash
npm install
npm run dev
```

## Using the Admin Panel

### Accessing the Admin Panel

1. Navigate to: `http://localhost:5000/admin`
2. Enter your admin credentials
3. You'll be redirected to the dashboard

### Dashboard Features

**Property List View:**
- View all properties in a list
- See property status (Active/Disabled)
- Quick toggle to enable/disable properties
- Edit button to modify property details
- Delete button to remove properties
- Filter by category (coming soon)

**Add New Property:**
1. Click "Add New Property" button
2. Fill in all required fields:
   - Basic Info: Title, description, category, location
   - Pricing: Price and price note
   - Capacity: Number of guests
   - Contact: Phone number
   - Timing: Check-in and check-out times
   - Address: Full address
3. Add images (enter image URLs)
4. Add amenities, highlights, activities, and policies
5. Toggle "Top Selling" if it's a featured property
6. Toggle "Active" to publish immediately
7. Click "Create Property"

**Edit Property:**
1. Click the Edit button on any property
2. Modify any field
3. Add or remove images
4. Update amenities, highlights, etc.
5. Click "Update Property"

**Delete Property:**
1. Click the Delete button
2. Confirm the deletion
3. Property and all its images will be removed

**Enable/Disable Property:**
- Use the switch on each property card
- Disabled properties won't show on the public website
- Useful for seasonal properties or maintenance

## Database Structure

### Properties Table
- `id`: Unique identifier
- `title`: Property name
- `slug`: URL-friendly identifier
- `description`: Property description
- `category`: camping | cottage | villa
- `location`: Property location
- `price`: Price in rupees
- `price_note`: Price description
- `capacity`: Number of guests
- `max_capacity`: Maximum capacity
- `rating`: Property rating (0-5)
- `is_top_selling`: Featured property flag
- `is_active`: Enable/disable flag
- `check_in_time`: Check-in time
- `check_out_time`: Check-out time
- `contact`: Contact number
- `address`: Full address
- `amenities`: JSON array of amenities
- `highlights`: JSON array of highlights
- `activities`: JSON array of activities
- `policies`: JSON array of policies

### Property Images Table
- `id`: Unique identifier
- `property_id`: Reference to property
- `image_url`: Image URL
- `display_order`: Order of images (0 = first image)

## Security

- All admin routes are protected with authentication
- Only authenticated users can access admin panel
- Row Level Security (RLS) is enabled on all tables
- Public users can only view active properties
- Admin users can manage all properties

## Tips

1. **Property Slugs**: Auto-generated from title, but you can customize them
2. **Image URLs**: Use image hosting services like Cloudinary, imgbb, or your own CDN
3. **Top Selling**: Mark only the best properties as top selling for better visibility
4. **Ratings**: Keep ratings between 4.0-5.0 for credibility
5. **Descriptions**: Write compelling descriptions (100-200 words)
6. **Amenities**: Add 8-12 key amenities that matter most
7. **Highlights**: Focus on unique selling points (4-6 items)

## Troubleshooting

### Cannot Login
- Verify your Supabase credentials in `.env`
- Check if the user exists in Supabase Dashboard > Authentication
- Clear browser cache and cookies

### Properties Not Showing
- Check if property is marked as "Active"
- Verify RLS policies are correctly set up
- Check browser console for errors

### Images Not Loading
- Verify image URLs are publicly accessible
- Use HTTPS URLs only
- Test the URL in a browser first

### Changes Not Reflecting
- Clear browser cache
- Check if you're logged in as admin
- Verify database connection

## Support

For issues or questions:
- Email: hrushikeshmore953@gmail.com
- Phone: +91 8669505727

## Next Steps

1. Add image upload functionality (Supabase Storage)
2. Add bulk operations
3. Add analytics dashboard
4. Add booking management
5. Add email notifications
