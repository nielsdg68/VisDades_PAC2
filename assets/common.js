// Paleta, tema i utilitats compartides per totes les visualitzacions.
(function () {
  const dark = document.documentElement.dataset.theme === "dark" ||
    (document.documentElement.dataset.theme !== "light" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Colors del joc (WUBRG + multicolor daurat + incolor gris).
  // El blanc és un crema amb vora perquè no desaparegui sobre el fons.
  const COLORS = dark
    ? { W: "#E9DFB8", U: "#4F93D1", B: "#8C7AA3", R: "#E2604A", G: "#4FAE74", M: "#D4AF37", C: "#9AA3AB" }
    : { W: "#E8DDB5", U: "#1F6FB2", B: "#4B3F57", R: "#D2452F", G: "#2F8F57", M: "#C9A227", C: "#9AA3AB" };

  // Colors dels símbols de raresa: negre, plata, or i taronja.
  const RARITY = dark
    ? { common: "#A3A3A3", uncommon: "#9DB3C4", rare: "#D4AF37", mythic: "#E8743B" }
    : { common: "#3A3A3A", uncommon: "#8FA3B3", rare: "#C9A227", mythic: "#E0632A" };

  const css = getComputedStyle(document.documentElement);
  const tok = (n) => css.getPropertyValue(n).trim();
  const T = { surface: tok("--card"), ink: tok("--ink"), ink2: tok("--ink-2"), ink3: tok("--ink-3"), rule: tok("--rule") };

  const baseLayout = () => ({
    paper_bgcolor: T.surface,
    plot_bgcolor: T.surface,
    font: { family: "Inter, system-ui, sans-serif", color: T.ink, size: 13 },
    margin: { t: 16, r: 16, b: 16, l: 16 },
    hoverlabel: { bgcolor: T.surface, bordercolor: T.rule, font: { color: T.ink } },
  });
  const config = { responsive: true, displaylogo: false, modeBarButtonsToRemove: ["lasso2d", "select2d"] };

  // Text fosc o clar segons la lluminositat del fons (per a etiquetes dins dels rectangles).
  function textOn(hex) {
    const n = parseInt(hex.slice(1), 16);
    const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
      v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return L > 0.35 ? "#1d1c1a" : "#ffffff";
  }

  function withAlpha(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  }

  // Taula de dades accessible sota cada gràfic.
  function dataTable(el, headers, rows) {
    const fmt = (v) => (typeof v === "number" ? v.toLocaleString("ca-ES") : v);
    el.innerHTML =
      "<summary>Veure les dades en una taula</summary><div class='table-wrap'><table><thead><tr>" +
      headers.map((h) => `<th>${h}</th>`).join("") +
      "</tr></thead><tbody>" +
      rows.map((r) => "<tr>" + r.map((v) => `<td class="${typeof v === "number" ? "num" : ""}">${fmt(v)}</td>`).join("") + "</tr>").join("") +
      "</tbody></table></div>";
  }

  const nf = (v) => v.toLocaleString("ca-ES");

  window.VIZ = { dark, COLORS, RARITY, T, baseLayout, config, textOn, withAlpha, dataTable, nf };
})();
