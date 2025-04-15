import React, { useRef, useState } from 'react'
import { Button, TextField, Box } from '@mui/material'
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import GetAppIcon from '@mui/icons-material/GetApp'
import logo from '../../../images/tppr.png'
import { englishToBengali } from '../../../utils/bengaliNumerals'
import plasticWatermark from '../../../images/plastic.png'

import PhoneIcon from '@mui/icons-material/Phone';

const PrintBill = (props) => {
    const { customer, customerAddress, bill, id, items } = props
    const billRef = useRef(null)
    const [manualDate, setManualDate] = useState(bill.createdAt ? moment(bill.createdAt).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'))
    const [useManualDate, setUseManualDate] = useState(false)

    // Add validation check
    if (!customer || !bill || !items) {
        return null // Or return a loading state
    }

    const handlePdfGeneration = () => {
        const element = billRef.current
        const opt = {
            margin: 0,
            filename: `${customer.name}-Bill-${bill.billNumber}.pdf`,
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

    const subtotal = bill.items.reduce((sum, item) => sum + item.subTotal, 0);
    const additionalPrice = bill.additionalPrice || 0;
    const discountAmount = subtotal > (bill.total - additionalPrice) ? 
        subtotal - (bill.total - additionalPrice) : 0;

    const PrintBillContent = ({ bill, customer }) => {
        const subtotal = bill.items.reduce((sum, item) => sum + item.subTotal, 0);
        const additionalPrice = bill.additionalPrice || 0;
        const discountAmount = subtotal > (bill.total - additionalPrice) ? 
            subtotal - (bill.total - additionalPrice) : 0;

        return (
            <div className="print-container">
                {/* ... existing header content ... */}
                
                {/* ... existing items table ... */}
                
                <div className="totals-section">
                    <div className="total-row">
                        <span className="total-label">সাবটোটাল:</span>
                        <span className="total-value">৳{englishToBengali(subtotal)}</span>
                    </div>
                    
                    {discountAmount > 0 && (
                        <div className="total-row discount">
                            <span className="total-label">(-) কমিশন:</span>
                            <span className="total-value">৳{englishToBengali(discountAmount)}</span>
                        </div>
                    )}
                    
                    {additionalPrice > 0 && (
                        <div className="total-row additional">
                            <span className="total-label">(+) ট্রাঃ খরচ:</span>
                            <span className="total-value">৳{englishToBengali(additionalPrice)}</span>
                        </div>
                    )}
                    
                    <div className="total-row grand-total">
                        <span className="total-label">মোট টাকা:</span>
                        <span className="total-value">৳{englishToBengali(bill.total)}</span>
                    </div>
                </div>
                
                {/* ... existing footer content ... */}
            </div>
        );
    };

    const BillTemplate = ({ copyType, pageItems, pageNumber, totalPages, isLastPage }) => {
        // Calculate the total of all items (not just current page)
        const calculateTotalAmount = () => {
            return items.reduce((sum, item) => sum + item.subTotal, 0);
        };

        // Get the full subtotal and additionalPrice for the last page
        const fullSubtotal = calculateTotalAmount();
        
        return (
            <div style={{ 
                width: '148mm',
                height: '210mm',
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
                    opacity: 0.12,
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
                    opacity: 0.2,
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

                    {/* Bill Text in Bengali */}
                    <div style={{
                        position: 'absolute',
                        top: '12mm',
                        right: '3mm',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        padding: '1px 3px',
                        border: '1px solid #000'
                    }}>
                        ক্যাশ মেমো
                    </div>

                    {/* Green Line */}
                    <div style={{
                        borderTop: '2px solid green',
                        width: '100%',
                        marginBottom: '2mm'
                    }}></div>

                    {/* Header Content */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '2mm'
                    }}>
                        <div style={{
                            fontSize: '10px',
                            marginBottom: '1mm'
                        }}>
                            বিসমিল্লাহির রাহমানির রাহিম
                        </div>

                        {/* Logo and Company Name */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '9mm',
                            marginBottom: '1mm',
                            paddingLeft: '17mm'
                        }}>
                            <img 
                                src={logo} 
                                alt="Logo" 
                                style={{
                                    width: '55px',
                                    height: 'auto'
                                }}
                            />
                            <h1 style={{
                                margin: '0',
                                fontSize: '28px',
                                fontWeight: 'bold',
                                lineHeight: '1.2'
                            }}>
                                <span style={{ color: '#503C3C' }}>টিসা প্লাস্টিক</span><br />
                                <span style={{ color: 'black' }}>TISHA PLASTIC</span>
                            </h1>
                        </div>

                        {/* Address and Contact */}
                        <div style={{
                            fontSize: '11px',
                            marginBottom: '1mm'
                        }}>
                            <div>৬/৭/এ/১, চাম্পাতলী লেন, সোয়ারিঘাট, ঢাকা</div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                gap: '8mm',
                                marginTop: '1mm'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    gap: '1px'
                                }}>
                                    <PhoneIcon style={{ fontSize: '10px' }} />
                                    <span style={{ color: '#88304E',fontSize: '12px' }}>01744798523, 02-7343144, 01718088956</span>
                                </div>
                                
                            </div>
                        </div>
                    </div>

                    {/* Blue Line */}
                    <div style={{
                        borderTop: '2px solid blue',
                        width: '100%',
                        marginBottom: '5mm'
                    }}></div>

                    {/* Customer Info */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '13px',
                        marginBottom: '3mm',
                        fontWeight: 'bold'
                    }}>
                        <div>
                            <span style={{ fontWeight: 'bold' }}>ক্রেতার নাম: </span> {customer?.name || 'N/A'}<br />
                            <span style={{ fontWeight: 'bold' }}>ঠিকানা:</span> {customerAddress || 'N/A'}
                        </div>
                        <div>
                            <span style={{ fontWeight: 'bold' }}>বিল নং:</span> <span style={{ color: 'blue' }}>{englishToBengali(bill?.billNumber || '')}</span><br />
                            <span style={{ fontWeight: 'bold' }}>তারিখ:</span> {useManualDate ? moment(manualDate).format('DD/MM/YYYY') : (bill?.createdAt ? moment(bill.createdAt).format('DD/MM/YYYY') : 'N/A')}
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
                        marginBottom: '2mm',
                        fontSize: '13px'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#FAF1E6', color: 'black' }}>
                                <th style={{ 
                                    padding: '1mm', 
                                    border: '0.5px solid #bdc3c7', 
                                    width: '8%',
                                    fontWeight: 'bold'
                                }}>SL</th>
                                <th style={{ 
                                    padding: '1mm', 
                                    border: '0.5px solid #bdc3c7', 
                                    width: '40%',
                                    fontWeight: 'bold'
                                }}>মালের নাম</th>
                                <th style={{ 
                                    padding: '1mm', 
                                    border: '0.5px solid #bdc3c7', 
                                    width: '15%',
                                    fontWeight: 'bold'
                                }}>পরিমান</th>
                                <th style={{ 
                                    padding: '1mm', 
                                    border: '0.5px solid #bdc3c7', 
                                    width: '17%',
                                    fontWeight: 'bold'
                                }}>দাম</th>
                                <th style={{ 
                                    padding: '1mm', 
                                    border: '0.5px solid #bdc3c7', 
                                    width: '20%',
                                    fontWeight: 'bold'
                                }}>মোট</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageItems.map((item, i) => (
                                <tr key={i}>
                                    <td style={{ 
                                        padding: '2mm', 
                                        border: '0.5px solid #bdc3c7', 
                                        textAlign: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {englishToBengali(((pageNumber - 1) * 10) + i + 1)}
                                    </td>
                                    <td style={{ 
                                        padding: '2mm', 
                                        border: '0.5px solid #bdc3c7',
                                        fontWeight: 'bold'
                                    }}>{item.product.name}</td>                                
                                    <td style={{ 
                                        padding: '2mm', 
                                        border: '0.5px solid #bdc3c7', 
                                        textAlign: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {englishToBengali(item.quantity)} {getProductType(item.product_type)}
                                    </td>
                                    <td style={{ 
                                        padding: '2mm', 
                                        border: '0.5px solid #bdc3c7', 
                                        textAlign: 'right',
                                        fontWeight: 'bold'
                                    }}>
                                        ৳{englishToBengali(item.price)}
                                    </td>
                                    <td style={{ 
                                        padding: '2mm', 
                                        border: '0.5px solid #bdc3c7', 
                                        textAlign: 'right',
                                        fontWeight: 'bold'
                                    }}>
                                        ৳{englishToBengali(item.subTotal)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            {isLastPage ? (
                                <>
                                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                                        <td colSpan="4" style={{ padding: '1mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                            <strong>Subtotal:</strong>
                                        </td>
                                        <td style={{ padding: '1mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                            <strong>৳{englishToBengali(fullSubtotal)}</strong>
                                        </td>
                                    </tr>
                                    
                                    {discountAmount > 0 && (
                                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                                            <td colSpan="4" style={{ padding: '1mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                                <strong>(-) কমিশন:</strong>
                                            </td>
                                            <td style={{ padding: '1mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                                <strong>৳{englishToBengali(discountAmount)}</strong>
                                            </td>
                                        </tr>
                                    )}
                                    
                                    {additionalPrice > 0 && (
                                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                                            <td colSpan="4" style={{ padding: '1mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                                <strong>(+) ট্রাঃ খরচ:</strong>
                                            </td>
                                            <td style={{ padding: '1mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                                <strong>৳{englishToBengali(additionalPrice)}</strong>
                                            </td>
                                        </tr>
                                    )}
                                    
                                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                                        <td colSpan="4" style={{ padding: '1mm', border: '0.5px solid #bdc3c7', textAlign: 'right', borderTop: '2px solid #000' }}>
                                            <strong>Total Amount:</strong>
                                        </td>
                                        <td style={{ padding: '1mm', border: '0.5px solid #bdc3c7', textAlign: 'right', borderTop: '2px solid #000' }}>
                                            <strong>৳{englishToBengali(bill.total)}</strong>
                                        </td>
                                    </tr>
                                </>
                            ) : (
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <td colSpan="4" style={{ padding: '1mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                        <strong>Page Total:</strong>
                                    </td>
                                    <td style={{ padding: '1mm', border: '0.5px solid #bdc3c7', textAlign: 'right' }}>
                                        <strong>৳{englishToBengali(pageItems.reduce((sum, item) => sum + item.subTotal, 0))}</strong>
                                    </td>
                                </tr>
                            )}
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
                                    <p style={{ margin: '2mm 0 0 0' }}>ক্রেতার স্বাক্ষর</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ borderTop: '0.5px solid #000', width: '35mm', margin: '0 auto' }}></div>
                                    <p style={{ margin: '2mm 0 0 0' }}>বিক্রেতার স্বাক্ষর</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{ 
                                textAlign: 'center', 
                                marginTop: '6mm',
                                color: '#000',
                                fontSize: '9px'
                            }}>
                                <p style={{ margin: '0' }}>নামাজ বেহেশতের চাবি</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }

    const renderBillPages = (items, copyType) => {
        const ITEMS_PER_PAGE = 10;
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
        <Box display="flex" alignItems="center" gap={2}>
            <Button
                variant='contained'
                color='primary'
                startIcon={<GetAppIcon />}
                onClick={handlePdfGeneration}
            >
                Download Bill
            </Button>
            <TextField
                type="date"
                size="small"
                value={manualDate}
                onChange={(e) => {
                    setManualDate(e.target.value)
                    setUseManualDate(true)
                }}
                InputLabelProps={{
                    shrink: true,
                }}
                sx={{ 
                    width: '200px',
                    '& .MuiOutlinedInput-root': {
                        height: '40px'
                    }
                }}
            />

            <div style={{ display: 'none' }}>
                <div ref={billRef}>
                    {renderBillPages(items, "MAIN COPY")}
                    {renderBillPages(items, "CUSTOMER COPY")}
                </div>
            </div>
        </Box>
    )
}

export default PrintBill