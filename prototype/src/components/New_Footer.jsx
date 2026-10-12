import companyLogo from "../assets/new_ui_assets/full_logo_bw.png";
import linkLogo from "../assets/new_ui_assets/link_logo.png";
import xLogo from "../assets/new_ui_assets/x_logo.png";
import "./New_Footer.css";

export default function Footer() {
  return (
    <div className="new-footer-wrapper">
      {/* Above-Footer Graphic: Joins and touches footer top */}
      <div className="new-footer-above-banner">
        <img
          src={`${import.meta.env.BASE_URL}images/above_footer.png`}
          alt="Comply2Reg"
          className="new-footer-above-img"
        />
      </div>

      {/* Main Solid Blue Footer */}
      <footer className="new-footer-main">
        <div className="new-footer-container">
          <div className="new-footer-top-section">
            <div className="new-footer-columns">
              {sections.map((section, i) => (
                <div key={i} className="new-footer-column">
                  <h4 className="new-footer-heading">{section.title}</h4>

                  {section.links.map((item, idx) => (
                    <a 
                      key={idx} 
                      href={getLinkHref(item)} 
                      className="new-footer-link"
                    >
                      {item}
                    </a>
                  ))}

                  {section.contact && (
                    <>
                      <div className="new-footer-icon-row">
                        <a 
                          href="https://linkedin.com/company/comply2reg" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="new-footer-social-link"
                          aria-label="LinkedIn"
                        >
                          <img src={linkLogo} alt="LinkedIn" className="new-footer-icon" />
                        </a>
                        <a 
                          href="https://twitter.com/comply2reg" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="new-footer-social-link"
                          aria-label="X (formerly Twitter)"
                        >
                          <img src={xLogo} alt="X" className="new-footer-icon" />
                        </a>
                      </div>
                      <a href="mailto:talk2us@comply2reg.com" className="new-footer-email">
                        talk2us@comply2reg.com
                      </a>
                    </>
                  )}
                </div>
              ))}
            </div>

            <img src={companyLogo} alt="Comply2Reg Logo" className="new-footer-company-logo" />
          </div>

          <div className="new-footer-legal-section">
            <p className="new-footer-legal-text">
              Comply2Reg is a product of JinniAl Technologies Private Limited.
            </p>
            <p className="new-footer-legal-text">GSTIN: 29AAGCJ7636QIZM</p>
            <p className="new-footer-legal-text">
              Registered office: 192/1, N03, Behind 3rd B Cross, Gururaja Layout,
              Doddanekundi, Bengaluru 560037, India
            </p>
          </div>

          <div className="new-footer-bottom-section">
            <div></div>
            <p className="new-footer-copyright">
              © 2026 | Comply2reg all rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper function to generate hrefs based on link text
function getLinkHref(linkText) {
  const linkMap = {
    "Regulens": "/regulens",
    "Audit Geniee": "/audit-geniee",
    "AskLia": "/asklia",
    "Alternative Investment Fund": "/aif",
    "Compliance Gap Analysis": "/compliance-gap-analysis",
    "Role": "/industries-roles",
    "Fintech Space": "/industries",
    "Pricing": "/pricing",
    "About us": "/about",
    "Terms and Conditions": "/terms",
    Documentation: "/docs",
  };
  
  return linkMap[linkText] || "/";
}

const sections = [
  {
    title: "SOLUTION",
    links: ["Regulens", "Audit Geniee", "AskLia", "Alternative Investment Fund", "Compliance Gap Analysis"],
  },
  {
    title: "FINTECH",
    links: ["Role", "Fintech Space"],
  },
  {
    title: "OTHER",
    links: [
      "Pricing",
      "About us",
      "Documentation",
      "Terms and Conditions",
    ],
  },
  {
    title: "CONTACT",
    links: [],
    contact: true,
  },
];