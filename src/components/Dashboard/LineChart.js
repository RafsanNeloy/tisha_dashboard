import React from 'react'
import { Container, CircularProgress } from '@material-ui/core'
import Chart from "react-google-charts"
import { useSelector } from 'react-redux'
import moment from 'moment'

const LineChart = (props) => {
    const bills = useSelector(state => state.bills)
    const user = useSelector(state => state.user)

    const getDates = (start, end) => {
        const dates = []
        while (start.isSameOrBefore(end)){
            dates.push(start.toString())
            start.add(1,'days').endOf('day')
        }
        return dates
    } 

    const calculateTotal = (data) => {
        let total = 0
        data.forEach(bill => {
            total = bill.total + total
        })
        return total
    }

    const billDailyWise = () => {
        const dayWiseBills = []
        const dates = getDates(moment(user.createdAt).startOf('day'), moment().endOf('day'))
        dates.forEach(date => {
            const dailyBill = {}
            const getBills = bills.filter(bill => moment(bill.createdAt).isSame(date, 'day'))
            dailyBill[moment(date).toString()] = calculateTotal(getBills)
            dayWiseBills.push(dailyBill)
        })
        return dayWiseBills
    }

    const chartData = billDailyWise().map(bill => {
        return [moment(Object.keys(bill)[0]).format('Do MMM'), Object.values(bill)[0]]
    })
    chartData.unshift()

    return (
        <Container>
            <Chart 
                width={'100%'}  
                height={'300px'}
                chartType='Line'
                loader={<CircularProgress />}      
                data={[['date', 'Amount received'],...chartData]}   
                options={{
                    chart: {
                      title: 'Amount received on Daily basis',
                      subtitle: 'in INR',
                    },
                    vAxis: {
                        title: 'Amount received'
                    },
                    hAxis: {
                        title: 'Day'
                    }
                }} 

            />
        </Container>
    )
}

export default LineChart