'use client'

import React from 'react'
import { MainLayout, PageWrapper } from '@/components/layout'
import FlyonCardExamples from '@/components/examples/FlyonCardExamples'

const FlyonCardsPage = () => {
    return (
        <MainLayout>
            <PageWrapper maxWidth="full" spacing="xl">
                <FlyonCardExamples />
            </PageWrapper>
        </MainLayout>
    )
}

export default FlyonCardsPage
