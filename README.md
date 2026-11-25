# Maa Budhi Thakurani Enterprises

Website for Maa Budhi Thakurani Enterprises, Brahmapur, Odisha. Wholesale and retail mobile accessories, with all India delivery.

## Folders
- `storefront/` : Public website (one HTML file). Open `index.html` in a browser, or host it on any static hosting service.
- `admin/` : Admin panel (React, TypeScript, Vite, Supabase Auth). Phase 1.
- `supabase/` : Database migrations (schema and Row Level Security) and seed data. Phase 1.

## Status
- Storefront: working. Products, prices and photos are shown as confirmed so far. Enquiries are sent through WhatsApp; they are not saved to a database yet.
- Admin and database: code written, not yet connected to a live Supabase project or tested.

## Pending before go-live
- Delivery charges by state or PIN code
- GST rate
- MOQ for each product
- Policy text approved by the owner
- Final tagline, email confirmation, and social media links (only if supplied)
- Owner's own product photos to replace marketplace or AI-generated images

## Setup
See `admin/README.md` and the SQL order in `supabase/migrations/`.

## Security
Never commit `.env` or `.env.local` files, or any service-role key. Only the public anon key goes in the admin app's environment variables.
