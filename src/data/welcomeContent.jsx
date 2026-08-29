import React from "react";

export const WELCOME_CONTENT = {
  welcome: (
    <>
      <h2 className="mt-0 mb-2 text-xl font-bold">Welcome to Pane 3.1</h2>
      <p>
        Welcome to my retro-styled
        portfolio. This is a retro tribute to the golden era of computing,
        reimagining a classic Windows 95/98 desktop environment using modern
        React technology.
      </p>
      <p>
        Pane 3.1 is more than just a list of links, it's an interactive experience.
        Here, you can browse my professional history, explore my technical
        projects, and even dive into some quirky files I've archived
        for your entertainment.
      </p>
      <p>
        Feel free to poke around, open multiple windows, and enjoy the
        pixel-perfect aesthetics. Check out the <strong>Discover</strong> section
        to learn how to navigate this system!
      </p>
    </>
  ),
  discover: (
    <>
      <h2 className="mt-0 mb-2 text-xl font-bold">System Guide</h2>
      <p>
        Navigate the desktop just like you would on a classic workstation.
        Use your mouse or touch screen with these familiar interactions:
      </p>
      <ul className="my-2 list-disc pl-4">
        <li>
          <strong>Single-click / tap</strong> an icon to select (highlights in yellow)
        </li>
        <li>
          <strong>Double-click / double-tap</strong> to open a program or folder
        </li>
        <li>
          <strong>Drag and drop</strong> icons to reorganize your workspace
        </li>
        <li>
          <strong>Drag title bars</strong> to move windows around
        </li>
        <li>
          <strong>Controls:</strong> Use <strong>×</strong> to close,
          <strong> •</strong> to maximize, and <strong>-</strong> to minimize
        </li>
        <li>
          <strong>Fullscreen:</strong> Press <strong>Esc</strong> (desktop) or
          <strong> long-press</strong> (touch) to exit fullscreen apps
        </li>
      </ul>
      <p>
        Be careful exploring the <strong>Programs</strong> folder, some legacy
        applications might still have bugs that could trigger a system error (BSOD)!
      </p>
    </>
  ),
  "contact-now": (
    <>
      <h2 className="mt-0 mb-2 text-xl font-bold">Get In Touch</h2>
      <p>
        I'm always open to new opportunities, collaborations, or even just a
        friendly chat about tech and design.
      </p>
      <ul className="my-2 list-disc pl-4">
        <li>
          <strong>Email:</strong> khoinm.business@gmail.com
        </li>
        <li>
          <strong>Message Me:</strong> Launch the "Message Me" program on the
          desktop to send a direct ping
        </li>
        <li>
          <strong>Socials:</strong> Check out <strong>Online Accounts</strong> for
          GitHub, Discord, and more
        </li>
      </ul>
      <p className="mt-2">
        Thank you for visiting my portfolio. I look forward to connecting with you!
      </p>
    </>
  ),
};

export const MENU_ITEMS = [
  { id: "welcome", label: "Welcome" },
  { id: "discover", label: "Discover" },
  { id: "contact-now", label: "Contact" },
];

