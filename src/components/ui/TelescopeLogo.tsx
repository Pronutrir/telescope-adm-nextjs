import React from 'react'

interface TelescopeLogoProps {
    className?: string
    size?: number
}

export const TelescopeLogo: React.FC<TelescopeLogoProps> = ({
    className = '',
    size = 32
}) => {
    return (
        <svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            width={size}
            height={size}
            fill="currentColor"
        >
            {/* Main telescope body */}
            <rect x="6" y="10" width="12" height="4" rx="2" fill="currentColor" />

            {/* Telescope eyepiece */}
            <rect x="4" y="11" width="3" height="2" rx="1" fill="currentColor" />

            {/* Telescope lens */}
            <circle cx="19" cy="12" r="2" fill="currentColor" />
            <circle cx="19" cy="12" r="1" fill="white" />

            {/* Telescope mount */}
            <line x1="12" y1="14" x2="8" y2="20" stroke="currentColor" strokeWidth="1.5" />
            <line x1="12" y1="14" x2="16" y2="20" stroke="currentColor" strokeWidth="1.5" />

            {/* Stars decoration */}
            <circle cx="6" cy="6" r="0.5" fill="currentColor" />
            <circle cx="18" cy="5" r="0.5" fill="currentColor" />
            <circle cx="4" cy="18" r="0.5" fill="currentColor" />
        </svg>
    )
}

export default TelescopeLogo
