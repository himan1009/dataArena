# Data Arena - Community Integration (Current Implementation)

## Overview

The **Community** section allows users to join the official **Data Arena WhatsApp Community** directly from the website. The integration is designed to work seamlessly on both desktop and mobile devices.

---

# Community Invite Link

Store the WhatsApp Community invite link in an environment variable.

```env
NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL=https://chat.whatsapp.com/Erxv6iWzWZt078kEW2vOg9
```

---

# Community Button

All **Join Community** buttons across the platform should redirect to the official WhatsApp Community invite.

### React / Next.js

```tsx
const COMMUNITY_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL;

<a
  href={COMMUNITY_URL}
  target="_blank"
  rel="noopener noreferrer"
>
  Join Community
</a>
```

---

# Community Button Placement

Display the **Join Community** button in the following locations:

- Navigation Bar
- Hero Section
- Footer
- User Dashboard
- End of Articles
- End of Interview Experience pages

Every button should redirect to the same WhatsApp Community invite link.

---

# User Flow

```text
User visits Data Arena
        │
        ▼
Clicks "Join Community"
        │
        ▼
Redirected to
https://chat.whatsapp.com/Erxv6iWzWZt078kEW2vOg9
        │
        ▼
Mobile Device
→ Opens WhatsApp Application

Desktop
→ Opens WhatsApp Web
        │
        ▼
User clicks "Join Community"
        │
        ▼
User becomes a member of the
Data Arena WhatsApp Community
```

---

# Mobile Behaviour

- Opens the WhatsApp application directly.
- If WhatsApp is not installed, the invite link is opened through the browser.

No additional implementation is required.

---

# Desktop Behaviour

- Opens WhatsApp Web.
- If the user is already logged in, they can join immediately.
- Otherwise, WhatsApp prompts the user to log in before joining.

---

# Implementation Notes

- Use the official WhatsApp Community invite link.
- Open the invite in a new browser tab.
- Read the invite URL from the environment variable instead of hardcoding it.
- Use the same invite link across the entire application.

---

# Environment Variable

```env
NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL=https://chat.whatsapp.com/Erxv6iWzWZt078kEW2vOg9
```

---

# Direct Community Invite URL

```text
https://chat.whatsapp.com/Erxv6iWzWZt078kEW2vOg9
```

This invite link is compatible with:

- Android
- iPhone
- Desktop Browsers
- WhatsApp Web