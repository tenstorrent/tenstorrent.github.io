/* Tenstorrent docs — inline Ask AI chat, powered by the Kapa SDK.
 *
 * Bundled (React + react-dom + @kapaai/react-sdk + marked + DOMPurify) into a
 * single self-contained IIFE so there is exactly ONE React instance — this is
 * what fixes the "useContext of null" dual-instance error you hit when loading
 * the SDK off a CDN with an importmap.
 *
 * Exposes window.ttKapaChat.mount(el, integrationId). Once mounted, the chat
 * component wires window.ttKapaSubmit(query) / window.ttKapaReset() so the
 * vanilla tt-search.js can drive it. */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { KapaProvider, useChat } from "@kapaai/react-sdk";
import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ breaks: true, gfm: true });

const SVG_COPY =
  '<svg width="15" height="15" viewBox="0 0 20 20" fill="none">' +
  '<rect x="7" y="7" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5"/>' +
  '<path d="M13 7V5.5A1.5 1.5 0 0 0 11.5 4h-7A1.5 1.5 0 0 0 3 5.5v7A1.5 1.5 0 0 0 4.5 14H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
  "</svg>";

const SVG_DONE =
  '<svg width="15" height="15" viewBox="0 0 20 20" fill="none">' +
  '<path d="M4 10l4 4 8-8" stroke="#1e86a9" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
  "</svg>";

const SVG_CODE =
  '<svg width="14" height="14" viewBox="0 0 20 20" fill="none">' +
  '<path d="M7.5 6.5 4 10l3.5 3.5M12.5 6.5 16 10l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
  "</svg>";

// Pretty-print a marked language class (e.g. "language-cpp" → "C++").
const LANG_LABELS = {
  js: "JavaScript", jsx: "JavaScript", ts: "TypeScript", tsx: "TypeScript",
  py: "Python", python: "Python", sh: "Shell", bash: "Bash", zsh: "Shell",
  shell: "Shell", console: "Shell", cpp: "C++", "c++": "C++", c: "C",
  cmake: "CMake", json: "JSON", yaml: "YAML", yml: "YAML", toml: "TOML",
  html: "HTML", css: "CSS", rust: "Rust", go: "Go", mlir: "MLIR",
  text: "Text", plaintext: "Text", md: "Markdown", diff: "Diff",
  dockerfile: "Dockerfile", makefile: "Makefile",
};

