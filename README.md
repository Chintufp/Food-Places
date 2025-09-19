# Food Places

A lightweight tool for creating NFC tag landing pages tailored to restaurants, featuring reviews and social media.

## Features

- Generate landing pages for NFC tags
- Add restaurant details and Google Place IDs
- One-click access to reviews and social media
- Easy editing via admin dashboard
- Gives details on nearby restaurants using the **Google Places API**

## How to Use

1. **Log in** to your account. You’ll be redirected to the **Admin Dashboard**.
2. Click the **➕ button** to add a new item.
3. Fill in the details:

   - **Reseller Name** – the person receiving the NFC tag
   - **Reseller Phone Number** – contact number of the reseller
   - **NFC Tag ID** – the unique ID of the NFC tag (used for identification)
   - **Place ID** – the Google Place ID of the restaurant _(important for the review button, make sure there are no typos)_
   - **Social Links** – optionally add links to Facebook, Instagram, YouTube, TikTok, and more. Click the **green ➕ button** to add multiple socials.

4. **Editing Information**:
   - Click the **✏️ pencil icon** to quickly edit basic details.
   - Click the **ℹ️ info icon** to edit the full set of details.

⚠️ **Note:** The **ID and link cannot be changed** once created.

5. On the home page you can also get restaurants nearby you and their rating

## Tech Stack

- Frontend: Bootsrap + JS
- Backend: Node.js + Express
- Database: MongoDB

## Installation

1. Clone the repository `git clone https://github.com/yourusername/food-places.git
cd food-places`
2. Install dependencies `npm install`
3. Create a .env file in server folder  
   **Structure:**

   ```
   PORT=
   DBUSERNAME=
   PASSWORD=
   DATABASE=
   DB_PORT=
   HOST=
   SECRET_API_KEY=
   GOOGLE_API_KEY=
   SESSION_SECRET_KEY=
   URL=
   ```

4. Run the server using `node server/server.js`
