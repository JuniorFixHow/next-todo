"use client"
import React, { useContext, useRef, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { Todos } from '@/utils/dummy';
import { Switch } from '@mui/material';
import {notFound, useRouter} from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { ThemeContext } from '@/context/ThemeContext';



// export const metadata = {
//     title: "Todo",
//     description: 'Create a todo to simplify',
//   }

// let todoTitle = "Todo";



const Single = ({params}) => {
    // console.log(todoTitle)
    // console.log(params.id)
    const {mode} = useContext(ThemeContext);
    const fetcher = (...args) => fetch(...args).then(res=>res.json());

    const {data, error, isLoading, mutate} = useSWR(`/api/todos/${params?.id}`, fetcher);
  
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);

    const session = useSession();
    const router = useRouter();
    if(session.status === 'unauthenticated'){
        return router.push('/login');
    }


    if(error){
        return(
            <div style={{
                display:'flex', width:'100%', height:'100vh',
                alignItems:'center', justifyContent:'center'
            }} >
                <h2 style={{color:'crimson', textAlign:'center'}} >Error occured loading data. Keep refresshing the page</h2>
            </div>
        )
    }
    if(isLoading){
        return(
            <div style={{
                display:'flex', width:'100%', height:'100vh',
                alignItems:'center', justifyContent:'center'
            }} >
                <h1 style={{textAlign:'center'}} >Loading data..... please wait</h1>
            </div>
        )
    }


    // console.log(tgRef.current?.target.checked)

    const handleDelete = async()=>{
        try {
            setDeleteLoading(true);
            await fetch(`/api/todos/${params.id}`, {method: "DELETE"})
            router.push('/dashboard');
            setDeleteLoading(false);
        } catch (err) {
            setDeleteLoading(false);
            console.log(err)
        }
    }

    // console.log(data.completed)
    const handleToggle = async(e)=>{
        setToggleLoading(true);
        try {
            const res = await fetch(`/api/todos/${params.id}`, {
                method: "PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({completed: data.completed ? false : true})
            })
            mutate()
            setToggleLoading(false);
        } catch (err) {
            console.log(err)
            setToggleLoading(false);
        }
    }

  return (
    <div className={styles.single} >
        <div
        style={mode === 'dark'? {boxShadow: '2px 4px 9px rgba(255, 255, 255, 0.25)'}: {boxShadow: '2px 4px 9px rgba(0, 0, 0, 0.25)'}}
        className={styles.inside}>
            <h1>{data?.title}</h1>
            <div
            style={mode === 'dark'? {boxShadow: '2px 4px 9px rgba(255, 255, 255, 0.25)'}: {boxShadow: '2px 4px 9px rgba(0, 0, 0, 0.25)'}}
            className={styles.content}>
                <div className={styles.top}>
                    <h2>To-do</h2>
                    <h4>{data?.content}</h4>
                </div>
                <div className={styles.top}>
                    <h2>Completed</h2>
                    {
                        toggleLoading ?
                        <h4>Updating...</h4>
                        :
                        <Switch  size='medium' 
                            onChange={handleToggle}
                            checked={data?.completed}
                            color={mode === 'dark' ? 'secondary':'default'}
                        />
                    }
                </div>
                <div className={styles.top}>
                    <h2>Posted on </h2>
                    <span className={styles.postername} >{new Date(data?.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div className={styles.poster}>
                {
                    data.poster._id === session.data.user._id &&
                    <button disabled={deleteLoading} onClick={handleDelete} className={styles.del}>{deleteLoading ? 'Deleting':'Remove'}</button>
                }
                <div className={styles.right}>
                    <Image 
                    src={data?.poster?.image || 'https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png'} 
                    alt='poster' width={50} height={50} className={styles.img} />
                    <span className={styles.postername} >{data?.poster?.username}</span>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default Single