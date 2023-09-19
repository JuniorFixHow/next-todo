"use client"
import Link from 'next/link'
import React from 'react';
import styles from './footer.module.css';
import Image from 'next/image';
import GIT from '../../assets/git.png';
import YOU from '../../assets/youtube.png';
import LINK from '../../assets/link.png';

const Footer = () => {
    const openME = ()=>{
        window.open('http://juniorfixhow.netlify.app', '_blank')
    }
    const openGit = ()=>{
        window.open('https://github.com/JuniorFixHow/next-todo.git', '_blank')
    }
    const openYoutube = ()=>{
        window.open('https://www.youtube.com/channel/UCNBShgHT470aFJFZ3MfFh-w', '_blank')
    }
    const openLink = ()=>{
        window.open('https://www.linkedin.com/in/junior-annan-robert-b507b5277/', '_blank')
    }
  return (
    <footer className={styles.footer} >
        <div className={styles.container} >

            <div className={styles.left}>
                &copy;
                <span onClick={openME} className={styles.cpright} >JuniorFixHow</span>
            </div>
            <div className={styles.right} >
                <Image onClick={openGit} className={styles.img} alt='git' width={25} height={25} src={GIT} />
                <Image onClick={openYoutube} className={styles.img} alt='youtube' width={25} height={25} src={YOU} />
                <Image onClick={openLink} className={styles.img} alt='linkedin' width={25} height={25} src={LINK} />
            </div>
        </div>
    </footer>
  )
}

export default Footer