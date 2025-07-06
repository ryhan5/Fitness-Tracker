import React from 'react'

import {useAuth} from '../context/AuthContext';

const Dashboard = () => {

  const {user} = useAuth();
  return (
    <div className="h-screen">
      kuch v
    </div>
  )
}

export default Dashboard