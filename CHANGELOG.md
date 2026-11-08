# Changes in this version

## Fixed (bugs)
- Edits, deletions and removed reactions made while the app was in the background are now synced on return (before, they were missed until a full reload).
- Your own messages/photos/voice notes show up immediately even if the realtime connection dropped.
- Photos that expired after 1 hour (signed URLs) are re-signed automatically; broken images retry once.
- Transparent PNGs no longer turn black when sent.
- "Save" in the photo viewer now really downloads the photo.
- Chat export no longer stops silently at 1000 messages.
- Reactions/receipts are loaded only for the loaded messages (previously capped at 1000 rows, so ticks could be wrong in long chats).
- The app no longer jumps to the bottom every time you return to it while reading old messages.
- Link detection no longer swallows trailing `.`, `,`, `)` or quotes.
- A blank screen when the session check fails offline.
- Login errors: wrong password vs. offline vs. empty form are now told apart.

## Security / privacy
- PIN: random salt + PBKDF2 (150k rounds) instead of unsalted SHA-256; 5 wrong tries -> timed lockout; old PINs upgrade automatically.
- PIN is set with a confirmation step (a typo can no longer lock you out) and there is "Forgot PIN? Sign out".
- Sign out only signs out this device (`scope: local`), clears drafts/last chat/PIN, and removes this device's push subscription (previously a signed-out device kept receiving notifications).
- Session expiry / sign-out from elsewhere now returns to the login screen.
- Content-Security-Policy added; Supabase library self-hosted (no third-party script needed at runtime).

## Features / UX
- "Load older messages" (history beyond the newest 500).
- Notifications can be turned off from settings (shows On/Off).
- Offline banner; non-blocking toasts instead of `alert()` pop-ups; confirm before deleting countdowns / scheduled messages.
- Offline app shell (service worker caches the app + library; no more caching of error responses).
- Android: PNG notification icon, maskable install icon; richer manifest.
- Accessibility: labels on inputs, roles on dialogs/tabs, keyboard access to messages, focus outlines.
- Performance: signed URLs are requested in batches, `will-change` only while swiping.
