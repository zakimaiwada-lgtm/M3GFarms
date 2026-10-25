"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Leaf,
  Sprout,
  Wheat,
  Trees,
  MoveDown,
  Menu,
  X,
  Sun,
  Moon,
  Download,
  MapPin,
  Mail,
  Check,
  ChevronDown,
  LoaderCircle,
} from "lucide-react";
import { forages, businesses, leaders } from "../lib/content";
import { BoardProfile } from "../components/board-profile";
const email = "m3gfarmslimited77@gmail.com";
const nav = [
  ["About us", "about"],
  ["Our businesses", "businesses"],
  ["Our forage", "forage"],
  ["Partnerships", "partnerships"],
];
function Brand() {
  return (
    <a className="brand" href="#home" aria-label="M3G Farms home">
      <span className="brand-icon">
        <Sprout size={27} />
      </span>
      <span>
        M3G<span className="brand-light">FARMS</span>
        <small>GROWING WITH PURPOSE</small>
      </span>
    </a>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
export default function Home() {
  const [menu, setMenu] = useState(false),
    [dark, setDark] = useState(false),
    [active, setActive] = useState(0);
  const [formState, setFormState] = useState<
      "idle" | "sending" | "success" | "error"
    >("idle"),
    [error, setError] = useState("");
  const started = useRef(Date.now());
  useEffect(() => {
    const stored = localStorage.getItem("m3g-theme");
    const value = stored === "dark";
    setDark(value);
    document.documentElement.dataset.theme = value ? "dark" : "light";
  }, []);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);
  function toggleTheme() {
    setDark(!dark);
    document.documentElement.dataset.theme = !dark ? "dark" : "light";
    localStorage.setItem("m3g-theme", !dark ? "dark" : "light");
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setFormState("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, startedAt: started.current }),
        signal: AbortSignal.timeout(20000),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(
          result.error || "We couldn’t send your enquiry. Please try again.",
        );
      setFormState("success");
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Please try again or email us directly.",
      );
      setFormState("error");
    }
  }
  const selected = forages[active];
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="header">
        <div className="nav-wrap">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(([label, id]) => (
              <a href={`#${id}`} key={id}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="icon-button"
              onClick={toggleTheme}
              aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a className="button small nav-contact" href="#contact">
              Let’s talk <ArrowUpRight size={16} />
            </a>
            <button
              className="icon-button mobile-toggle"
              aria-expanded={menu}
              aria-controls="mobile-nav"
              aria-label={menu ? "Close navigation" : "Open navigation"}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      {menu && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Mobile navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") setMenu(false);
          }}
        >
          {[...nav, ["Contact us", "contact"]].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
              {label}
              <ArrowUpRight />
            </a>
          ))}
        </nav>
      )}
      <main id="main">
        <section className="hero" id="home">
          <img
            className="hero-image"
            src="/images/abuja-fields.jpg"
            alt="Aerial view of farmland near a river in Abuja, Nigeria"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-content container">
            <div className="hero-top">
              <span className="hero-tag">
                <span />
                ROOTED IN NIGERIA. GROWING FOR TOMORROW.
              </span>
              <span className="hero-coordinate">
                ABUJA, NIGERIA <span>09.0765° N · 07.3986° E</span>
              </span>
            </div>
            <div className="hero-copy">
              <h1>
                Growing today.
                <br />
                Feeding <em>tomorrow.</em>
              </h1>
              <p>
                Better forage. Stronger livestock. A more sustainable future.
                <br className="desktop-break" /> We’re cultivating the
                possibilities of Nigerian agriculture.
              </p>
              <div className="hero-buttons">
                <a className="button lime" href="#businesses">
                  Explore our businesses <ArrowUpRight size={19} />
                </a>
                <a className="hero-text-link" href="#partnerships">
                  Grow with us <ArrowUpRight size={18} />
                </a>
              </div>
            </div>
            <div className="hero-bottom">
              <span>
                <Leaf size={17} />
                Sustainable by nature. Ambitious by design.
              </span>
              <a href="#about">
                DISCOVER M3G <MoveDown size={17} />
              </a>
            </div>
          </div>
        </section>
        <div className="facts-strip">
          <div className="container facts">
            <div>
              <strong>04</strong>
              <span>Connected business areas</span>
            </div>
            <div>
              <strong>04</strong>
              <span>Premium forage varieties</span>
            </div>
            <div>
              <strong>Abuja, FCT</strong>
              <span>Rooted in Nigeria</span>
            </div>
            <div>
              <span className="fact-sprout">
                <Sprout size={29} />
              </span>
              <span>
                One integrated vision.
                <br />
                <b>Long-term impact.</b>
              </span>
            </div>
          </div>
        </div>
        <section className="section container about" id="about">
          <div>
            <Label>THE M3G STORY</Label>
            <h2>
              A better future
              <br />
              starts from the ground.
            </h2>
            <a className="text-link" href="/m3g-company-profile.pdf" download>
              Discover our company <Download size={17} />
            </a>
          </div>
          <div className="about-copy">
            <p className="lead">
              We’re building a modern agribusiness that connects healthy land,
              productive livestock, and lasting value.
            </p>
            <p>
              From our base in Abuja, M3G Farm Limited brings together
              high-yield forage cultivation, crop and livestock production, agro
              processing, and responsibly managed woodlots. Every part works
              together to support food security and a more resilient
              agricultural economy.
            </p>
            <div className="values-row">
              <span>
                <Sprout size={20} />
                Purposeful growth
              </span>
              <span>
                <Leaf size={20} />
                Responsible practices
              </span>
            </div>
          </div>
        </section>
        <section className="section business-section" id="businesses">
          <div className="container">
            <div className="section-head">
              <div>
                <Label>ONE ECOSYSTEM. MANY POSSIBILITIES.</Label>
                <h2>Built to grow. Together.</h2>
              </div>
              <p>
                Four connected businesses.
                <br />
                One commitment to a more productive future.
              </p>
            </div>
            <div className="business-grid">
              {businesses.map((b, i) => (
                <a
                  className={`business-card business-${i}`}
                  key={b.title}
                  href={i === 0 ? "#forage" : "#contact"}
                >
                  <img src={b.image} alt={b.alt} loading="lazy" />
                  <div className="card-shade" />
                  <span className="card-number">0{i + 1} / OUR BUSINESSES</span>
                  <div className="business-card-content">
                    <div className="business-card-title">
                      <h3>{b.title}</h3>
                      <span className="circle-arrow">
                        <ArrowUpRight size={21} />
                      </span>
                    </div>
                    <p>{b.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section className="section container forage-section" id="forage">
          <div className="section-head">
            <div>
              <Label>THE ROOT OF BETTER FEED</Label>
              <h2>
                Great livestock starts
                <br />
                with exceptional forage.
              </h2>
            </div>
            <p>
              Purpose-grown grasses for productive herds,
              <br />
              reliable feed systems, and healthier land.
            </p>
          </div>
          <div
            className="forage-tabs"
            role="tablist"
            aria-label="Forage varieties"
          >
            {forages.map((f, i) => (
              <button
                key={f.name}
                role="tab"
                id={`tab-${i}`}
                aria-controls="forage-panel"
                aria-selected={active === i}
                tabIndex={active === i ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const next =
                      (active +
                        (e.key === "ArrowRight" ? 1 : -1) +
                        forages.length) %
                      forages.length;
                    setActive(next);
                    document.getElementById(`tab-${next}`)?.focus();
                  }
                }}
                className={active === i ? "selected" : ""}
                onClick={() => setActive(i)}
              >
                {f.name}
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
          <div
            className="forage-panel"
            id="forage-panel"
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
          >
            <div className="forage-photo">
              <img
                src="/images/abuja-fields.jpg"
                alt="Illustrative agricultural landscape in Abuja, Nigeria"
                loading="lazy"
              />
              <span>
                <Sprout size={18} />
                GROWN WITH PURPOSE
              </span>
            </div>
            <div className="forage-content">
              <span className="pill">{selected.tag}</span>
              <h3>{selected.name}</h3>
              <p>{selected.description}</p>
              <ul>
                {selected.features.map((f) => (
                  <li key={f}>
                    <span className="check">
                      <Check size={13} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                className="text-link"
                href="#contact"
                onClick={() => {
                  const select = document.getElementById(
                    "interest",
                  ) as HTMLSelectElement | null;
                  if (select) select.value = "Forage & grass production";
                }}
              >
                Enquire about {selected.name.split(" ")[0]}{" "}
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="forage-note">
            <Leaf size={17} />
            <p>
              The right crop, in the right place, with the right management.
              Yields depend on soil, water, and growing conditions.
            </p>
          </div>
          <details className="yield-details">
            <summary>
              Explore Juncao production potential <ChevronDown size={17} />
            </summary>
            <div className="yield-grid">
              <div>
                <strong>275</strong>
                <span>Fresh biomass · average*</span>
              </div>
              <div>
                <strong>450</strong>
                <span>Fresh biomass · intensive*</span>
              </div>
              <div>
                <strong>30</strong>
                <span>Dry matter*</span>
              </div>
              <p>
                *Indicative figures from the company profile; the chart does not
                specify units. Under suitable management, the profile estimates
                one hectare may support roughly 20 cows or 200 goats annually.
                These are planning estimates, not guaranteed outcomes.
              </p>
            </div>
          </details>
        </section>
        <section className="purpose-section">
          <div className="container purpose-grid">
            <div>
              <Label>GROWTH THAT GOES FURTHER</Label>
              <h2>
                Good for the land.
                <br />
                Better for the future.
              </h2>
              <p>
                Our vision is to become a trusted provider of sustainable
                forage, livestock feed, and agro products across Nigeria and
                West Africa.
              </p>
              <a className="button lime" href="#partnerships">
                Be part of the journey <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="purpose-list">
              {[
                {
                  Icon: Sprout,
                  title: "Produce with purpose",
                  desc: "High-quality forage for intensive and semi-intensive livestock systems.",
                },
                {
                  Icon: Trees,
                  title: "Plant for the long term",
                  desc: "Fast-growing trees suited to Nigeria, block and strip planting, responsible cutting cycles, and replanting for domestic, industrial, and export-oriented biomass markets.",
                },
                {
                  Icon: Wheat,
                  title: "Create lasting value",
                  desc: "Agro processing, practical advisory, and agribusiness development that connect the entire value chain.",
                },
              ].map(({ Icon, title, desc }) => (
                <div key={title}>
                  <Icon size={26} />
                  <div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section container" id="leadership">
          <div className="section-head">
            <div>
              <Label>PEOPLE BEHIND THE PURPOSE</Label>
              <h2>Experience. Direction. Integrity.</h2>
            </div>
            <p>
              Leadership spanning architecture, business,
              <br />
              public service, and agribusiness.
            </p>
          </div>
          <div className="leader-grid">
            {leaders.map((l) => (
              <BoardProfile key={l.name} {...l}/>
            ))}
          </div>
        </section>
        <section className="section partnership-section" id="partnerships">
          <div className="container">
            <div className="section-head">
              <div>
                <Label>MORE IS POSSIBLE, TOGETHER</Label>
                <h2>Let’s build what comes next.</h2>
              </div>
              <p>
                For investors, development agencies, off-takers,
                <br />
                farmers, and cooperatives ready to grow.
              </p>
            </div>
            <div className="partnership-grid">
              {[
                [
                  "01",
                  "Invest & develop",
                  "Joint ventures for large-scale Juncao and tree plantations.",
                ],
                [
                  "02",
                  "Secure your supply",
                  "Contract forage production tailored to your livestock operation.",
                ],
                [
                  "03",
                  "Put land to work",
                  "Lease and management agreements for underutilized land.",
                ],
                [
                  "04",
                  "Build capability",
                  "Technical advisory, training, and out-grower partnerships.",
                ],
              ].map(([n, title, desc]) => (
                <a href="#contact" className="partnership-card" key={n}>
                  <span>
                    {n}
                    <ArrowUpRight size={20} />
                  </span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </a>
              ))}
            </div>
            <div className="collaborators">
              <p>OUR COLLABORATIONS</p>
              <span>Manchong Integrated Farms</span>
              <span>Yerwa Meat Processing Factory</span>
              <span>Dunoma Ventures</span>
            </div>
          </div>
        </section>
        <section className="section container contact-section" id="contact">
          <div className="contact-copy">
            <Label>LET’S START A CONVERSATION</Label>
            <h2>
              Your next chapter
              <br />
              could start here.
            </h2>
            <p>
              Have a project in mind, need quality forage, or want to explore a
              partnership? We’d love to hear from you.
            </p>
            <a className="contact-detail" href={`mailto:${email}`}>
              <Mail size={20} />
              <span>
                <small>EMAIL US</small>
                {email}
              </span>
              <ArrowUpRight size={17} />
            </a>
            <a
              className="contact-detail"
              href="https://www.google.com/maps/search/?api=1&query=Oyo+House+Ralph+Shodehinde+Street+Abuja"
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={20} />
              <span>
                <small>VISIT OUR OFFICE</small>Suite 105, First Floor, Rear
                Wing, Oyo House,
                <br />
                Ralph Shodehinde Street, CBD, Abuja, FCT, Nigeria
              </span>
              <ArrowUpRight size={17} />
            </a>
            <a className="text-link" href="/m3g-company-profile.pdf" download>
              Download company profile <Download size={17} />
            </a>
          </div>
          <div className="form-card">
            {formState === "success" ? (
              <div className="success-message" role="status">
                <span className="success-icon">
                  <Check size={32} />
                </span>
                <h3>Let’s grow something good.</h3>
                <p>
                  Your enquiry has been accepted for delivery to our team. Thank
                  you for reaching out to M3G Farms.
                </p>
                <button
                  className="button"
                  onClick={() => {
                    setFormState("idle");
                    started.current = Date.now();
                  }}
                >
                  Send another enquiry <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <h3>Tell us what you have in mind.</h3>
                <p className="form-intro">Fields marked * are required.</p>
                <div className="form-row">
                  <label htmlFor="name">
                    Full name *
                    <input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={100}
                    />
                  </label>
                  <label htmlFor="email">
                    Email address *
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      autoComplete="email"
                      required
                      maxLength={254}
                    />
                  </label>
                </div>
                <label htmlFor="company">
                  Company / organisation
                  <input
                    id="company"
                    name="company"
                    placeholder="Your organisation (optional)"
                    autoComplete="organization"
                    maxLength={150}
                  />
                </label>
                <label htmlFor="interest">
                  I’m interested in *
                  <select
                    id="interest"
                    name="interest"
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select an area of interest
                    </option>
                    {[
                      "Forage & grass production",
                      "Livestock farming",
                      "Agro processing",
                      "Agribusiness development",
                      "Charcoal & biomass",
                      "Partnership opportunities",
                      "General enquiry",
                    ].map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </select>
                </label>
                <label htmlFor="message">
                  Your message *
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="A little about your project or enquiry…"
                    required
                    minLength={10}
                    maxLength={5000}
                  />
                </label>
                <div className="honeypot" aria-hidden="true">
                  <label>
                    Website
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <label className="consent">
                  <input type="checkbox" name="consent" required />I agree that
                  M3G Farms may use these details to respond to my enquiry. *
                </label>
                {formState === "error" && (
                  <div className="form-error" role="alert">
                    {error}{" "}
                    <a href={`mailto:${email}`}>
                      Email us directly <ArrowUpRight size={13} />
                    </a>
                  </div>
                )}
                <button
                  className="button submit-button"
                  type="submit"
                  disabled={formState === "sending"}
                >
                  {formState === "sending" ? (
                    <>
                      Sending enquiry{" "}
                      <LoaderCircle className="spin" size={18} />
                    </>
                  ) : (
                    <>
                      Send enquiry <ArrowUpRight size={18} />
                    </>
                  )}
                </button>
                <p className="privacy-note">
                  Your details are used only to respond to this enquiry. They
                  are not added to a mailing list.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>
      <footer>
        <div className="container">
          <div className="footer-top">
            <div>
              <Brand />
              <p>
                Growing today. Feeding tomorrow.
                <br />A sustainable future, rooted in Nigeria.
              </p>
              <span className="footer-status">
                <span />
                Open to meaningful partnerships
              </span>
            </div>
            <div>
              <h4>EXPLORE</h4>
              {nav.map(([label, id]) => (
                <a href={`#${id}`} key={id}>
                  {label}
                </a>
              ))}
            </div>
            <div>
              <h4>COMPANY</h4>
              <a href="#leadership">Our leadership</a>
              <a href="/m3g-company-profile.pdf" download>
                Company profile <ArrowUpRight size={13} />
              </a>
              <a href="#contact">Contact us</a>
              <a href={`mailto:${email}`}>
                Send an email <ArrowUpRight size={13} />
              </a>
            </div>
            <div className="footer-location">
              <h4>FIND US</h4>
              <p>
                Suite 105, Oyo House
                <br />
                Ralph Shodehinde Street, CBD
                <br />
                Abuja, FCT, Nigeria
              </p>
              <span>RC 9740950</span>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} M3G Farm Limited · RC 9740950. All rights
              reserved.
            </span>
            <span>
              Rooted in purpose. Growing with integrity. <Sprout size={15} />
            </span>
            <a href="#home">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </>
  );
}
