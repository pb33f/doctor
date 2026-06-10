const contentCodeBlockSelector = '.pp-content-page-markdown pre';
const copyReadyAttr = 'data-pp-copy-ready';

function setCopyLabel(copy: HTMLElement, value: string) {
  copy.setAttribute('aria-label', value);
  copy.setAttribute('label', value);
  copy.setAttribute('title', value);
}

function writeClipboardWithTextarea(text: string) {
  if (typeof document.execCommand !== 'function') {
    throw new Error('copy command unavailable');
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const onCopy = (event: ClipboardEvent) => {
    event.clipboardData?.setData('text/plain', text);
    event.preventDefault();
  };
  document.addEventListener('copy', onCopy, {once: true});
  const copied = document.execCommand('copy');
  document.removeEventListener('copy', onCopy);
  textarea.remove();
  if (!copied) {
    throw new Error('copy command failed');
  }
}

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the legacy copy path below.
    }
  }

  writeClipboardWithTextarea(text);
}

async function copyCodeBlock(pre: HTMLPreElement, copy: HTMLElement) {
  const idleLabel = 'Copy code to clipboard';
  try {
    await writeClipboard(pre.textContent || '');
    setCopyLabel(copy, 'Copied');
    window.setTimeout(() => setCopyLabel(copy, idleLabel), 1200);
  } catch {
    setCopyLabel(copy, 'Copy failed');
    window.setTimeout(() => setCopyLabel(copy, idleLabel), 1200);
  }
}

export function enhanceContentCodeBlocks(root: ParentNode = document) {
  const blocks = Array.from(root.querySelectorAll<HTMLPreElement>(contentCodeBlockSelector));
  for (const pre of blocks) {
    if (pre.hasAttribute(copyReadyAttr)) {
      continue;
    }
    pre.setAttribute(copyReadyAttr, 'true');
    if (pre.closest('.pp-content-code-block')) {
      continue;
    }

    const parent = pre.parentNode;
    if (!parent) {
      continue;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'pp-content-code-block';
    parent.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const copy = document.createElement('button');
    copy.className = 'pp-content-code-copy';
    copy.type = 'button';
    setCopyLabel(copy, 'Copy code to clipboard');
    copy.addEventListener('click', () => {
      void copyCodeBlock(pre, copy);
    });

    const icon = document.createElement('sl-icon');
    icon.setAttribute('name', 'copy');
    icon.setAttribute('aria-hidden', 'true');
    copy.appendChild(icon);

    wrapper.appendChild(copy);
  }
}
