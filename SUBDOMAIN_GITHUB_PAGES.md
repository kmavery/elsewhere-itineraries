# Itinerary Subdomain Setup

This folder is built for:

`https://itineraries.elsewherebyavery.com`

## Final URLs

- `https://itineraries.elsewherebyavery.com/`
- `https://itineraries.elsewherebyavery.com/rockin-the-rhine/`
- `https://itineraries.elsewherebyavery.com/suncadia-anniversary/`
- `https://itineraries.elsewherebyavery.com/cappadocia/`

## Recommended GitHub Pages Setup

Create a separate GitHub repository for the itinerary portal, for example:

`elsewhere-itineraries`

Upload every file in this folder to that repository root.

In GitHub:

1. Open the repository.
2. Go to `Settings -> Pages`.
3. Publish from the `main` branch and `/root`.
4. Set the custom domain to:

   `itineraries.elsewherebyavery.com`

This package already includes a `CNAME` file with that domain.

## Squarespace DNS Record

In Squarespace custom DNS records, add:

| Type | Name | Data |
| --- | --- | --- |
| CNAME | itineraries | kmavery.github.io |

Leave your existing `www` and apex records in place.

## Notes

GitHub's docs say custom subdomains for GitHub Pages are configured with a DNS `CNAME` record. Do not point the subdomain to the apex domain; point it to the GitHub Pages default domain instead.
