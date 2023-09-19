"use client"

import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image';
import React, { useRef } from 'react'
import styles from './header.module.css';
import ThemeToggle from '../themeToggle/ThemeToggle';
import Link from 'next/link';

const Header = () => {
    const session = useSession();
    

  return (
    <header className={styles.header} >
      <div className={styles.container}>
        <Link href='/' >
          <h1>JTD</h1>
        </Link>
        <div className={styles.right}>
          <ThemeToggle />
          {
            session.status === 'authenticated' &&
            <div className={styles.user}>
              <Image className={styles.headerImg} alt='user' height={35} width={35}
                src={session.data.user.image || 'https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png'}
              />
              <span className={styles.username}>{session.data.user.username}</span>
            </div>
          }
          {
            session.status === 'authenticated' &&
            <button onClick={signOut} className="edit">Logout</button>
          }
        </div>
      </div>
    </header>
  )
}

export default Header