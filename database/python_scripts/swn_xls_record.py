class swnXlsRecord():
    def __init__(self, country, region, kiosk, consumerBase, customerAccountId, customerDate, customerTime,
                 customerActive, customerName, customerSalesChannel, customerType, customerConsumerBase, customerIncome, customerDistance,
                 receiptId, receiptDate, receiptTime, receiptCurrency, receiptAccount, receiptSalesChannel,
                 receiptCash, receiptMobile, receiptCard, receiptTotal,
                 receiptItemId, receiptItemReceipt, receiptItemProduct, receiptItemPrice, receiptItemQuantity,
                 productId, productName, productPrice, productCurrency, productUnitAmount ):
        self.country = country
        self.region = region
        self.kiosk = kiosk
        self.consumerBase = consumerBase

        self.customerAccountId = customerAccountId
        self.customerDate = customerDate
        self.customerTime = customerTime
        self.customerActive = customerActive
        self.customerName = customerName
        self.customerSalesChannel = customerSalesChannel
        self.customerType = customerType
        self.customerConsumerBase = customerConsumerBase
        self.customerIncome = customerIncome
        self.customerDistance = customerDistance

        self.receiptId = receiptId
        self.receiptDate = receiptDate
        self.receiptTime = receiptTime
        self.receiptCurrency = receiptCurrency
        self.receiptAccount = receiptAccount
        self.receiptSalesChannel = receiptSalesChannel
        self.receiptCash = receiptCash
        self.receiptMobile = receiptMobile
        self.receiptCard = receiptCard
        self.receiptTotal = receiptTotal

        self.receiptItemId = receiptItemId
        self.receiptItemReceipt = receiptItemReceipt
        self.receiptItemProduct = receiptItemProduct
        self.receiptItemPrice = receiptItemPrice
        self.receiptItemQuantity = receiptItemQuantity

        self.productId = productId
        self.productName = productName
        self.productPrice = productPrice
        self.productCurrency = productCurrency
        self.productUnitAmount = productUnitAmount

