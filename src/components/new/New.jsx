import React, { useRef, useState } from 'react'
import { Modal } from '@mui/material';
import styles from './new.module.css';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

const NewTodos = ({showNew, setShowNew, currentTodo, setCurrentTodo}) => {
  const [todo, setTodo] = useState({title:'', content:'', poster:''});
  
  const [loadPosting, setLoadPosting] = useState(false);
  const session = useSession();
    const handleChangeText = (e)=>{
      setTodo(prev=>({
        ...prev, [e.target.name]:e.target.value,
        poster:session.data.user._id
      }))
    }

    const formRef = useRef(null);
    const fetcher = (...args) => fetch(...args).then(res=>res.json());
    const {mutate} = useSWR('/api/todos', fetcher);

    const createTodo = async(e)=>{
      e.preventDefault();
      setLoadPosting(true);
      try {
        const res = await fetch('/api/todos', {
          method:'POST',
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(todo)
        })
        mutate();
        setLoadPosting(false);
        res.status === 201 && formRef.current.reset();
      } catch (error) {
        console.log(error);
        setLoadPosting(false);
      }
    }
    const updateTodo = async(e)=>{
      e.preventDefault();
      setLoadPosting(true);
      try {
        const res = await fetch(`/api/todos/${currentTodo._id}`, {
          method:'PUT',
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            title:todo.title || currentTodo.title,
            content: todo.content || currentTodo.content,
          })
        })
        // console.log('todo: ',todo)
        mutate();
        setLoadPosting(false);
        res.status === 201 && formRef.current.reset();
        // setCurrentTodo(null);
      } catch (error) {
        console.log(error);
        setLoadPosting(false);
        setCurrentTodo(null);
      }
    }

    const closeModal = ()=>{
      setShowNew(false);
      setCurrentTodo(null);
    }
  return (
    <Modal
        open={showNew}
        onClose={()=>setShowNew(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.newtodo}>
         <div className={styles.inputcontainer}>
          <h1>{currentTodo? 'Edit Todo':'New Todo'}</h1>
          <form ref={formRef} onSubmit={currentTodo ? updateTodo : createTodo} className={styles.controls}>
            <input required ={!currentTodo} className={styles.input} onChange={handleChangeText} placeholder={currentTodo ? currentTodo.title : 'todo title'} type="text" name="title"  />
            <textarea required ={!currentTodo} onChange={handleChangeText} className={styles.input} name="content" cols="30" rows="5" placeholder={currentTodo ? currentTodo.content : 'description'} ></textarea>
            <div className={styles.down}>
              <button type='reset' onClick={closeModal} className='save' >Cancel</button>
              {
                currentTodo ?
                <button type='submit' disabled={loadPosting} className='save' >{loadPosting ? 'Loading...':'Update'}</button>
                :
                <button type='submit' disabled={loadPosting} className='save' >{loadPosting ? 'Loading...':'Save'}</button>
              }
            </div>
          </form>
         </div>
        </div>
      </Modal>
  )
}

export default NewTodos