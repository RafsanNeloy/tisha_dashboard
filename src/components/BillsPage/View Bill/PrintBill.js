import { Button } from '@mui/material'
import moment from 'moment'
import React from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import GetAppIcon from '@mui/icons-material/GetApp'
import logo from '../../../images/tpp.jpg'

const PrintBill = (props) => {
    const { customer, bill, id, items } = props
    
    const body = items.map((item, i) => {
        return {
            index: i + 1,
            productName: item.product.name,
            price: item.price,
            quantity: item.quantity,
            subTotal: item.subTotal
        }
    })

    const generatePdf = () => {
        const doc = new jsPDF()

        doc.addImage(logo, 'JPEG', 15, 10, 30, 30)

        doc.text('Bill Invoice', 92, 25)
        doc.text(`Customer Name - ${customer.name}`, 15, 45)
        doc.text(`Date & time - ${moment(bill.createdAt).format('DD/MM/YYYY, hh:mm A')}`, 15, 55)
        doc.text(`Total Amount - Rs.${bill.total}`, 15, 65)
        
        autoTable(doc, {
            margin: { top: 75 },
            columns: [
                {header: 'S.No', dataKey: 'index'}, 
                {header: 'Product Name', dataKey: 'productName'}, 
                {header: 'Price', dataKey: 'price'}, 
                {header: 'Quantity', dataKey: 'quantity'}, 
                {header: 'Sub total', dataKey: 'subTotal'}
            ],
            body: body,
            foot: [['', '', '', 'Total Amount', bill.total]],
            columnStyles: {
                index: {cellWidth: 12}, 
                price: {cellWidth: 25}, 
                quantity: {cellWidth: 28}, 
                subTotal: {cellWidth: 25}
            },
            theme: 'grid'
        })
        doc.save(`${id}.pdf`)
    }

    return (
        <Button
            variant='contained'
            color='primary'
            startIcon={<GetAppIcon />}
            onClick={generatePdf}
        >
            Download Bill
        </Button>
    )
}

export default PrintBill