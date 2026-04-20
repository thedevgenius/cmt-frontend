// components/Modal/registry.ts
import type { ComponentType } from 'react'
import LoginForm from '../shared/LoginForm'
import LocationSelect from '../shared/LocationSelect'
import ProfileUpdateModal from '../shared/ProfileUpdateModal'

export const MODAL_REGISTRY: Record<string, ComponentType<any>> = {
    'locationSelect': LocationSelect,
    'loginForm': LoginForm,
    'profileUpdate': ProfileUpdateModal,
}

// Controls which animation each modal type uses
export const MODAL_ANIMATION: Record<string, 'bottom-sheet' | 'side-panel'> = {
    'loginForm': 'side-panel',
    // 'profileUpdate': 'side-panel',
}