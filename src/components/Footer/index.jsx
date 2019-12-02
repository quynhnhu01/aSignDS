import React from "react";
import styles from "./footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container-fluid">
                <div className="row justify-content-around">
                    <div className="col-8 col-md-5">
                        <h5 className={styles.title}>aSignDS</h5>
                        <p className={styles.description}>
                            Auto Sign with Digital Signature and Manage your document.
                        </p>
                    </div>
                    <div className="col-2">
                        <ul className="list-unstyled">
                            <li>
                                <a className={styles.footerlink} href="/">Home </a>
                            </li>
                            <li>
                                <a className={styles.footerlink} href="/">About</a>
                            </li>
                            <li>
                                <a className={styles.footerlink} href="/">Github</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
