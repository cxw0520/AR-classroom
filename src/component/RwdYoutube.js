import React from 'react';
import styles from './RwdYoutube.module.css';

export default function RwdYoutube({ src }) {
    return (
        <div className={styles.videobox}>
            <iframe frameBorder="0" src={src} allowFullScreen="true" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"  />
        </div>
    )
}