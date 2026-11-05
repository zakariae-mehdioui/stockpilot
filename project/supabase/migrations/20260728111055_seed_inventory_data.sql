/*
# Seed Inventory Demo Data

## Overview
Populates products and orders with realistic sample data for the dashboard demo.
- 24 products across categories (Electronics, Apparel, Home, Sports, Beauty, Books).
- 60 orders spread over the last ~30 days with varied statuses.
*/

INSERT INTO products (name, sku, category, price, cost, stock, description, image_url, status) VALUES
('Aurora Wireless Headphones','SKU-1001','Electronics',199.99,85.00,142,'Premium noise-cancelling over-ear headphones with 40h battery life.','https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Nimbus Mechanical Keyboard','SKU-1002','Electronics',129.00,52.00,87,'Hot-swappable mechanical keyboard with RGB backlighting.','https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Pulse Smartwatch Series 5','SKU-1003','Electronics',249.00,110.00,64,'Health-tracking smartwatch with AMOLED display and GPS.','https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Vortex Bluetooth Speaker','SKU-1004','Electronics',89.99,38.00,210,'Portable waterproof speaker with 360-degree sound.','https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Zenith 4K Webcam','SKU-1005','Electronics',159.00,70.00,0,'4K UHD webcam with auto-framing and low-light correction.','https://images.pexels.com/photos/5083404/pexels-photo-5083404.jpeg?auto=compress&cs=tinysrgb&w=400','out_of_stock'),
('Helix USB-C Hub','SKU-1006','Electronics',59.99,22.00,156,'7-in-1 USB-C hub with 4K HDMI and 100W PD passthrough.','https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Orbit Wireless Charger','SKU-1007','Electronics',39.99,14.00,198,'Fast 15W Qi wireless charging pad with anti-slip surface.','https://images.pexels.com/photos/4526473/pexels-photo-4526473.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Lumen Desk Lamp Pro','SKU-1008','Electronics',79.00,30.00,73,'Adjustable LED desk lamp with wireless charging base.','https://images.pexels.com/photos/1112597/pexels-photo-1112597.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Classic Denim Jacket','SKU-2001','Apparel',89.00,34.00,120,'Timeless denim jacket made from organic cotton.','https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Merino Wool Sweater','SKU-2002','Apparel',119.00,48.00,56,'Soft merino wool sweater in heather grey.','https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Trail Running Shoes','SKU-2003','Apparel',139.99,55.00,94,'Lightweight trail runners with grippy all-terrain outsole.','https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Canvas Tote Bag','SKU-2004','Apparel',29.99,9.00,0,'Heavyweight canvas tote with reinforced straps.','https://images.pexels.com/photos/5704720/pexels-photo-5704720.jpeg?auto=compress&cs=tinysrgb&w=400','discontinued'),
('Aurora Ceramic Mug Set','SKU-3001','Home',34.99,12.00,180,'Set of 4 hand-glazed ceramic mugs, 12oz each.','https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Linen Bedding Set Queen','SKU-3002','Home',189.00,82.00,41,'Pre-washed French linen duvet cover and pillowcase set.','https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Soy Candle Trio','SKU-3003','Home',44.00,16.00,167,'Three soy-blend candles in cedar, eucalyptus, and vanilla.','https://images.pexels.com/photos/3270223/pexels-photo-3270223.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Cast Iron Skillet 10in','SKU-3004','Home',54.99,21.00,88,'Pre-seasoned cast iron skillet, oven and grill safe.','https://images.pexels.com/photos/4226806/pexels-photo-4226806.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Bamboo Cutlery Travel Set','SKU-3005','Home',19.99,6.50,0,'Reusable bamboo utensil set with cotton pouch.','https://images.pexels.com/photos/4207791/pexels-photo-4207791.jpeg?auto=compress&cs=tinysrgb&w=400','out_of_stock'),
('Pro Yoga Mat','SKU-4001','Sports',69.00,24.00,134,'6mm cushioned yoga mat with non-slip texture.','https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Adjustable Dumbbell Pair','SKU-4002','Sports',299.00,140.00,28,'Space-saving adjustable dumbbells, 5-52.5 lbs each.','https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Insulated Water Bottle 32oz','SKU-4003','Sports',32.99,11.00,212,'Vacuum-insulated stainless bottle keeps cold 24h.','https://images.pexels.com/photos/1188649/pexels-photo-1188649.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Resistance Band Kit','SKU-4004','Sports',24.99,8.00,0,'5-band set with door anchor and handles.','https://images.pexels.com/photos/4498293/pexels-photo-4498293.jpeg?auto=compress&cs=tinysrgb&w=400','discontinued'),
('Vitamin C Serum','SKU-5001','Beauty',48.00,16.00,153,'Brightening vitamin C serum with hyaluronic acid.','https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400','active'),
('Bamboo Hair Brush','SKU-5002','Beauty',18.99,5.50,0,'Eco-friendly bamboo paddle brush for all hair types.','https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400','out_of_stock'),
('The Art of Strategy','SKU-6001','Books',24.95,7.00,0,'Hardcover business strategy bestseller.','https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400','discontinued');

INSERT INTO orders (order_number, customer_name, customer_email, status, total, items_count, created_at)
SELECT
  'ORD-' || lpad(g::text, 5, '0'),
  (ARRAY['Emma Thompson','Liam Garcia','Olivia Chen','Noah Patel','Sophia Martinez','James Wilson','Ava Rodriguez','Mason Lee','Isabella Nguyen','Ethan Brown','Mia Davis','Lucas Anderson','Charlotte Taylor','Aiden Thomas','Amelia Jackson','Elijah White','Harper Harris','Benjamin Clark','Evelyn Lewis','Daniel Walker','Abigail Young','Henry Hall','Emily King','Sebastian Wright','Madison Scott','Jackson Green','Avery Adams','Sofia Baker','Carter Nelson','Layla Hill'])[1 + (random() * 29)::int],
  'customer' || g || '@example.com',
  (ARRAY['pending','processing','shipped','delivered','cancelled'])[1 + floor(random() * 5)::int],
  round((random() * 950 + 25)::numeric, 2),
  (random() * 8 + 1)::int,
  now() - (random() * 30 || ' days')::interval - (random() * 23 || ' hours')::interval
FROM generate_series(1, 60) g;
