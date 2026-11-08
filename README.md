# Alcove (our-chat)

A private, installable (PWA) chat app: text, photos (including view-once), voice messages,
reactions, replies, pinned messages, shared countdowns/lists, scheduled messages and push
notifications. Static front-end (`index.html`) + [Supabase](https://supabase.com) back-end.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app (HTML, CSS, JS) |
| `sw.js` | Service worker: offline app shell, push notifications |
| `manifest.json` | PWA manifest (install icon, colours) |
| `vendor/supabase.js` | `@supabase/supabase-js@2.45.4` UMD build, self-hosted (falls back to jsDelivr if missing) |
| `icon*.png`, `icon.svg` | App icons (`icon-maskable-*` are for Android adaptive icons) |

## Run / deploy

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages...). It must be served over
**HTTPS** (or `localhost`) for the service worker, PIN hashing and notifications. To test locally:

```bash
npx serve .        # or: python3 -m http.server 8080
```

Deploy the whole folder, including `vendor/`. After changing any file, bump `const C='chat-v7'`
in `sw.js` so installed copies refresh.

## Back-end the app expects (inferred from the code)

Tables used: `messages` (id, created_at, sender_id, conversation_id, body, image_path, audio_path,
reply_to, view_once, viewed_at, edited_at), `reactions` (message_id, user_id, emoji),
`receipts` (message_id, delivered_at, seen_at), `pins` (message_id, created_at),
`profiles` (id, name, avatar_path), `conversations` (id, is_group, title, avatar_path),
`conversation_members` (conversation_id, user_id), `events` (id, title, event_date),
`notes` (id, list, text, done, created_at), `scheduled` (id, body, send_at, sent, conversation_id),
`push_subs` (user_id, endpoint, sub). Storage bucket: `photos` (private). RPC: `mark_viewed(mid)`.
Realtime must be enabled on the tables the app listens to.

**Important:** the Supabase key in `index.html` is a *publishable* key, which is safe only when
**Row Level Security is enabled on every table and on the `photos` bucket** and policies limit
access to conversation members. Please double-check this in the Supabase dashboard.

If you move to a different Supabase project, update the URL/key in `index.html` **and** the
`connect-src` / `img-src` / `media-src` hosts in the Content-Security-Policy `<meta>` tag.

## Security notes

* The PIN is a convenience lock for this device (PBKDF2 + random salt, attempt limit). Real
  protection is the Supabase session, so always sign out on shared devices.
* Signing out wipes drafts, the PIN and this device's push subscription.
