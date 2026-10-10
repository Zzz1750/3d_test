import footerBg from "../assets/new_ui_assets/footer_back.png";
import companyLogo from "../assets/new_ui_assets/full_logo_bw.png";
import linkLogo from "../assets/new_ui_assets/link_logo.png";
import xLogo from "../assets/new_ui_assets/x_logo.png";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <img src={footerBg} alt="footer background" style={styles.bg} />

      <div style={styles.overlay}>
        <div style={styles.topSection}>
          <div style={styles.columns}>
            {sections.map((section, i) => (
              <div key={i} style={styles.column}>
                <h4 style={styles.heading}>{section.title}</h4>

                {section.links.map((item, idx) => (
                  <a 
                    key={idx} 
                    href={getLinkHref(item)} 
                    style={styles.link}
                  >
                    {item}
                  </a>
                ))}

                {section.contact && (
                  <>
                    <div style={styles.iconRow}>
                      <a href="https://linkedin.com/company/comply2reg" target="_blank" rel="noopener noreferrer">
                        <img src={linkLogo} alt="linkedin" style={styles.icon} />
                      </a>
                      <a href="https://twitter.com/comply2reg" target="_blank" rel="noopener noreferrer">
                        <img src={xLogo} alt="x" style={styles.icon} />
                      </a>
                    </div>
                    <a href="mailto:talk2us@comply2reg.com" style={styles.email}>
                      talk2us@comply2reg.com
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>

          <img src={companyLogo} alt="company logo" style={styles.logo} />
        </div>

        <div style={styles.legalSection}>
          <p style={styles.legalText}>
            Comply2Reg is a product of JinniAl Technologies Private Limited.
          </p>
          <p style={styles.legalText}>GSTIN: 29AAGCJ7636QIZM</p>
          <p style={styles.legalText}>
            Registered office: 192/1, N03, Behind 3rd B Cross, Gururaja Layout,
            Doddanekundi, Bengaluru 560037, India
          </p>
        </div>

        <div style={styles.bottomSection}>
          <div></div> {/* Empty div for spacing */}
          <p style={styles.copyright}>
            © 2026 | Comply2reg all rights reserved.
          </p>
        </div>
      </div>
    </footer>
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

const styles = {
  footer: {
    position: "relative",
    width: "100%",
    color: "#fff",
    fontFamily: "Inter, sans-serif",
    overflow: "hidden",
  },

  bg: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: 0,
  },

  overlay: {
    position: "relative",
    zIndex: 1,
    padding: "60px 40px 40px 40px",
    display: "flex",
    flexDirection: "column",
    gap: "60px",
  },

  topSection: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "40px",
  },

  columns: {
    display: "flex",
    flexWrap: "wrap",
    gap: "60px",
  },

  column: {
    minWidth: "160px",
  },

  heading: {
    fontSize: "13px",
    letterSpacing: "1px",
    marginBottom: "14px",
    opacity: 0.9,
  },

  link: {
    fontSize: "13px",
    marginBottom: "6px",
    opacity: 0.7,
    cursor: "pointer",
    color: "#fff",
    textDecoration: "none",
    display: "block",
    transition: "opacity 0.2s",
    ':hover': {
      opacity: 1,
    },
  },

  iconRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "8px",
  },

  icon: {
    width: "18px",
    height: "18px",
    objectFit: "contain",
    cursor: "pointer",
    transition: "opacity 0.2s",
    ':hover': {
      opacity: 0.8,
    },
  },

  email: {
    fontSize: "12px",
    opacity: 0.7,
    color: "#fff",
    textDecoration: "none",
    transition: "opacity 0.2s",
    ':hover': {
      opacity: 1,
    },
  },

  logo: {
    width: "140px",
    alignSelf: "flex-start",
  },

  legalSection: {
    borderTop: "1px solid rgba(255, 255, 255, 0.15)",
    paddingTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  legalText: {
    fontSize: "11px",
    opacity: 0.5,
    margin: 0,
    lineHeight: 1.6,
  },

  bottomSection: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
  },

  copyright: {
    fontSize: "12px",
    opacity: 0.7,
    margin: 0,
    textAlign: "right",
  },
};