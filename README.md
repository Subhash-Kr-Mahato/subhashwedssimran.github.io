# Subhash & Simran — Wedding Invitation

A professional, elegant wedding invitation website for **subhashwedssimran.com**.

## What’s included

- **Tap-to-open cover** — When guests open your link, they see an elegant card with “Tap to open”. Tapping anywhere opens the full invitation (like Aamantran-style links).
- **Background music** — Music starts when the invitation is opened. Add your own `music.mp3` in the same folder; a mute button appears on the invitation.
- **Hero** — Your names, tagline, and date (20 April 2026)
- **Blessings** — A short quote
- **Our Story** — Editable couple story
- **Celebration** — Ceremony & reception at Village Bonashinga, Giridih, Jharkhand
- **Schedule** — Timeline (Morning: ceremony, Afternoon: reception)
- **How to Reach** — Full address + “View on Google Maps” link
- **Dress Code** — Traditional / formal note
- **Moments** — Gallery placeholder
- **RSVP** — Form (connect to Formspree or your backend)
- **Footer** — subhashwedssimran.com

## Customize your details

1. **index.html**  
   - Replace “Date & Time”, “Venue Name”, “Address, City” with your real ceremony and reception details.  
   - Update the “Our Story” paragraph if you like.  
   - Change “Kindly respond by [Your RSVP Date]” to your actual RSVP deadline.

2. **RSVP form**  
   - To collect responses, use [Formspree](https://formspree.io) (free tier):  
     - Sign up, create a form, get the form action URL.  
     - In `index.html`, change the `<form>` to:  
       `<form class="rsvp-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">`  
   - Or replace the form’s `action` with your own API/server endpoint.

3. **Gallery**  
   - Replace the empty `.gallery-item` divs with `<img>` tags pointing to your photos.

4. **Background music**  
   - Add a file named `music.mp3` in the same folder as `index.html` (e.g. a soft instrumental or wedding song). Music plays when the guest taps to open the invitation. If `music.mp3` is missing, the site still works; no music will play.

## Hosting as subhashwedssimran.com

1. **Buy the domain**  
   Register **subhashwedssimran.com** with any registrar (GoDaddy, Namecheap, Google Domains, etc.).

2. **Host the site**  
   - **Netlify** (recommended): Drag and drop the project folder to [netlify.com/drop](https://app.netlify.com/drop), or connect a Git repo. In Netlify: Domain settings → Add custom domain → subhashwedssimran.com and follow the DNS steps.  
   - **Vercel**: Import the project, then add subhashwedssimran.com in Project → Settings → Domains.  
   - **GitHub Pages**: Push the repo, enable Pages, then in your domain registrar set an A/CNAME record to GitHub’s instructions.

3. **DNS**  
   At your domain registrar, add the records your host asks for (usually A record and/or CNAME for `www`).

After DNS propagates, **subhashwedssimran.com** will show your wedding invitation.

## Run locally

Open `index.html` in a browser, or use a simple server:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000`.

---

Wishing you a beautiful wedding.
