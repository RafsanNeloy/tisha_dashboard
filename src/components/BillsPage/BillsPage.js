import React from 'react'
import { useSelector } from 'react-redux'
import BillsContainer from './BillsContainer'

const BillsPage = () => {
    const auth = useSelector(state => state.auth)
    const isAdmin = auth?.user?.role === 'admin'

    return (
        <BillsContainer isAdmin={isAdmin} />
    )
}

export default BillsPage 