function langLabel(code) {
  const cls = (code && code.className) || "";
  const m = cls.match(/language-([\w+#-]+)/i);
  if (!m) return "Code";
  const key = m[1].toLowerCase();
  if (LANG_LABELS[key]) return LANG_LABELS[key];
  return m[1].charAt(0).toUpperCase() + m[1].slice(1);
}

// Wrap each <pre> in a ChatGPT-style card: header (lang label + copy) + body.
function enhanceCodeBlocks(container) {
  if (!container) return;
  container.querySelectorAll("pre").forEach((pre) => {
    if (pre.parentElement && pre.parentElement.classList.contains("tt-chat-code")) return;

    const code = pre.querySelector("code");

    const card = document.createElement("div");
    card.className = "tt-chat-code";

    const head = document.createElement("div");
    head.className = "tt-chat-code-head";

    const lang = document.createElement("span");
    lang.className = "tt-chat-code-lang";
    lang.innerHTML = SVG_CODE + "<span>" + langLabel(code) + "</span>";

    const btn = document.createElement("button");
    btn.className = "tt-chat-copy-btn";
    btn.title = "Copy code";
    btn.innerHTML = SVG_COPY;
    btn.addEventListener("click", function () {
      const text = code ? code.textContent : pre.textContent;
      navigator.clipboard && navigator.clipboard.writeText(text);
      btn.innerHTML = SVG_DONE;
      setTimeout(function () { btn.innerHTML = SVG_COPY; }, 1500);
    });

    head.appendChild(lang);
    head.appendChild(btn);

    pre.parentNode.insertBefore(card, pre);
    card.appendChild(head);
    card.appendChild(pre);
  });
}

function renderMarkdown(md) {
  return DOMPurify.sanitize(marked.parse(md || "", { async: false }));
}

function Sources({ sources }) {
  if (!sources || !sources.length) return null;
  const seen = new Map();
  for (const s of sources) {
    const url = s && (s.source_url || s.url);
    if (url && !seen.has(url)) seen.set(url, (s && s.title) || url);
  }
  if (!seen.size) return null;
  const items = [];
  let i = 0;
  for (const [url, title] of seen) {
    if (i++ >= 5) break;
    items.push(
      React.createElement(
        "a",
        { key: url, href: url, target: "_blank", rel: "noopener", className: "tt-chat-source" },
        title
      )
    );
  }
  return React.createElement("div", { className: "tt-chat-sources" }, items);
}

function Turn({ qa }) {
  const streaming = qa.status === "streaming";
  const hasAnswer = qa.answer && qa.answer.length > 0;
  const answerRef = useRef(null);

  // Turn raw <pre> blocks into ChatGPT-style code cards after each render.
  useEffect(() => {
    if (answerRef.current) enhanceCodeBlocks(answerRef.current);
  });

  let answerNode;
  if (hasAnswer) {
    answerNode = React.createElement("div", {
      ref: answerRef,
      className: "tt-chat-a tt-chat-md",
      dangerouslySetInnerHTML: { __html: renderMarkdown(qa.answer) },
    });
  } else {
    answerNode = React.createElement(
      "div",
      { className: "tt-chat-a tt-chat-a--loading" },
      React.createElement(
        "span",
        { className: "tt-chat-dots" },
        React.createElement("span"),
        React.createElement("span"),
        React.createElement("span")
      )
    );
  }
  return React.createElement(
    "div",
    { className: "tt-chat-turn" },
    React.createElement("div", { className: "tt-chat-q" }, qa.question),
    answerNode,
    !streaming ? React.createElement(Sources, { sources: qa.sources }) : null
  );
}

// Wait until reCAPTCHA Enterprise is loaded and ready before invoking `cb`.
//
// The Kapa SDK runs grecaptcha.enterprise.execute() inside submitQuery for bot
// protection. If a user opens the docs and clicks "Ask AI" instantly — before
// the reCAPTCHA script has finished loading — that execute() throws and the
// answer comes back as an error (which is why it "fixed itself" on retry once
// the script had loaded). Gating the submit on readiness turns that race into a
// brief loading state instead of an error.
function onCaptchaReady(cb) {
  let fired = false;
  const fire = () => { if (!fired) { fired = true; cb(); } };
  const start = Date.now();
  (function poll() {
    const g = window.grecaptcha && window.grecaptcha.enterprise;
    if (g && typeof g.ready === "function") {
      try { g.ready(fire); } catch (e) { fire(); }
      // ready() can fail to call back if misconfigured/blocked — submit anyway
      // after a short grace period rather than hanging forever.
      setTimeout(fire, 5000);
      return;
    }
    // Script not on the page yet; keep polling, but don't wait indefinitely.
    if (Date.now() - start > 8000) { fire(); return; }
    setTimeout(poll, 150);
  })();
}

function Chat() {
  const { conversation, submitQuery, resetConversation, error, isPreparingAnswer } = useChat();
  const rootRef = useRef(null);
  // Whether the view is pinned to the bottom. Starts true; flips to false the
  // moment the user scrolls up to read, so streaming doesn't yank them back.
  const stickRef = useRef(true);
  const rafRef = useRef(0);
  // Question awaiting reCAPTCHA readiness — rendered as a loading turn so an
  // instant first click shows progress instead of an error.
  const [pendingQ, setPendingQ] = useState(null);

  // The element that actually scrolls is the modal body (.tt-search-body); our
  // chat renders into it without an inner scroller.
  const scrollEl = () => {
    const root = rootRef.current;
    return root ? root.closest(".tt-search-body") || root.parentElement : null;
  };

  const gatedSubmit = useCallback((q) => {
    if (!q) return;
    setPendingQ(q);
    onCaptchaReady(() => {
      setPendingQ(null);
      submitQuery(q);
    });
  }, [submitQuery]);

  useEffect(() => {
    window.ttKapaSubmit = gatedSubmit;
    window.ttKapaReset = () => { setPendingQ(null); resetConversation(); };
    if (window.__ttKapaPending) {
      const q = window.__ttKapaPending;
      window.__ttKapaPending = null;
      gatedSubmit(q);
    }
    return () => { window.ttKapaSubmit = null; window.ttKapaReset = null; };
  }, [gatedSubmit, resetConversation]);

  // Track stick-to-bottom intent from the user's own scrolling.
  useEffect(() => {
    const el = scrollEl();
    if (!el) return;
    const onScroll = () => {
      stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Follow the stream. Tokens arrive many times per second; a smooth
  // scrollIntoView per token stacks a fresh animation each time and is what
  // caused the lag. Instead scroll instantly, coalesced to one write per
  // animation frame, and only while pinned to the bottom.
  //
  // Runs after every render (no deps) so it follows the streaming answer text,
  // not just new turns. Coalesce by skipping when a frame is already pending —
  // do NOT cancel it, or back-to-back tokens keep cancelling the pending frame
  // and the view only catches up once the stream pauses.
  useEffect(() => {
    if (!stickRef.current || rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const el = scrollEl();
      if (el) el.scrollTop = el.scrollHeight;
    });
  });

  const turns = conversation.map((qa, i) =>
    React.createElement(Turn, { key: qa.id || "t" + i, qa })
  );

  // A question waiting on reCAPTCHA: show it as a turn with the loading dots,
  // so the user sees their question land immediately rather than an error.
  const pendingTurn = pendingQ
    ? React.createElement(Turn, {
        key: "pending",
        qa: { question: pendingQ, answer: "", status: "streaming" },
      })
    : null;

  const preparing =
    isPreparingAnswer && conversation.length === 0
      ? React.createElement(
          "div",
          { className: "tt-chat-a tt-chat-a--loading" },
          React.createElement(
            "span",
            { className: "tt-chat-dots" },
            React.createElement("span"),
            React.createElement("span"),
            React.createElement("span")
          )
        )
      : null;

  const errNode = error
    ? React.createElement("div", { className: "tt-chat-error" }, error)
    : null;

  return React.createElement(
    "div",
    { className: "tt-chat-messages", ref: rootRef },
    turns,
    pendingTurn,
    preparing,
    errNode
  );
}

function mount(target, integrationId) {
  const el = typeof target === "string" ? document.getElementById(target) : target;
  if (!el) { console.error("[tt-kapa-chat] mount target not found:", target); return; }
  if (el.__ttKapaMounted) return;
  el.__ttKapaMounted = true;
  const root = createRoot(el);
  root.render(
    React.createElement(
      KapaProvider,
      { integrationId, callbacks: {} },
      React.createElement(Chat)
    )
  );
}

window.ttKapaChat = { mount };
