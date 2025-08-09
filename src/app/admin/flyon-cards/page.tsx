'use client'

import React from 'react'
import { PageWrapper } from '@/components/layout'
import FlyonCardExamples from '@/components/examples/FlyonCardExamples'

const FlyonCardsPage = () => {
    return (
        <PageWrapper maxWidth="full" spacing="xl">
            <FlyonCardExamples />
        </PageWrapper>
    )
}

export default FlyonCardsPage
