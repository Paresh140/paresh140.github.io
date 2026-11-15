// Shared by the server layout and the client switch, so it has no 'use client'.
export const MODE_KEY = 'ps-mode';

// Runs before hydration (inlined in app/layout.tsx), so a returning visitor in
// Train mode never sees a flash of the light theme.
export const MODE_BOOT = `try{var m=localStorage.getItem('${MODE_KEY}');document.documentElement.dataset.mode=m==='train'?'train':'wake'}catch(e){document.documentElement.dataset.mode='wake'}`;
