'use client'
import React, { useContext, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '@/context/ThemeContext';
import { signIn, useSession } from 'next-auth/react';

const Register = () => {
    const {mode} = useContext(ThemeContext);
    const [data, setDdata] = useState({
        email:'',
        username:'',
        password:''
    })
    const [cpass, setCpass] = useState('');
    const [error, setError] = useState(false);
    const handleChangeText = (e)=>{
        setDdata(prev =>({
            ...prev,
            [e.target.name]:e.target.value
        }))
    }

    const router = useRouter();
    const handleRegister = async(e)=>{
        e.preventDefault();
        if(data.password === cpass){
            try {
                const res = await fetch('/api/auth/register', {
                    method: "POST",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body: JSON.stringify(data)
                });
                res.status === 201 && router.push('/login')
            } catch (error) {
                setError(true);
            }
        }
         else{
            setError(true);
         }   
    }


    const session = useSession();
    if(session.status === 'loading'){
        return <div style={{
            width:'100%', height:'100%', display:'flex', 
            justifyContent:'center', alignItems:'center'}} ><h1 style={{textAlign:'center'}} > Connecting ....</h1></div>
    }
    if(session.status === 'authenticated'){
        return router?.push('/dashboard')
    }

    // console.log(data)
  return (
    <div className={styles.register} >
        <div 
        style={mode === 'dark'? {boxShadow: '2px 4px 9px rgba(255, 255, 255, 0.25)'}: {boxShadow: '2px 4px 9px rgba(0, 0, 0, 0.25)'}}
        className={styles.body}>
            <h1>Sign up</h1>
            <form className={styles.content} onSubmit={handleRegister} >
                <input onChange={handleChangeText} required placeholder='email' className={styles.input} type="email" name="email" />
                <input onChange={handleChangeText} required placeholder='username' className={styles.input} type="text" name="username" />
                <input minLength={4} onChange={handleChangeText} required placeholder='password' className={styles.input} type="password" name="password" />
                <input onChange={(e)=>setCpass(e.target.value)} required placeholder='confirm password' className={styles.input} type="password" name="password2" />
                <button  className="button">Proceed</button>
            </form>
            {
                error && <span style={{color:'crimson'}} >Something went wrong. Retry</span>
            }
            <div className={styles.down}>
                <div className={styles.goto}>
                    <span className={styles.ready}>Already have an account?</span>
                    <Link href='/login' className={styles.loginlink}>Login here</Link>
                </div>
                <h3>Or</h3>
                <div onClick={()=>signIn('google')} className={styles.google}>
                    <Image  src={'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png'} 
                    alt='google'
                    // className={styles.gimg}
                    width={40}
                    height={40}
                    />
                    <h4 >Login with Google</h4>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Register