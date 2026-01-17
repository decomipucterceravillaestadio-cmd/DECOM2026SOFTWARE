'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    IconAlertTriangle,
    IconLock,
    IconTrash,
    IconX,
    IconEye,
    IconEyeOff,
    IconFileDescription
} from '@tabler/icons-react'
import { Button } from '@/app/components/UI/Button'

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (password: string, reason: string) => Promise<void>
    itemName: string
    isDeleting: boolean
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    isDeleting
}: DeleteConfirmationModalProps) {
    const [password, setPassword] = useState('')
    const [reason, setReason] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!password.trim()) {
            setError('Por favor ingresa tu contraseña para confirmar')
            return
        }

        if (!reason.trim() || reason.length < 5) {
            setError('Por favor indica un motivo válido (mínimo 5 caracteres)')
            return
        }

        try {
            await onConfirm(password, reason)
        } catch (err) {
            // El error lo manejará el componente padre, pero aquí podemos mostrar feedback visual si es necesario
            console.error(err)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[60] px-4">
                    {/* Backdrop con blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isDeleting ? onClose : undefined}
                        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
                    >
                        {/* Header de Peligro */}
                        <div className="bg-red-50 dark:bg-red-900/20 px-6 py-4 flex items-center gap-3 border-b border-red-100 dark:border-red-900/30">
                            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
                                <IconAlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-red-700 dark:text-red-400">
                                    Eliminar Solicitud
                                </h3>
                                <p className="text-xs text-red-600/80 dark:text-red-400/70 font-medium">
                                    Esta acción requiere confirmación de seguridad
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                disabled={isDeleting}
                                className="ml-auto p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 dark:text-red-400 transition-colors disabled:opacity-50"
                            >
                                <IconX className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="text-center mb-6">
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Estás a punto de archivar la solicitud:
                                </p>
                                <p className="font-bold text-neutral-900 dark:text-neutral-100 mt-1 text-base">
                                    "{itemName}"
                                </p>
                            </div>

                            {/* Campo Motivo */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <IconFileDescription className="w-3.5 h-3.5" />
                                    Motivo de eliminación
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Ej: Duplicada, Cancelada por el comité..."
                                    rows={2}
                                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none text-sm"
                                    disabled={isDeleting}
                                />
                            </div>

                            {/* Campo Contraseña */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <IconLock className="w-3.5 h-3.5" />
                                    Contraseña de confirmación
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Ingresa tu contraseña actual"
                                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-sm"
                                        disabled={isDeleting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                                    >
                                        {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Mensaje de Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
                                >
                                    <IconAlertTriangle className="w-4 h-4 shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            {/* Botones de Acción */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={isDeleting}
                                    className="flex-1 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isDeleting || !password || !reason}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 border-red-500"
                                >
                                    {isDeleting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Procesando...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <IconTrash className="w-4 h-4" />
                                            <span>Confirmar Eliminación</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
