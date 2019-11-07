import React from "react";
import classnames from "classnames";
import styles from "./alertmessage.module.css";

export default function index(props) {
    const { open, text, onClose, type } = props;
    return (
        <React.Fragment>
            {open && (
                <div
                    className={classnames(
                        "alert",
                        `alert-${type}`,
                        "ml-3",
                        styles.alertPosition
                    )}
                    role="alert"
                >
                    {text}
                    <button
                        onClick={onClose}
                        className="close ml-2"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
        </React.Fragment>
    );
}
