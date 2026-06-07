# Elsewhere by Avery Itinerary Portal

This folder is ready to deploy as a static Netlify site for:

`itineraries.elsewherebyavery.com`

## Local Routes

- `/` opens the advisor/editor view.
- `/rockin-the-rhine/` opens the public client view for Rockin' the Rhine.
- `/suncadia-anniversary/` opens the public client view for Suncadia Anniversary.
- `/cappadocia/` opens the public client view for Cappadocia.

## Deploy To Netlify

From this folder:

```bash
netlify login
netlify deploy --prod --dir .
```

If using `npx`:

```bash
npx netlify-cli login
npx netlify-cli deploy --prod --dir .
```

After deploy, Netlify will give you a site URL like:

`https://your-site-name.netlify.app`

## Connect Squarespace Subdomain

In Netlify:

1. Open the deployed site.
2. Add custom domain: `itineraries.elsewherebyavery.com`.
3. Netlify will show the DNS target for the CNAME record.

In Squarespace DNS:

1. Add a custom DNS record.
2. Type: `CNAME`
3. Host/name: `itineraries`
4. Value/points to: the Netlify target, usually `your-site-name.netlify.app`

Client URLs will then look like:

- `https://itineraries.elsewherebyavery.com/rockin-the-rhine/`
- `https://itineraries.elsewherebyavery.com/suncadia-anniversary/`
- `https://itineraries.elsewherebyavery.com/cappadocia/`
