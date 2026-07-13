import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { 
  checkCoupon, createOrder, updateOrderPayment, 
  createInvoice, logActivity 
} from '@/lib/services'

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, productName, price, discountPrice, couponCode, paymentMethod } = body

    if (!productId || !price) {
      return NextResponse.json({ error: 'Missing product or price parameters' }, { status: 400 })
    }

    // 2. Calculate amounts
    const currentPrice = discountPrice || price
    let discountAmount = price - currentPrice
    let payableAmount = currentPrice

    // Apply coupon if provided
    let appliedCode = null
    if (couponCode) {
      const coupon = await checkCoupon(couponCode)
      if (coupon) {
        const couponDeduction = currentPrice * (coupon.discountPercent / 100)
        discountAmount += couponDeduction
        payableAmount = currentPrice - couponDeduction
        appliedCode = coupon.code
      }
    }

    payableAmount = Math.round(payableAmount)

    // 3. Create database transaction records
    const order = await createOrder({
      userId: user.id,
      totalAmount: price,
      discountAmount,
      payableAmount,
      couponCode: appliedCode
    })

    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(-4)}`
    await updateOrderPayment(order.id, {
      method: paymentMethod || 'UPI',
      status: 'captured',
      transactionId,
      amount: payableAmount
    })

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`
    const invoice = await createInvoice({
      orderId: order.id,
      invoiceNumber,
      billingAddress: user.college || ' PSG College of Technology, Coimbatore, Tamil Nadu',
      pdfUrl: `/invoices/${invoiceNumber}.pdf`
    })

    // 4. Log security activity
    await logActivity(
      user.id,
      `Purchased premium resource: ${productName} (Paid: ₹${payableAmount})`,
      'TRANSACT_EVENT'
    )

    return NextResponse.json({
      success: true,
      orderId: order.id,
      invoiceNumber: invoice.invoiceNumber,
      productName,
      amount: payableAmount,
      method: paymentMethod || 'UPI',
      date: new Date().toLocaleDateString(),
      email: user.email
    })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal checkout transaction error' }, { status: 500 })
  }
}
