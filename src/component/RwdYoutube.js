import React from 'react';
import styles from './RwdYoutube.module.css';

export default function RwdYoutube({ src }) {
    return (
        <div className={styles.videobox}>
            <iframe frameBorder="0" src={src} allowFullScreen="true" title='實際操作影片' />
        </div>
    )
}