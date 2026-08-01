---
title: 'Making Upwork Screen Capture Work on Wayland'
description: 'How I built a small Rust compatibility bridge between Upwork’s GNOME D-Bus calls and wlroots screenshot and idle tools.'
date: 2023-02-23
updated: 2023-02-23
banner: /images/blog/upwork-wayland-screen-capture.png
bannerAlt: 'Sky-blue light passing through a portal between two dark surfaces'
---

Upwork’s official answer to screen capture on Linux Wayland is still brutally simple: it is not supported. Their [Linux troubleshooting page](https://support.upwork.com/hc/en-us/articles/211064108-Troubleshoot-desktop-app-Linux) tells users whose time-tracker screenshots fail to switch to Xorg.

I did not want to switch my desktop session to Xorg just to satisfy one application.

The interesting part was not “making Wayland take screenshots.” My compositor could already do that. The failure was a compatibility seam. The Upwork desktop application expected two GNOME-shaped D-Bus services. My wlroots-based session had neither of them. The native tools existed on one side, the caller’s expected interface existed on the other, and nothing translated between them.

So I built [`upwork-wlroots-bridge`](https://github.com/drsh4dow/upwork-wlroots-bridge), a small Rust process that claims those D-Bus names and translates the calls into `grim`, `swaymsg`, and `swayidle` operations.

That sentence is almost the whole architecture. It is also a better description than saying I “added Wayland support to Upwork.” I did not change Upwork, GNOME, Wayland, wlroots, or PipeWire. I implemented the narrow interface the application was looking for in my own user session.

# The seam was D-Bus, not pixels

The bridge owns two names on the session bus:

```text
org.gnome.Shell.Screenshot
org.gnome.Mutter.IdleMonitor
```

Under the first name, it serves the object path `/org/gnome/Shell/Screenshot` and implements three calls: `Screenshot`, `ScreenshotWindow`, and `ScreenshotArea`. Under the second, it serves `/org/gnome/Mutter/IdleMonitor/Core` and implements `GetIdletime`.

Those names matter because they are the contract the caller expects. The screenshot method signatures also match the GNOME interface shape: booleans for cursor or flash behavior, coordinates for area capture, a destination filename, and a `(success, filename)` result. The public [Phosh documentation for `org.gnome.Shell.Screenshot`](https://world.pages.gitlab.gnome.org/Phosh/phosh/iface.DBusScreenshot.html) shows the same screenshot, window, and area method forms. Mutter describes its idle monitor as an [idle counter similar to X’s `IDLETIME`](https://gnome.pages.gitlab.gnome.org/mutter/meta/class.IdleMonitor.html).

On a GNOME session, those services are part of the desktop’s implementation. On my setup, the names were absent. Upwork did not need a new screenshot UI. It needed something to answer those calls.

The bridge answers them with tools already native to the wlroots ecosystem.

For a full-screen request, it runs `grim`, optionally adding `-c` when the caller asks for the cursor, then passes the requested filename. For an area request, it converts the supplied rectangle to the geometry string `grim` expects. For a focused-window request, it asks `swaymsg -t get_tree` for Sway’s tree, finds the focused node’s rectangle, and gives that geometry to `grim`.

Idle time takes a similar path. The bridge starts `swayidle -w` with a one-second timeout and `timeout`/`resume` commands. It keeps the latest state and transition time in memory. `GetIdletime` returns zero after a resume, or the elapsed milliseconds after the timeout event.

This is not a generic Wayland abstraction. It is an adapter from four observed calls to three existing commands.

# Why I kept it small

The first public crate version appeared on [December 21, 2022](https://crates.io/crates/upwork-wlroots-bridge). The public history shows the project moving in short steps: initial screenshot and idle service work, package metadata and documentation, focused-window capture through `swaymsg`, warning timing changes, and an idle implementation fix on January 5, 2023. The current published version is `0.1.5`.

I was not the first person to identify the D-Bus seam. The README credits MarSoft’s [`upwork-wayland`](https://github.com/MarSoft/upwork-wayland) Python implementation as the inspiration. My implementation put the bridge in Rust and targeted the wlroots command-line tools I was using.

The smallest useful implementation did not need to speak the Wayland protocol itself. `grim` already handled screenshot capture. `swaymsg` already exposed Sway’s focused container tree. `swayidle` already observed idle and resumed activity. Reimplementing any of those responsibilities inside the bridge would have created more protocol code, more state, and more ways to be subtly wrong.

Rust’s role is mostly orchestration. `zbus` exports the D-Bus interfaces. `tokio` keeps both services alive and runs the idle observer. `async-process` launches the commands. `clap` handles two flags. There is no framework around the framework and no daemon-specific configuration language.

The bridge can run with no arguments. The optional `-D` flag prints incoming arguments and idle values. The optional `-w` flag plays the freedesktop screenshot sound with `pw-play` and displays a `zenity` warning before a capture. For a focused-window capture, it waits two seconds after that warning closes so there is time to focus the intended window.

That warning is a practical extra, not part of the compatibility contract. The application can request a screenshot without interacting with my desktop, so I wanted an option to make the event visible. I left it opt-in because a modal dialog changes timing and interrupts work. Compatibility and notification are separate decisions.

# The security boundary is deliberately different from a portal

Modern Wayland screen sharing is commonly described through XDG Desktop Portal and PipeWire. The official [ScreenCast portal](https://flatpak.github.io/xdg-desktop-portal/docs/doc-org.freedesktop.portal.ScreenCast.html) creates a session, selects sources, starts the session, and returns PipeWire streams. Its backend will typically present a chooser when `Start` runs. `OpenPipeWireRemote` gives the application a file descriptor for a PipeWire remote where only the permitted screen-cast nodes are available.

That restricted handoff is important. The portal documentation says only the screen-cast stream nodes are exposed through that remote, while PipeWire’s [portal access-control documentation](https://docs.pipewire.org/page_portal.html) describes a client beginning with minimal permissions and receiving access to permitted objects.

My bridge does none of that.

It does not create a portal session. It does not ask the user to select a monitor or window for every request. It does not produce a PipeWire stream. It does not add a new permission layer around `grim`. It exports GNOME-compatible method names on the user’s session bus and launches commands with the privileges of the user running the bridge.

That is the central tradeoff. The adapter was small precisely because it reused the authorization environment already present in my desktop session. It restored the interface expected by a trusted desktop application; it was not designed as a sandbox boundary for arbitrary clients.

The code also performs no caller authentication before serving a screenshot request. Any process able to reach that session bus and call the exported interface can ask the bridge to invoke the methods. The filename is passed as a direct process argument rather than through a shell, which avoids shell interpolation, but the caller still supplies the output path. The optional warning makes capture visible; it does not authorize it.

This distinction is why I would not present the bridge as a replacement for the portal architecture. A portal is the right seam for an application designed to use it. This bridge exists because the caller was looking for a different, desktop-specific seam.

GNOME itself has described many shell D-Bus APIs as [private interfaces intended for core components](https://gitlab.gnome.org/GNOME/gnome-shell/-/merge_requests/1970), not stable public application APIs. Implementing one outside GNOME is therefore compatibility work against an observed contract, not adoption of a cross-desktop standard.

# What it supports, and what it only appears to support

The repository description names wlroots compositors including Sway, Wayfire, Hikari, River, and Hyprland. The implementation is more specific than that list suggests.

Full-screen and area capture depend on `grim`, so they depend on a compositor environment where `grim` works. Focused-window capture is explicitly Sway-shaped: it calls `swaymsg`, reads the Sway tree, strips whitespace, searches for the focused node, and extracts its rectangle with a regular expression. That is not a portable focused-window API for every wlroots compositor.

Idle tracking similarly depends on `swayidle`. A compositor may be built on wlroots without providing the exact command environment assumed by the bridge. “wlroots” is therefore a useful family label, not a guarantee that every named compositor supports every path.

There are other sharp limits visible in the source:

- The `flash` argument is accepted but ignored.
- `ScreenshotWindow` accepts `include_frame`, but the implementation does not use it.
- If focused-window geometry cannot be extracted, the command falls back to invoking `grim` without `-g`, which means the attempted window capture can become a broader capture.
- Process success is currently based on whether the command could be executed, not whether it exited with a successful status. A spawned `grim` process that returns a non-zero exit code can still lead to `true` in the D-Bus result.
- The focused-node parser is a regular expression over transformed JSON rather than structured JSON parsing.
- The repository contains no automated tests, CI configuration, packaged service unit, or dedicated `LICENSE` file. `Cargo.toml` and the crates.io publication declare MIT, but the repository does not include the full license text.

These are not theoretical footnotes. They define where I would and would not trust the tool. The bridge is a 2022–2023 compatibility utility with a narrow public history; the latest source commit is from January 5, 2023. Upwork’s current help page still says Wayland screenshots are unsupported and recommends Xorg. Nothing in the public evidence establishes current compatibility with every Upwork desktop release, every wlroots compositor, or every Linux distribution.

It also does not establish how many people use it. Crates.io reports package downloads, but a registry download is not a user, a successful installation, or proof that a time-tracker capture worked. GitHub stars are not outcomes either.

# Compatibility code should admit what it is

I like this project because the useful idea is smaller than the ecosystem around it.

The application expected GNOME screenshot and idle services. My session offered wlroots-oriented screenshot and idle commands. The bridge copied the expected method shapes, delegated the real work to those commands, and stayed resident so the D-Bus names remained available.

It did not make screen capture universally safe. It did not standardize Wayland. It did not persuade Upwork to support the portal. It did not need to.

A compatibility bridge earns its keep when it translates one concrete contract without pretending to own either side. That is what this one does. It is also why its limitations are part of the design, not an embarrassing appendix: session-bus trust instead of portal consent, command dependencies instead of embedded protocol implementations, Sway-specific window discovery inside a broader wlroots claim, and a frozen implementation that should be inspected before anyone relies on it today.

The code is [public on GitHub](https://github.com/drsh4dow/upwork-wlroots-bridge), and the crate remains [available on crates.io](https://crates.io/crates/upwork-wlroots-bridge). Read the source before running it. In this case, reading the source is pleasantly close to reading the entire architecture.
