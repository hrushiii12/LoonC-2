# LoonCamp Admin Panel - Quick Start Guide

## What You've Got

A complete admin panel system for managing your LoonCamp properties:

- Secure login at `/admin`
- Dashboard to view all properties
- Add/Edit/Delete properties
- Enable/Disable properties (show/hide from website)
- Manage images, amenities, and all property details
- Database-backed with Supabase

## 5-Minute Setup

### 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Sign up for free
3. Create a new project
4. Choose a strong password
5. Wait 2 minutes for database setup

### 2. Get Your Credentials

1. In Supabase Dashboard, go to **Settings** > **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 3. Configure Your App

1. Open your project folder
2. Create a file named `.env` (copy from `.env.example`)
3. Paste your credentials:
   ```env
   VITE_SUPABASE_URL=your-project-url-here
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Create Admin User

1. In Supabase Dashboard, go to **Authentication** > **Users**
2. Click **Add User** > **Create new user**
3. Enter your email and password
4. Click **Create user**

### 5. Start Your App

```bash
npm install
npm run dev
```

Open [http://localhost:5000/admin](http://localhost:5000/admin)

## First Login

1. Go to `http://localhost:5000/admin`
2. Enter your admin email and password
3. You'll see the admin dashboard

## Adding Your First Property

1. Click **Add New Property**
2. Fill in the form:
   - **Title**: e.g., "Luxury Lakeside Dome"
   - **Category**: Choose camping/cottage/villa
   - **Location**: e.g., "Pawna Lake"
   - **Price**: e.g., 2999
   - **Price Note**: e.g., "per person with meal"
   - **Description**: Write 2-3 sentences
   - **Capacity**: Number of guests

3. Add images:
   - Paste image URL
   - Click "Add"
   - Repeat for more images

4. Add amenities (one by one):
   - Type amenity name
   - Click "Add"
   - Examples: "Private Pool", "WiFi", "AC"

5. Add highlights:
   - Unique selling points
   - Examples: "Lake view", "Private balcony"

6. Add activities:
   - Things guests can do
   - Examples: "Boating", "Bonfire", "Swimming"

7. Add policies (optional):
   - Cancellation rules
   - Check-in rules

8. Toggle options:
   - **Top Selling**: Mark if it's a featured property
   - **Active**: Turn on to publish immediately

9. Click **Create Property**

## Managing Properties

### Edit a Property
- Click the edit icon on any property
- Modify fields
- Click "Update Property"

### Enable/Disable Property
- Use the toggle switch on each property card
- Disabled = hidden from public website
- Enabled = visible on website

### Delete a Property
- Click the delete icon
- Confirm deletion
- Property and images are permanently removed

## Where Properties Appear

Once you add properties:
- **Home Page**: All active properties show up automatically
- **Categories**: Grouped by camping/cottage/villa
- **Property Details**: Click any property to see full details
- **Search Results**: Properties are searchable

## Image URLs

You can use images from:
1. **Pexels.com** - Free stock photos
2. **Unsplash.com** - Free high-quality images
3. **Your own hosting** - Upload to Cloudinary, imgbb, etc.

Just copy the direct image URL and paste it in the admin panel.

## Common Tasks

### Make a Property Featured
1. Edit the property
2. Toggle "Top Selling" ON
3. Update property
4. It will show a "Top Selling" badge

### Change Property Price
1. Edit the property
2. Update the "Price" field
3. Update property
4. New price appears immediately

### Add More Images
1. Edit the property
2. Scroll to Images section
3. Add new image URLs
4. Update property

### Hide Property Temporarily
1. Toggle the "Active" switch OFF
2. Property hidden from public
3. Toggle back ON to re-enable

## Tips

1. **Write Good Descriptions**: 100-200 words, highlight unique features
2. **Use Quality Images**: First image is the main preview
3. **Accurate Pricing**: Include what's covered in the price
4. **Complete Details**: Fill all fields for better booking rates
5. **Regular Updates**: Keep information current

## Troubleshooting

### Can't Login
- Check your .env file has correct Supabase credentials
- Verify admin user exists in Supabase Dashboard
- Clear browser cache

### Properties Not Showing
- Make sure property is toggled "Active"
- Check if images URLs are valid
- Refresh the page

### Changes Not Saving
- Check browser console for errors
- Verify internet connection
- Check Supabase project is running

## Next Steps

1. Add all your existing properties
2. Test the public website
3. Share the website URL with customers
4. Monitor bookings through WhatsApp

## Need Help?

- Read `ADMIN_SETUP.md` for detailed documentation
- Check `MIGRATION_GUIDE.md` to migrate existing data
- Email: hrushikeshmore953@gmail.com
- Phone: +91 8669505727

## Important Notes

- Keep your admin credentials secure
- Don't share your Supabase keys publicly
- Regular backup your data from Supabase
- Test changes on staging before production

Happy managing!
