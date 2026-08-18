import { DOCUMENT, inject } from '@angular/core';

type MarkdownTheme = 'light' | 'dark';

export class MarkdownThemeLoader {
  private static markdownLink?: HTMLLinkElement;
  private static highlightLink?: HTMLLinkElement;

  static load(theme: MarkdownTheme): void {
    this.markdownLink ??= this.createLink('github-markdown-theme');

    this.highlightLink ??= this.createLink('highlight-theme');

    this.markdownLink.href =
      theme === 'dark'
        ? 'assets/github-markdown-css/github-markdown-dark.css'
        : 'assets/github-markdown-css/github-markdown-light.css';

    this.highlightLink.href =
      theme === 'dark' ? 'assets/highlight.js/github-dark.css' : 'assets/highlight.js/github.css';
  }

  private static createLink(id: string): HTMLLinkElement {
    const doc = document; //inject(DOCUMENT);
    const existing = doc.getElementById(id) as HTMLLinkElement | null;

    if (existing) {
      return existing;
    }

    const link = doc.createElement('link');

    link.id = id;
    link.rel = 'stylesheet';

    doc.head.appendChild(link);

    return link;
  }
}
