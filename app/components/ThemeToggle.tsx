'use client'

import * as React from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-xl bg-dashboard-card border border-dashboard-card-border" />
        )
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-dashboard-card border border-dashboard-card-border text-dashboard-text-secondary hover:text-[#F49E2C] hover:border-[#F49E2C]/30 transition-all group relative overflow-hidden shadow-sm"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                    <motion.div
                        key="sun"
                        initial={{ y: 20, opacity: 0, rotate: -90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <IconSun className="w-5 h-5 text-[#F49E2C]" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ y: 20, opacity: 0, rotate: 90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -20, opacity: 0, rotate: -90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <IconMoon className="w-5 h-5 text-decom-primary" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    )
}
