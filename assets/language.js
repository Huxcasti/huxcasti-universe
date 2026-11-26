// The shared portfolio preference also works on a link opened directly from a résumé.
window.HuxcastiLanguage = (() => {
  const key = 'huxcasti.language';
  const valid = value => value === 'es' || value === 'en';
  const query = new URL(location.href).searchParams.get('lang');
  let preference;
  try { preference = localStorage.getItem(key); } catch {}
  const supported = (navigator.languages || [navigator.language])
    .map(tag => tag.toLowerCase().split('-')[0]).find(valid);
  let language = valid(query) ? query : valid(preference) ? preference : supported || 'es';
  let explicit = valid(query) || valid(preference);
  const messages = new Map();
  const originals = new WeakMap();
  const originalAttrs = new WeakMap();
  const formatters = [];
  const normalize = value => value.trim().replace(/\s+/g, ' ');

  function remember() {
    document.documentElement.lang = language;
    if (explicit) {
      try { localStorage.setItem(key, language); } catch {}
    }
  }
  remember();

  function text(source) {
    if (language !== 'en') return source;
    const clean = normalize(source);
    const translated = messages.get(clean) ?? formatters.map(format => format(clean)).find(value => value != null);
    if (translated == null) return source;
    return source.replace(/\S[\s\S]*\S|\S/, () => translated);
  }

  function localize(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (node.nodeType === 1 && /^(SCRIPT|STYLE|SVG|NOSCRIPT|TEXTAREA|HX-LANGUAGE)$/i.test(node.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.nodeType === 3) {
        if (!node.data.trim()) continue;
        if (!originals.has(node)) originals.set(node, node.data);
        const value = text(originals.get(node));
        if (node.data !== value) node.data = value;
        continue;
      }
      for (const attr of ['alt','aria-label','placeholder','title','content']) {
        if (!node.hasAttribute(attr) || (attr === 'content' && node.getAttribute('name') !== 'description')) continue;
        if (!originalAttrs.has(node)) originalAttrs.set(node, {});
        const attrs = originalAttrs.get(node);
        attrs[attr] ??= node.getAttribute(attr);
        const value = text(attrs[attr]);
        if (node.getAttribute(attr) !== value) node.setAttribute(attr, value);
      }
      if (node.dataset.imageTemplate) {
        const target = node.tagName === 'SOURCE' ? 'srcset' : 'src';
        const url = node.dataset.imageTemplate.replace('{lang}', language);
        if (node.getAttribute(target) !== url) node.setAttribute(target, url);
      }
      if (node.tagName === 'A') updateLink(node);
    }
  }

  function updateLink(anchor) {
    const original = anchor.dataset.sourceHref || anchor.getAttribute('href');
    if (!original || original.startsWith('#')) return;
    const url = new URL(original, location.href);
    if (explicit && url.origin === location.origin && (['/', '/index.html', '/perfil.html','/demo-just-be-you.html','/demo-cine.html','/cotizar/','/cotizar/index.html'].includes(url.pathname))) {
      anchor.dataset.sourceHref = original;
      url.searchParams.set('lang', language);
      anchor.setAttribute('href', url.pathname + url.search + url.hash);
    } else if (url.hostname === 'wa.me' && url.searchParams.has('text')) {
      anchor.dataset.sourceHref = original;
      url.searchParams.set('text', text(url.searchParams.get('text')));
      anchor.href = language === 'es' ? original : url.href;
    }
  }

  function select(next) {
    if (!valid(next)) return;
    language = next;
    explicit = true;
    remember();
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    history.replaceState(history.state, '', url);
    window.dispatchEvent(new Event('huxcasti-language'));
  }
  function subscribe(callback) {
    window.addEventListener('huxcasti-language', callback);
    return () => window.removeEventListener('huxcasti-language', callback);
  }

  class LanguageMenu extends HTMLElement {
    connectedCallback() {
      if (!this.select) {
        this.select = document.createElement('select');
        for (const [id, label] of [['es','Español'], ['en','English']]) {
          const option = new Option(label, id);
          option.lang = id;
          this.select.add(option);
        }
        this.select.addEventListener('change', () => select(this.select.value));
        this.append(this.select);
      }
      const sync = () => {
        this.select.value = language;
        this.select.setAttribute('aria-label', language === 'es' ? 'Idioma' : 'Language');
      };
      sync();
      this.unsubscribe = subscribe(sync);
    }
    disconnectedCallback() { this.unsubscribe?.(); }
  }
  customElements.define('hx-language', LanguageMenu);
  return {
    current: () => language, text, localize, subscribe, updateLink,
    add(catalog) { for (const [source, target] of Object.entries(catalog)) messages.set(normalize(source), target); },
    formatWith(format) { formatters.push(format); },
    bindPage() { const render = () => localize(document.documentElement); render(); subscribe(render); }
  };
})();
