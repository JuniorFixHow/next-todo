import React from 'react';
import styles from './page.module.css';
import { Todos } from '@/utils/dummy';
import Image from 'next/image';
import Todo from '@/components/todosTable/Todos';

export const metadata = {
  title: "Todos",
  description: 'Create a todo to simplify activities',
}
const Dashboard = () => {
  
  return (
    <div className={styles.dashboard} >
        <Todo />
    </div>
  )
}

export default Dashboard