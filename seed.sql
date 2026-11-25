-- Seed: categories from the business brief. No products are inserted; product data must come from the owner.
insert into categories (slug, name, sort_order) values
 ('earbuds-bluetooth','Earbuds & Bluetooth Devices',1),
 ('headphones-neckbands','Headphones & Neckbands',2),
 ('chargers-adapters','Chargers & Adapters',3),
 ('usb-cables','USB & Charging Cables',4),
 ('memory-cards','Memory Cards & Storage',5),
 ('mobile-stands','Mobile Stands & Holders',6),
 ('mobile-covers','Mobile Covers',7),
 ('tempered-glass','Tempered Glass',8),
 ('power-banks','Power Banks',9),
 ('other','Other Accessories',10)
on conflict (slug) do nothing;

insert into business_settings (id, business_name, phone, whatsapp, email, address)
values (1, 'Maa Budhi Thakurani Enterprises', '7978137724', '917978137724', 'swadhinkumarsahu1328960@gmail.com', 'Brahmapur, Odisha, India')
on conflict (id) do nothing;
