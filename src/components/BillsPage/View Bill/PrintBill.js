import { Button } from '@mui/material'
import moment from 'moment'
import React, { useRef } from 'react'
import html2pdf from 'html2pdf.js'
import GetAppIcon from '@mui/icons-material/GetApp'
import logo from '../../../images/tpp.jpg'
import { englishToBengali } from '../../../utils/bengaliNumerals'
import plasticWatermark from '../../../images/plastic.png'

const PrintBill = (props) => {
    const { customer, customerAddress, bill, id, items } = props
    const billRef = useRef(null)

    const generatePdf = () => {
        const element = billRef.current
        const opt = {
            margin: 0,
            filename: `Bill-${bill.billNumber}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: true
            },
            jsPDF: { 
                unit: 'mm',
                format: 'a5',  // Keep A5 format
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: 'avoid-all' }
        }

        html2pdf().from(element).set(opt).save()
    }
    const getProductType = (type) => {
        return type === 0 ? 'ডজন' : 'পিস';
    }


    const BillTemplate = ({ copyType, pageItems, pageNumber, totalPages, isLastPage }) => (
        <div style={{ 
            width: '148mm',  // A5 width
            height: '210mm',  // A5 height
            padding: '8mm',
            boxSizing: 'border-box',
            backgroundColor: 'white',
            position: 'relative',
            pageBreakAfter: (copyType === 'MAIN COPY' && pageNumber === totalPages) ? 'always' : 'always',
            overflow: 'hidden'
        }}>
            {/* Center Logo Watermark */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 0,
                opacity: 0.07,
                pointerEvents: 'none',
                textAlign: 'center'
            }}>
                <img 
                    src={logo}
                    alt="Logo Watermark"
                    style={{
                        width: '80mm',
                        height: 'auto'
                    }}
                />
            </div>

            {/* Bottom Plastic Watermark */}
            <div style={{
                position: 'absolute',
                bottom: '5mm',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 0,
                opacity: 0.1,
                pointerEvents: 'none',
                textAlign: 'center'
            }}>
                <img 
                    src={plasticWatermark}
                    alt="Plastic Watermark"
                    style={{
                        width: '40mm',
                        height: 'auto'
                    }}
                />
            </div>

            {/* Content Container - ensures content stays above watermarks */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Copy Type Indicator */}
                <div style={{
                    position: 'absolute',
                    top: '3mm',
                    right: '3mm',
                    fontSize: '8px',
                    padding: '1px 3px',
                    border: '1px solid #000'
                }}>
                    {copyType}
                </div>

                {/* Green Line */}
                <div style={{
                    borderTop: '2px solid green',
                    width: '100%',
                    marginBottom: '5mm'
                }}></div>

                {/* Header Content */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '5mm'
                }}>
                    <div style={{
                        fontSize: '10px',
                        marginBottom: '3mm'
                    }}>
                        নিত্যপ্রয়োজনীয় প্লাস্টিকের সামগ্রী
                    </div>

                    {/* Logo and Company Name */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5mm',
                        marginBottom: '3mm'
                    }}>
                        <img 
                            src={logo} 
                            alt="Logo" 
                            style={{
                                width: '25px',
                                height: 'auto'
                            }}
                        />
                        <h1 style={{
                            margin: '0',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}>
                            TISHA PLASTIC PRODUCTS
                        </h1>
                    </div>

                    {/* Address */}
                    <div style={{
                        fontSize: '10px',
                        marginBottom: '3mm'
                    }}>
                        ৬/৭/৭/১, চাম্পাতলী লেন, সয়ারিঘাট, ঢাকা
                    </div>
                </div>

                {/* Blue Line */}
                <div style={{
                    borderTop: '2px solid blue',
                    width: '100%',
                    marginBottom: '8mm'
                }}></div>

                {/* Customer Info */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    marginBottom: '8mm'
                }}>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>ক্রেতার নাম:</span> {customer.name}<br />
                        <span style={{ fontWeight: 'bold' }}>ঠিকানা:</span> {customerAddress}
                    </div>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>বিল নং:</span> {englishToBengali(bill.billNumber)}<br />
                        <span style={{ fontWeight: 'bold' }}>তারিখ:</span> {moment(bill.createdAt).format('DD/MM/YYYY')}
                    </div>
                </div>

                {/* Page Number Indicator */}
                <div style={{
                    position: 'absolute',
                    top: '3mm',
                    left: '3mm',
                    fontSize: '8px',
                    padding: '1px 3px',
                    border: '1px solid #000'
                }}>
                    Page {englishToBengali(pageNumber)} of {englishToBengali(totalPages)}
                </div>

                {/* Items Table */}
                <table style={{ 
                    width: '100%', 
                    borderCollapse: 'collapse',
                    marginBottom: '4mm',
                    fontSize: '10px'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
                            <th style={{ padding: '2mm', border: '0.5px solid #bdc3c7', width: '8%' }}>SL</th>
                            <th style={{ padding: '2mm', border: '0.5px solid #bdc3c7', width: '40%' }}>মালের নাম</th>
                            <th style={{ padding: '2mm', border: '0.5px solid #bdc3c7', width: '17%' }}>দাম</th>
                            <th style={{ padding: '2mm', border: '0.5px solid #bdc3c7', width: '15%' }}>পরিমান</th>
                            <th style={{ padding: '2mm', border: '0.5px solid #bdc3c7', width: '20%' }}>মোট</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageItems.map((item, i) => (
                            <tr key={i}>
                                <td style={{ padding: '2mm', border: '0.5px solid #bdc3c7', textAlign: 'center' }}>
                                    {englishToBengali(((pageNumber - 1) * 14) + i + 1)}
                                </td>
                                <td style={{ padding: '2mm', border: '0.5px solid #bdc3c7' }}>{item.product.name}</td>
                                <td style={{ padding: '2mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                    ৳{englishToBengali(item.price)}
                                </td>
                                <td style={{ padding: '2mm', border: '0.5px solid #bdc3c7', textAlign: 'center' }}>
                                    {englishToBengali(item.quantity)} {getProductType(item.product_type)}
                                </td>
                                <td style={{ padding: '2mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                    ৳{englishToBengali(item.subTotal)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <td colSpan="4" style={{ padding: '2mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                <strong>{isLastPage ? 'Total Amount:' : 'Page Total:'}</strong>
                            </td>
                            <td style={{ padding: '2mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                <strong>৳{englishToBengali(isLastPage ? bill.total : pageItems.reduce((sum, item) => sum + item.subTotal, 0))}</strong>
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* Only show signatures on the last page */}
                {isLastPage && (
                    <>
                        {/* Signatures section */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginTop: '10mm',
                            fontSize: '10px',
                            padding: '0 10mm'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ borderTop: '0.5px solid #000', width: '35mm', margin: '0 auto' }}></div>
                                <p style={{ margin: '2mm 0 0 0' }}>Customer's Signature</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ borderTop: '0.5px solid #000', width: '35mm', margin: '0 auto' }}></div>
                                <p style={{ margin: '2mm 0 0 0' }}>Seller's Signature</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ 
                            textAlign: 'center', 
                            marginTop: '6mm',
                            color: '#7f8c8d',
                            fontSize: '9px'
                        }}>
                            <p style={{ margin: '0' }}>Thank you for your business!</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )

    const renderBillPages = (items, copyType) => {
        const ITEMS_PER_PAGE = 14;
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
        
        return Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;
            const startIdx = i * ITEMS_PER_PAGE;
            const pageItems = items.slice(startIdx, startIdx + ITEMS_PER_PAGE);
            
            return (
                <BillTemplate 
                    key={`${copyType}-page-${pageNumber}`}
                    copyType={copyType}
                    pageItems={pageItems}
                    pageNumber={pageNumber}
                    totalPages={totalPages}
                    isLastPage={pageNumber === totalPages}
                />
            );
        });
    };

    return (
        <>
            <Button
                variant='contained'
                color='primary'
                startIcon={<GetAppIcon />}
                onClick={generatePdf}
            >
                Download Bill
            </Button>

            <div style={{ display: 'none' }}>
                <div ref={billRef}>
                    {renderBillPages(items, "MAIN COPY")}
                    {renderBillPages(items, "CUSTOMER COPY")}
                </div>
            </div>
        </>
    )
}

export default PrintBill