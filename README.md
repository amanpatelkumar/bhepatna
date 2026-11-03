# Bombay Hardware & Electricals – website (GitHub Pages)

## Admin address
The admin is at **https://YOURNAME.github.io/bhepatna/manage-x7k2q9/**
Keep this address private. No page on the website links to it, and search engines are told to skip it.
This is only hiding, not security: the security is the password and the encrypted GitHub token.

## 1. Put the site on GitHub
1. Create a public repository, e.g. `bhepatna`.
2. Upload every file from the zip (GitHub Desktop: File → Add local repository → Publish). `index.html` must be at the top level.
3. Settings → Pages → Deploy from a branch → `main`, folder `/ (root)` → Save.
4. If an older version had an `admin` folder, delete it on GitHub and commit. Then the old address stops working.

## 2. GitHub access token (once)
Settings → Developer settings → Fine-grained tokens → Generate. Only select `bhepatna`. Repository permissions → Contents → Read and write.

## 3. Admin setup (once, right after publishing)
Open the admin address. Enter `owner/bhepatna`, the token and a password of at least 12 characters.

## 4. Forgot password (optional, needs a free EmailJS account)
1. Sign up at emailjs.com. Add an **Email Service** whose recipient is the admin email address. Add a **Template** that uses `{{otp}}`, `{{shop}}` and `{{time}}`.
2. Open `manage-x7k2q9/mail.json` on GitHub (pencil icon → edit). Paste the Service ID, Template ID and Public Key. Commit.
3. The admin email address is kept only in EmailJS, never in this repository.
4. On the admin login page, press **Forgot password?**, then **Send code**. Enter the code from the email, then a new GitHub token and new password. Delete the old token on GitHub afterwards.

## Daily use
Log in, edit products, press **Publish**. The site updates within about a minute.

## Developers
`node build.mjs` regenerates the static pages. `hostinger/` holds the PHP admin for later use on Hostinger (not used on GitHub).

## Customer orders (Google Sheet)
Each order from the cart is saved to a Google Sheet, then sent to WhatsApp with an order reference (for example BHE260301-AB12).
1. Create a Google Sheet. Extensions → Apps Script. Paste `apps-script/Code.gs`.
2. Project Settings → Script properties → add `ADMIN_KEY` with a long random text (keep it secret).
3. Deploy → New deployment → Web app → Execute as: Me; Who has access: Anyone → Deploy. Copy the Web app URL.
4. Admin → ⚙ Settings → Orders web address = that URL; Orders key = the same ADMIN_KEY; Admin password = yours. Apply.
5. Admin → Orders shows every order. Change its status, search, or export to CSV.

## Order checks (flags)
Each order is checked for an unusual name or phone number (for example "asdf", "xyz", "test", "1234567890", "0000000000", a name with numbers). Flagged orders are still sent and saved, but the Orders screen shows "⚠ Check" with the reason. The same checks run again in the Google Sheet script, so an order sent without the website is flagged too. In Orders you can also mark any order "Irrelevant" by hand, clear the mark, and filter by flags.
If you update the orders script, re-paste `apps-script/Code.gs` (it now includes the Flags and Admin flag columns; the header row updates itself).

## Admin layout and order alerts
The admin opens on **Orders**. Use the **Products** tab for the catalogue (prices, stock, photos, positions, brands).
Turn on **Order alerts** once (the browser will ask permission). While the admin page is open it checks for new orders every 45 seconds: it plays a sound, shows a red banner, updates the tab title, and shows a browser notification.
Alerts work while the admin page is open. Alerts when the browser is fully closed need a push service (for example OneSignal), which is not set up.

## Admin tools (v19)
- **Photos:** tap a card's picture to add or change it. The "No photo" filter lists products still needing a picture.
- **Brands:** Brands → "All in stock" / "All out of stock" for a whole brand.
- **Revert:** in a product's editor, "Revert changes" undoes unpublished edits to that product.
- **Keys:** `/` search, `o` Orders, `p` Products, `n` add product.
- **Filters** are remembered after a reload.
- **Bulk price:** choose "Round to ₹5 / ₹10" before applying a percentage.
- **Publish** lists exactly what changed (prices, stock, visibility, and so on).
- **Orders:** Payment (Not paid / Paid / Pay on delivery), Call and WhatsApp links, and Print slip. Re-paste `apps-script/Code.gs` so the Payment column is saved.
- **Backup:** ⚙ Settings → Download backup (products and settings, no passwords or tokens).
- **Security:** after 5 wrong passwords the login pauses for 1 minute. The admin locks after 15 minutes without use (it reloads, and unpublished changes keep it open).

## A4 tax invoice (print bill)
Orders → 🧾 Print bill (A4) prints a Tax Invoice in your format: shop details, bill-to, items with HSN, GST split (CGST/SGST), amount in words, payment mode and signature.
Set these once in ⚙ Settings → Invoice details: shop email, shop GSTIN, state, GST rate (default 18%) and the HSN/SAC code (default 8536).
Prices are treated as GST-inclusive. To add your shop logo to the bill, place a file named `logo.jpg` in `assets/img/` and extend the header in the invoice template.

## HSN codes per category
Each category has its HSN/SAC code in `data/sections.json` (field `hsn`), and the bill fills it in for every item automatically from that item's category:
fans 8414 · air coolers 8414 · mixers 8509 · induction 8516 · irons 8516 · geysers 8516 · wires 8544 · LED 8539 · switches 8536.
These are standard classifications, not a live lookup. Ask your accountant to confirm them, and to check the GST rate for each category. Items not found in the catalogue use the default HSN in Settings.

## Home page and shop logo (v22)
- **Shop logo:** ⚙ Settings → Shop logo. It shows in the website header and on the bill.
- **Brand logos:** Brands → Logo on any brand. Shows on the home brand row and the Brands page.
- **Promo banner:** ⚙ Settings → Promo banner. Switch it on, then add a title, text and button link.
- **Google rating:** ⚙ Settings → Google reviews. Adds "★ 4.5 on Google · Read reviews" under the showroom section.
- **Home search:** a large search box in the hero with popular picks (Fan, Cooler, Geyser, LED, Wire, Switch).
- **Categories:** tiles show "from ₹price" and are hidden when a category has no visible products.
- **Visit status:** "Open now – visit us today" or "Closed now" shown on the home page.
- **Policies:** Refund and return policy and Privacy policy pages, linked from the footer. They are drafts: the owner must review them before publishing.
- **Checkout:** a note under the order button explains there is no online payment.
