---
title: 'Making Upwork Screen Capture Work on Wayland'
description: 'How I made Upwork screen capture work in a wlroots Wayland session.'
date: 2023-02-23
updated: 2026-08-01
banner: /images/blog/upwork-wayland-screen-capture.png
bannerAlt: 'Sky-blue light passing through a portal between two dark surfaces'
---

Upwork’s official answer to screen capture on Linux Wayland is still simple: it is unsupported. Its [Linux troubleshooting page](https://support.upwork.com/hc/en-us/articles/211064108-Troubleshoot-desktop-app-Linux) tells users with broken time-tracker screenshots to switch to Xorg.

I did not want to change my desktop session for one application. My compositor could already take screenshots, so capture itself was not the problem. Upwork expected two GNOME-shaped D-Bus services; my wlroots session did not provide them. The useful seam was between an existing caller and existing native tools.

I built [`upwork-wlroots-bridge`](https://github.com/drsh4dow/upwork-wlroots-bridge) to fill that gap. It is a small Rust process that claims the D-Bus names Upwork looks for and translates its calls into `grim`, `swaymsg`, and `swayidle` operations. It does not modify Upwork or add general Wayland support. It implements one narrow interface in my user session.

# Building the bridge

The process owns these session-bus names:

```text
org.gnome.Shell.Screenshot
org.gnome.Mutter.IdleMonitor
```

The screenshot service handles full-screen, window, and area requests, including a destination filename and a success result. For a full-screen request, the bridge runs `grim`, including the cursor when requested. An area request becomes the geometry string `grim` expects. For a window request, it asks `swaymsg -t get_tree` for Sway’s tree, finds the focused rectangle, and passes that geometry to `grim`. The public [Phosh interface documentation](https://world.pages.gitlab.gnome.org/Phosh/phosh/iface.DBusScreenshot.html) describes the screenshot calls Upwork expects.

That mapping was the whole point. Upwork already knew how to call the GNOME interfaces, while my session already had working capture commands. The project credits MarSoft's Python [`upwork-wayland`](https://github.com/MarSoft/upwork-wayland) as its inspiration; my implementation kept the compatibility idea but used Rust and the wlroots tools already on my machine. A filename, optional cursor, or rectangle goes in; a familiar local command runs; the expected reply goes back.

Idle tracking follows the same approach. The bridge runs `swayidle -w` with a one-second timeout and `timeout` and `resume` commands, then keeps the latest state and transition time in memory. The idle service returns zero after resume or elapsed milliseconds after timeout, matching the [idle counter described by Mutter](https://gnome.pages.gitlab.gnome.org/mutter/meta/class.IdleMonitor.html).

This part is less visible than the screenshot command, but Upwork needs both services. A successful image alone does not satisfy an integration that also asks how long the user has been idle. Translating that question through `swayidle` kept capture and activity observation consistent with the running compositor session. The state stays in the bridge because the D-Bus caller expects an elapsed value, while `swayidle` reports transitions. Converting one shape into the other is small, explicit work.

I deliberately did not speak the Wayland protocol inside the bridge. `grim` already knew capture, `swaymsg` already exposed the focused container tree, and `swayidle` already observed activity. Rebuilding those responsibilities would have added protocol code and state without improving the translation. It would also have coupled this compatibility shim to lower-level behavior that those programs already handled. The bridge only coordinates tools that worked on my machine, which kept its responsibility legible when a capture failed: inspect the translated command and the tool it called.

# The security tradeoff

A modern Wayland application would normally use XDG Desktop Portal and PipeWire. The [ScreenCast portal](https://flatpak.github.io/xdg-desktop-portal/docs/doc-org.freedesktop.portal.ScreenCast.html) lets the user select sources and grants access to approved streams. This bridge instead lets any process able to call these interfaces on the same session bus request a screenshot under the user’s authority. There is no caller authentication. That was acceptable for my trusted session and a specific desktop application; it would be a poor design for a general screenshot service exposed to untrusted software.

# Where support ends

The parts that affect reliance today are narrow but important. Full-screen and area capture require an environment where `grim` works. Window capture is Sway-specific because it obtains focused geometry through `swaymsg`. Idle tracking requires `swayidle`. A wlroots compositor does not automatically provide every path.

The bridge also treats a successfully launched capture process as success without checking its exit status. A missing command, rejected output path, or failed capture can therefore be reported too optimistically. If focused geometry cannot be extracted, `grim` runs without that geometry, so a window request may become a broader capture. That matters more than an ignored cosmetic option because it changes both reliability and what may appear in the image.

Upwork’s current help page still calls Wayland screenshots unsupported, and the project has no current compatibility evidence for recent Upwork releases. I would test it against the installed client before depending on it for time tracking today. It solved the mismatch I had: GNOME-shaped calls arrived, familiar wlroots tools did the work, and I could remain in my Wayland session.
