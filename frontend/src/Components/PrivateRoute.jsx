import React from 'react'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({children}) {
  const role=JSON.parse(localStorage.getItem('role'))

  if(!role){
    return <Navigate to={'/'}/>
  }else{
    return children
  }
}
