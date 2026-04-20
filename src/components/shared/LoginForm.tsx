"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch, RootState } from "@/store";
import { sendOtp, verifyOtp, resetAuth } from "@/store/slices/authSlice"; // Adjust path if needed
import { phoneSchema, otpSchema, PhoneFormData, OtpFormData } from "@/schemas/authSchemas"; // Adjust path if needed
import { closeModal } from "@/store/slices/modalSlice";

const LoginForm = () => {
    const dispatch = useDispatch<AppDispatch>();

    // UI State
    const isAuthModalOpen = useSelector((state: RootState) => state.ui.isAuthModalOpen);

    // Auth State
    const { isAuthenticated, step, phone, loading, error } = useSelector((state: RootState) => state.auth);

    // Form setup for Phone step
    const {
        register: registerPhone,
        handleSubmit: handlePhoneSubmit,
        formState: { errors: phoneErrors },
        reset: resetPhoneForm
    } = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema),
    });

    // Form setup for OTP step
    const {
        register: registerOtp,
        handleSubmit: handleOtpSubmit,
        formState: { errors: otpErrors },
        reset: resetOtpForm
    } = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
    });

    // Close modal when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            handleCloseModal();
        }
    }, [isAuthenticated]);

    const handleCloseModal = () => {
        dispatch(closeModal());
        // Optional: Reset form states when modal closes completely
        setTimeout(() => {
            // dispatch(resetAuth());
            resetPhoneForm();
            resetOtpForm();
        }, 300);
    };

    const handleBackClick = () => {
        if (step === 'OTP') {
            dispatch(resetAuth()); // Go back to phone input
        } else {
            handleCloseModal(); // Close modal entirely
        }
    };

    const onPhoneSubmit = (data: PhoneFormData) => {
        // Combine the hardcoded country code with the 10-digit number
        const fullPhoneNumber = `+91${data.phone}`;
        dispatch(sendOtp(data.phone));
    };

    const onOtpSubmit = (data: OtpFormData) => {
        if (phone) {
            dispatch(verifyOtp({country: 'IN', phone: phone, otp: data.otp }));
        }
    };

    if (isAuthenticated) return null;

    return (
        <div className="flex flex-col h-full">
            <button
                onClick={handleBackClick}
                className="size-12 bg-gray-100 rounded-full text-lg flex items-center justify-center shrink-0"
                disabled={loading}
            >
                <i className="fa-solid fa-arrow-left-long"></i>
            </button>

            <div className="flex flex-col flex-1 mt-6">
                <h6 className="text-lg font-medium text-gray-900 mb-5 text-center">
                    {step === 'PHONE' ? 'Log In or Sign Up' : 'Verify Mobile Number'}
                </h6>

                {/* Backend Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
                        {error}
                    </div>
                )}

                {step === 'PHONE' && (
                    <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="flex flex-col gap-2">
                        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-brand transition-all duration-200">
                            <div className="pl-4 py-3 font-bold text-gray-800 flex items-center gap-2">
                                <span>+91</span>
                            </div>
                            <input
                                type="tel"
                                {...registerPhone('phone')}
                                disabled={loading}
                                className="flex-1 w-full border-none outline-none px-4 py-2 text-gray-900 placeholder-gray-400 font-bold tracking-wider bg-transparent disabled:opacity-50"
                                placeholder="Enter mobile number"
                                maxLength={10}
                                autoComplete="tel"
                            />
                        </div>
                        {phoneErrors.phone && (
                            <span className="text-red-500 text-xs font-medium pl-1 mb-2">
                                {phoneErrors.phone.message}
                            </span>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand text-white py-3.5 rounded-xl font-bold transition-transform duration-200 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-2"
                        >
                            {loading ? 'Sending...' : 'Continue'}
                        </button>
                    </form>
                )}

                {step === 'OTP' && (
                    <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="flex flex-col gap-2">
                        <p className="text-center text-sm text-gray-500 mb-4">
                            Enter the 6-digit code sent to <br />
                            <span className="font-bold text-gray-800 tracking-wider">{phone}</span>
                        </p>

                        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-brand transition-all duration-200">
                            <input
                                type="text" // Changed to text to prevent up/down arrows in some browsers, pattern handles numeric
                                inputMode="numeric"
                                {...registerOtp('otp')}
                                disabled={loading}
                                className="flex-1 w-full border-none outline-none px-4 py-3 text-center text-gray-900 placeholder-gray-400 font-bold tracking-[0.5em] text-lg bg-transparent disabled:opacity-50"
                                placeholder="••••"
                                maxLength={4}
                                autoComplete="one-time-code"
                            />
                        </div>
                        {otpErrors.otp && (
                            <span className="text-red-500 text-xs font-medium text-center mb-2">
                                {otpErrors.otp.message}
                            </span>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand text-white py-3.5 rounded-xl font-bold transition-transform duration-200 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-2"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                )}
            </div>

            <div className="mt-auto pt-6 text-center">
                <p className="text-xs text-gray-500 leading-relaxed">
                    By continuing, you agree to our <br />
                    <a href="#" className="text-gray-800 font-semibold hover:underline"> Terms of Service</a> &
                    <a href="#" className="text-gray-800 font-semibold hover:underline"> Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;