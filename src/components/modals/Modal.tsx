'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal, resetModal } from '@/store/slices/modalSlice'
import type { RootState } from '@/store'
import styles from './Modal.module.css'
import { MODAL_REGISTRY, MODAL_ANIMATION } from './registry'

export default function Modal() {
    const dispatch = useDispatch()
    const pathname = usePathname()
    const { isOpen, type, props, options } = useSelector((s: RootState) => s.modal)
    const { disableOverlayClose, hideCloseButton } = options
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const wasOpenRef = useRef(false)  // ← tracks previous isOpen without causing re-renders

    // useEffect(() => {
    //     dispatch(resetModal())
    // }, [pathname])

    useEffect(() => {
        // only trigger reset when transitioning from open → closed
        if (wasOpenRef.current === true && isOpen === false) {
            timerRef.current = setTimeout(() => {
                dispatch(resetModal())
            }, 300)
        }

        wasOpenRef.current = isOpen

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [isOpen])  // ← removed dispatch from deps, it never changes

    if (!type) return null

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disableOverlayClose) return
        // if (isSidePanel) return
        if (e.target === e.currentTarget) dispatch(closeModal())
    }

    const ContentComponent = MODAL_REGISTRY[type]
    const animStyle = MODAL_ANIMATION[type] ?? 'bottom-sheet'
    const animClass = animStyle === 'bottom-sheet' ? styles.bottomSheet : styles.sidePanel
    const isSidePanel = animStyle === 'side-panel'
    const panelState = isOpen ? styles.entering : styles.leaving

    return (
        <div
            className={`${styles.overlay} ${isOpen ? styles.overlayVisible : styles.overlayHidden} ${isSidePanel ? styles.sidePanelOverlay : ''}`}
            onClick={(e) =>  handleOverlayClick(e) }
        >
            <div className={`${styles.panel} ${animClass} ${panelState}`}>

                {!hideCloseButton && (
                    <button
                        className={`${styles.closeBtn} ${isSidePanel ? styles.closeBtnInline : ''}`}
                        onClick={() => dispatch(closeModal())}
                        aria-label="Close"
                    >
                        <span />
                        <span />
                    </button>
                )}

                <div className={styles.content}>
                    {ContentComponent ? <ContentComponent {...props} /> : null}
                </div>
            </div>
        </div>
    )
}