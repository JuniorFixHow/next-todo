"use client"
import React, { useContext, useState } from 'react';
import styles from './todos.module.css';
import Image from 'next/image';
import { Todos } from '@/utils/dummy';
import NewTodos from '../new/New';
import axios from 'axios';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '@/context/ThemeContext';


let TodoData = [];

const fetchTodos = async()=>{
    const todos = await fetch('http://localhost:3000/api/todos',{
        cache:'no-store'
    });

    if(!todos.ok){
        throw new Error('Failed to fetch data');
    }

    return TodoData.push( todos.json());

}



const Todo = () => {
    const {mode} = useContext(ThemeContext);
    const [showNew, setShowNew] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [currentTodo, setCurrentTodo] = useState(null);
    const [search, setSearch] = useState('');
    const showNewModal = ()=>{
        setShowNew(true);
        setCurrentTodo(null);
    }
    const editModal = (todo)=>{
        setShowNew(true);
        setCurrentTodo(todo);
    }

    const fetcher = (...args) => fetch(...args).then(res=>res.json());

    const {data, error, isLoading, mutate} = useSWR('/api/todos', fetcher);

    const session = useSession();
    const router = useRouter();
    // console.log(session)
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

    const handleDelete = async(id)=>{
        try {
            setCurrentId(id);
            setDeleteLoading(true);
            await fetch(`/api/todos/${id}`, {method: "DELETE",})
            setDeleteLoading(false);
            setCurrentId(null);
            mutate();
        } catch (err) {
            setCurrentId(null);
            setDeleteLoading(false);
            console.log(err)
        }
    }

  return (
    <div className={styles.todo} >
        <div className={styles.content}>
            <h1>Todos</h1>
            <div className={styles.top}>
                <input onChange={(e)=>setSearch(e.target.value)} className={styles.input} type='search' placeholder='search for todo' />
                <div className={styles.addnew} >
                    <button onClick={showNewModal} className='button' >Add new</button>
                </div>
            </div>
            <div className={styles.down}>
                {
                    data && data.filter(td=>{
                        return search === '' ? td : Object.values(td)
                        .join(' ')
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    }).map(todo=>(
                        <div 
                        style={mode === 'dark'? {boxShadow: '2px 4px 9px rgba(255, 255, 255, 0.25)'}: {boxShadow: '2px 4px 9px rgba(0, 0, 0, 0.25)'}}
                        className={styles.onetodo} key={todo._id} >
                            <h2>{todo.title}</h2>
                            <Link href={`/dashboard/${todo._id}`} >
                                {
                                    todo.completed ?
                                    <del>{todo.content.length > 75 ? todo.content.substring(0,75) + '...' : todo.content}</del>
                                    :
                                    <h4>{todo.content.length > 75 ? todo.content.substring(0,75) + '...' : todo.content}</h4>
                                }
                            </Link>
                            <span className={styles.todotime}>{new Date(todo.createdAt).toLocaleDateString()}</span>
                            <div className={styles.tododown}>
                                {
                                    session?.data?.user._id === todo.poster._id &&
                                    <div className={styles.left}>
                                        <button disabled={deleteLoading} onClick={()=>editModal(todo)} className="edit">Edit</button>
                                        <button disabled={deleteLoading} onClick={()=>handleDelete(todo._id)} className="delete">{(currentId === todo._id) && deleteLoading ? 'Deleting':'Delete'}</button>
                                    </div>
                                }
                                <div className={styles.right}>
                                    <Image className={styles.img} width={25} height={25} src={
                                        todo.poster?.image || 'https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png'
                                    } alt='poster' />
                                    <span className={styles.todouser}>{todo.poster.username}</span>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
        {
            showNew &&
            <NewTodos showNew={showNew} setShowNew={setShowNew} 
                setCurrentTodo={setCurrentTodo} currentTodo={currentTodo}
            />
        }
    </div>
  )
}

export default Todo