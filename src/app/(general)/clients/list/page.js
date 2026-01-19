import ClientList from '@/components/ClientCreate/ClientList'
import React, { Suspense } from 'react'


const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ClientList />
        </Suspense>
    )
}

export default page