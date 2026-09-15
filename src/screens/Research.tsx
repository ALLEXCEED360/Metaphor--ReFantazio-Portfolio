import { type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Background } from "../components/Background";
import { ScreenTitle } from "../components/ScreenTitle";
import { Splat } from "../components/Splat";
import { Screen, Tag } from "../components/ui";
import { useKeyNav } from "../hooks/useKeyNav";
import { useNav } from "../app/router";
import { useSettings } from "../app/settings";
import { profile } from "../data/profile";
import { chapters, research, type BenchRow } from "../data/research";
import "./Research.css";

const ease = [0.16, 1, 0.3, 1] as const;
const N = chapters.length;

/* ─────────────────────────────────────────────────────────
   RESEARCH — one treatise read as a codex. Five chapters along the top,
   each a full composition; a colophon on the right keeps the credentials
   in view the whole time. ←/→ turns the chapter.
   ───────────────────────────────────────────────────────── */

export function Research() {
  const { go } = useNav();
  const { reducedMotion } = useSettings();
  const { index, setIndex } = useKeyNav({
    count: N,
    axis: "both",
    loop: false,
    initial: (() => {
      const q = Number(new URLSearchParams(window.location.search).get("sel"));
      if (Number.isFinite(q) && q >= 1 && q <= N) return q - 1;
      return 0;
    })(),
    onBack: () => go("/menu"),
  });
  const ch = chapters[index];

  const rise = (k: number) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.12 + k * 0.06, duration: 0.4, ease },
  });

  return (
    <Screen
      head={
        <ScreenTitle
          sub={`1 treatise · ${N} chapters · ${research.institution}`}
        >
          Research
        </ScreenTitle>
      }
      hints={[
        { key: "↔", label: "Chapter" },
      ]}
      onBack={() => go("/menu")}
      className="research"
    >
      <Background
        art={ch.art}
        mobileArt={((index % 7) + 1) as number}
        focus="center"
        dim={0.74}
        position="center 40%"
      />

      <div className="rs" style={{ "--paint": ch.paint } as CSSProperties}>
        {/* ── chapter strip ───────────────────────────────────────────── */}
        <nav className="rs__tabs" aria-label="Chapters">
          {chapters.map((c, i) => {
            const on = i === index;
            return (
              <button
                key={c.id}
                className={`tab ${on ? "is-active" : ""}`}
                style={{ "--col": c.paint } as CSSProperties}
                onPointerMove={() => setIndex(i)}
                onClick={() => setIndex(i)}
                aria-pressed={on}
              >
                {on && (
                  <motion.span
                    layoutId="rs-tab-mark"
                    className="tab__mark"
                    aria-hidden="true"
                    transition={{ duration: reducedMotion ? 0 : 0.35, ease }}
                  >
                    <Splat color={c.paint} seed={i + 5} />
                  </motion.span>
                )}
                <span className="tab__numeral t-num">{c.numeral}</span>
                <span className="tab__title">{c.title}</span>
              </button>
            );
          })}
        </nav>

        {/* ── page ────────────────────────────────────────────────────── */}
        <div className="rs__page" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={ch.id}
              className={`page page--${ch.id}`}
              initial={reducedMotion ? false : { opacity: 0, x: 36, skewX: -2 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -20, transition: { duration: 0.16 } }
              }
              transition={{ duration: 0.36, ease }}
            >
              <header className="page__head">
                <span className="page__kicker t-mono">
                  Chapter {ch.numeral} · {ch.title}
                </span>
              </header>
              {ch.id === "thesis" && <Thesis rise={rise} />}
              {ch.id === "chain" && <Chain rise={rise} />}
              {ch.id === "corpus" && <Corpus rise={rise} />}
              {ch.id === "trial" && (
                <Trial rise={rise} reduced={reducedMotion} />
              )}
              {ch.id === "voice" && <Voice rise={rise} />}
            </motion.section>
          </AnimatePresence>
        </div>

        {/* ── colophon ────────────────────────────────────────────────── */}
        <aside className="colo">
          <span className="t-label">Treatise</span>
          <h3 className="colo__title t-display">{research.title}</h3>
          <p className="colo__sub">{research.subtitle}</p>

          <dl className="colo__rows">
            <Row k="Institution" v={research.institution} />
            <Row k="Department" v="Computer Science and Engineering" />
            <Row k="Submitted" v={research.submitted} />
            <Row k="Supervisor" v={research.supervisor} />
          </dl>

          <div className="colo__grade">
            <span className="colo__grade-mark t-num">{research.grade}</span>
            <span className="colo__grade-text">
              <span className="t-label">Grade</span>
              <span className="t-ui">Awarded by {research.institution}</span>
            </span>
          </div>

          <div className="colo__review">
            <span className="t-label">Submitted for review</span>
            <ul>
              {research.review.map((r) => (
                <li key={r} className="t-ui">
                  <span className="colo__dot" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="colo__authors">
            <span className="t-label">Authors</span>
            <ul>
              {research.authors.map((a) => (
                <li
                  key={a}
                  className={`t-ui ${a === profile.name ? "is-me" : ""}`}
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Screen>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="colo__row">
      <dt className="t-label">{k}</dt>
      <dd className="t-ui">{v}</dd>
    </div>
  );
}

type Rise = (k: number) => Record<string, unknown>;

/* ── I · the thesis ─────────────────────────────────────────────────────── */
function Thesis({ rise }: { rise: Rise }) {
  return (
    <div className="th">
      <motion.h2 className="th__title t-hero" {...rise(0)}>
        <span className="th__title-splat" aria-hidden="true">
          <Splat color="var(--paint)" seed={3} />
          <Splat color="var(--paint)" seed={8} className="splat--second" />
        </span>
        <span className="th__title-text">{research.title}</span>
      </motion.h2>
      <motion.p className="th__sub" {...rise(1)}>
        {research.subtitle}
      </motion.p>
      <motion.p className="th__abstract t-body" {...rise(2)}>
        {research.abstract}
      </motion.p>
      <motion.div className="tags th__tags" {...rise(3)}>
        {research.keywords.map((k) => (
          <Tag key={k}>{k}</Tag>
        ))}
      </motion.div>
      <motion.ul className="th__stats" {...rise(4)}>
        {research.stats.map((s) => (
          <li key={s.label} className="bigstat">
            <span className="bigstat__val t-num">
              {s.value.startsWith('+') && <span className="bigstat__sign">+</span>}
              {s.value.replace(/^\+/, '')}
              {s.unit && <small>{s.unit}</small>}
            </span>
            <span className="bigstat__label">{s.label}</span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

/* ── II · the appraisal chain ───────────────────────────────────────────── */
function Chain({ rise }: { rise: Rise }) {
  return (
    <div className="chn">
      <motion.p className="chn__lead t-body" {...rise(0)}>
        Before a single word of the reply, the model walks the chain a person
        walks when they weigh a situation. Each link is written out in the
        training data, so the model learns to reason, not to mimic.
      </motion.p>
      <div className="chn__row">
        {research.chain.map((c, k) => (
          <motion.div key={c.step} className="linkw" {...rise(1 + k)}>
            <article className="link">
              <span className="link__num t-num">
                {String(k + 1).padStart(2, "0")}
              </span>
              <span className="link__step">{c.step}</span>
              <h3 className="link__q t-display">{c.question}</h3>
              <ul className="link__facets">
                {c.facets.map((f) => (
                  <li key={f} className="t-ui">
                    {f}
                  </li>
                ))}
              </ul>
              <p className="link__text t-body">{c.text}</p>
            </article>
            <Arrow />
          </motion.div>
        ))}
        <motion.div className="link link--end" {...rise(4)}>
          <span className="link__step">Then, and only then</span>
          <h3 className="link__q t-display">The reply</h3>
          <p className="link__text t-body">
            Written against the appraisal, so it names the cause of the feeling
            instead of echoing its vocabulary.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg className="link__arrow" viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M6 20 H30 M22 10 L32 20 L22 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}

/* ── III · the corpus ───────────────────────────────────────────────────── */
function Corpus({ rise }: { rise: Rise }) {
  return (
    <div className="cor">
      <motion.div className="cor__lead" {...rise(0)}>
        <span className="cor__name t-display">Appraisal-CoT</span>
        <p className="t-body">
          A synthetic corpus of empathy-driven exchanges, each carrying its own
          written-out appraisal chain, checked by machines and by clinicians.
        </p>
      </motion.div>
      <ol className="cor__grid">
        {research.corpus.map((s, k) => (
          <motion.li key={s.title} className="step" {...rise(1 + k * 0.6)}>
            <span className="step__num t-num">
              {String(k + 1).padStart(2, "0")}
            </span>
            <h3 className="step__title">{s.title}</h3>
            <p className="step__text t-body">{s.text}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

/* ── IV · the trial ─────────────────────────────────────────────────────── */
function Trial({ rise, reduced }: { rise: Rise; reduced: boolean }) {
  return (
    <div className="tr">
      <motion.p className="tr__lead t-body" {...rise(0)}>
        EmoBench, English split. Overall accuracy of each open model before and
        after CAT-CoT tuning.
      </motion.p>
      <div className="tr__charts">
        <Chart
          title={research.bench.eu.title}
          rows={research.bench.eu.rows}
          rise={rise}
          k={1}
          reduced={reduced}
        />
        <Chart
          title={research.bench.ea.title}
          rows={research.bench.ea.rows}
          rise={rise}
          k={2}
          reduced={reduced}
        />
      </div>
      <motion.p className="tr__note t-quote" {...rise(3)}>
        {research.bench.note}
      </motion.p>
    </div>
  );
}

function Chart({
  title,
  rows,
  rise,
  k,
  reduced,
}: {
  title: string;
  rows: BenchRow[];
  rise: Rise;
  k: number;
  reduced: boolean;
}) {
  const max = Math.max(...rows.map((r) => Math.max(r.base, r.tuned))) * 1.12;
  return (
    <motion.div className="chart" {...rise(k)}>
      <h3 className="chart__title">{title}</h3>
      <ul className="chart__rows">
        {rows.map((r, i) => {
          const gain = r.tuned - r.base;
          return (
            <li key={r.model} className="crow">
              <span className="crow__model">{r.model}</span>
              <span className="crow__bars">
                <span className="crow__bar crow__bar--base">
                  <motion.span
                    className="crow__fill"
                    initial={reduced ? false : { width: 0 }}
                    animate={{ width: `${(r.base / max) * 100}%` }}
                    transition={{ delay: 0.25 + i * 0.08, duration: 0.6, ease }}
                  />
                  <span className="crow__val t-num">{r.base}</span>
                </span>
                <span className="crow__bar crow__bar--tuned">
                  <motion.span
                    className="crow__fill"
                    initial={reduced ? false : { width: 0 }}
                    animate={{ width: `${(r.tuned / max) * 100}%` }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.7, ease }}
                  >
                    <Splat color="var(--paint)" seed={i + 11} />
                  </motion.span>
                  <span className="crow__val crow__val--tuned t-num">
                    {r.tuned}
                    <small>+{gain.toFixed(1)}</small>
                  </span>
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="chart__legend t-mono">
        <span>
          <i className="chart__swatch chart__swatch--base" /> Base
        </span>
        <span>
          <i className="chart__swatch chart__swatch--tuned" /> CAT-CoT tuned
        </span>
      </div>
    </motion.div>
  );
}

/* ── V · the voice ──────────────────────────────────────────────────────── */
function Voice({ rise }: { rise: Rise }) {
  const ex = research.example;
  return (
    <div className="vc">
      <motion.blockquote className="vc__prompt" {...rise(0)}>
        <span className="t-label">A person writes</span>
        <p className="t-quote">{ex.prompt}</p>
      </motion.blockquote>
      <div className="vc__pair">
        <Reply
          k={1}
          rise={rise}
          label="Before"
          model={ex.baseline.model}
          text={ex.baseline.text}
        />
        <Reply
          k={2}
          rise={rise}
          label="After"
          model={ex.tuned.model}
          text={ex.tuned.text}
          tuned
        />
      </div>
    </div>
  );
}

function Reply({
  k,
  rise,
  label,
  model,
  text,
  tuned,
}: {
  k: number;
  rise: Rise;
  label: string;
  model: string;
  text: string;
  tuned?: boolean;
}) {
  return (
    <motion.article
      className={`reply ${tuned ? "reply--tuned" : ""}`}
      {...rise(k)}
    >
      <header className="reply__head">
        <span className="reply__label">{label}</span>
        <span className="reply__model t-mono">{model}</span>
      </header>
      <p className="reply__text t-body">{text}</p>
    </motion.article>
  );
}
