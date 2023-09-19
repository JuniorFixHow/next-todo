'use client'
import React, { useContext, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ThemeContext } from '@/context/ThemeContext';

const Login = () => {
    const {mode} = useContext(ThemeContext);
    const [data, setData] = useState({
        email:'', password:''
    });
    const [error, setEror] = useState(null);

    const handleChangeText = (e)=>{
        setData(prev=>({
            ...prev, [e.target.name]:e.target.value, 
            redirect:false
        }))
    }

    const router = useRouter();
    const searchParams = useSearchParams();
    const handleLogin = async(e)=>{
        e.preventDefault();
        setEror(null);
        try {
           
          const login =  await signIn('credentials', data)
        //   console.log(login)
            if(login?.error){
                setEror(login.error);
            }
        } catch (err) {
            setEror(err);
            // return false;
        }
    }


    const session = useSession();
    if(session.status === 'loading'){
        return <div style={{
            width:'100%', height:'100vh', display:'flex', 
            justifyContent:'center', alignItems:'center'}} ><h1 style={{textAlign:'center'}} > Connecting ....</h1></div>
    }
    if(session.status === 'authenticated'){
        return router?.push('/dashboard')
    }
  return (
    <div className={styles.login} >
        <div
         style={mode === 'dark'? {boxShadow: '2px 4px 9px rgba(255, 255, 255, 0.25)'}: {boxShadow: '2px 4px 9px rgba(0, 0, 0, 0.25)'}}
        className={styles.loginbody}>
            <h1>Sign in</h1>
            <form className={styles.content} onSubmit={handleLogin} >
                <input onChange={handleChangeText} required placeholder='email' className={styles.input} type="email" name="email" />
                <input onChange={handleChangeText} required placeholder='password' className={styles.input} type="password" name="password" />
                <button  className="button">Proceed</button>
            </form>
            {
                error && <span style={{color:'crimson'}} >{error}</span>
            }
            <div className={styles.down}>
                <div className={styles.goto}>
                    <span className={styles.ready}>Don't have an account?</span>
                    <Link href='/register' className={styles.loginlink}>Register here</Link>
                </div>
                <h3>Or</h3>
                <div onClick={()=>signIn('google')} className={styles.google}>
                    <Image  src={'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png'} 
                    alt='google'
                    // className={styles.gimg}
                    width={40}
                    height={40}
                    />
                    <h4>Login with Google</h4>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Login