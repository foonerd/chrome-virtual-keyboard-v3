# Chrome Virtual Keyboard V3

## Overview

Chrome Virtual Keyboard V3 is a rebuild of the Volumio maitained [chrome-virtual-keyboard](https://github.com/volumio/chrome-virtual-keyboard) extension, updated for **Manifest V3** and modern Chromium-based browsers.

This version is designed specifically for **Volumio Bookworm internal builds**, enabling a lightweight on-screen keyboard for touch-enabled devices within the Volumio UI. It is **not intended for publication on the Chrome Web Store** or general end-user distribution.

## Purpose

The extension automatically displays a virtual keyboard when a user focuses on an editable text input (such as a textbox or textarea) and hides it when the field loses focus.
It is optimized for embedded touchscreen environments and kiosk-style Volumio interfaces where no physical keyboard is present.

## Technical Notes

* **Manifest Version:** 3
* **Use Case:** Volumio Bookworm internal system builds
* **Browser Target:** Chromium-based environments
* **Not for Chrome Web Store publication**
* **No analytics, telemetry, or remote network requests**

All features have been restructured for Manifest V3 compliance, and deprecated background/page scripts have been replaced with service worker logic.

## Acknowledgment

This project is **originally based on** [xontab/chrome-virtual-keyboard](https://github.com/xontab/chrome-virtual-keyboard), created by Xontab.
All rights and credits for the original concept, design, and early implementation remain with the original author.

## License

Unless otherwise stated, this fork follows the same license terms as the original project.
Refer to the LICENSE file for details.
