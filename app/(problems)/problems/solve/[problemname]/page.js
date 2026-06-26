import SolveProblemScreen from '@/app/_components/Problems/SolveProblemScreen';
import React from 'react'

export default async function page({params}) {
  const {problemname} = await params;
  
  return (
    <SolveProblemScreen/>
  )
}
