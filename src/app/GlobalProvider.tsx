import React from 'react'
import { CartProvider } from '@/context/CartContext'
import { ModalCartProvider } from '@/context/ModalCartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { ModalWishlistProvider } from '@/context/ModalWishlistContext'
import { CompareProvider } from '@/context/CompareContext'
import { ModalCompareProvider } from '@/context/ModalCompareContext'
import { ModalSearchProvider } from '@/context/ModalSearchContext'
import { ModalQuickviewProvider } from '@/context/ModalQuickviewContext'
import { ModalEnquiryProvider } from '@/context/ModalEnquiryContext'

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <CartProvider>
            <ModalCartProvider>
                <WishlistProvider>
                    <ModalWishlistProvider>
                        <CompareProvider>
                            <ModalCompareProvider>
                                <ModalSearchProvider>
                                    <ModalQuickviewProvider>
                                        <ModalEnquiryProvider>
                                            {children}
                                        </ModalEnquiryProvider>
                                    </ModalQuickviewProvider>
                                </ModalSearchProvider>
                            </ModalCompareProvider>
                        </CompareProvider>
                    </ModalWishlistProvider>
                </WishlistProvider>
            </ModalCartProvider>
        </CartProvider>
    )
}

export default GlobalProvider