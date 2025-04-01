"use client"
import { useAuthGuard } from '@/components/utils/useAuthGuard'
import React from 'react'

const page = () => {
  const isLoading = useAuthGuard("/");

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }
  return (
    <div>Dashboard</div>
  )
}

export default page