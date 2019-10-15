import React from 'react';
export default function If({ component: Component, condition, props }) {
    if (condition)
        return <Component {...props} />
    return null;
}