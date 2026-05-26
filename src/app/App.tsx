import { useState, useEffect } from 'react';
import { Check, User, Mail, Calendar, Shield, ArrowLeft } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'signup' | 'login' | 'otp' | 'success' | 'profile'>('welcome');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'google'>('email');

  const handleSignUpClick = () => setCurrentScreen('signup');
  const handleLoginClick = () => setCurrentScreen('login');
  const handleBack = () => {
    if (currentScreen === 'signup' || currentScreen === 'login') {
      setCurrentScreen('welcome');
    } else if (currentScreen === 'otp') {
      setCurrentScreen('signup');
    } else if (currentScreen === 'success') {
      setCurrentScreen('welcome');
    } else if (currentScreen === 'profile') {
      setCurrentScreen('success');
    }
  };

  const handleGoogleAuth = () => {
    // Simulate Google OAuth
    setAuthMethod('google');
    setFormData({
      fullName: 'Demo User',
      email: 'demo@gmail.com',
      password: ''
    });
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setCurrentScreen('success');
    }, 1500);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMethod('email');
    setCurrentScreen('otp');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMethod('email');
    setCurrentScreen('otp');
  };

  const handleVerifyOTP = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setCurrentScreen('success');
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-advance to next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Auto-submit when all digits are filled
      if (index === 5 && value) {
        const filledOtp = [...newOtp.slice(0, 5), value];
        if (filledOtp.every(digit => digit !== '')) {
          setTimeout(() => handleVerifyOTP(), 300);
        }
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.every(digit => digit !== '') && currentScreen === 'otp' && !isVerifying) {
      handleVerifyOTP();
    }
  }, [otp, currentScreen, isVerifying]);

  return (
    <div className="size-full flex items-center justify-center bg-gray-50">
      {/* Mobile iPhone Frame */}
      <div className="relative w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[14px] border-black">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] h-[30px] bg-black rounded-b-[1.5rem] z-50"></div>

        {/* Screen Content */}
        <div className="h-full pt-12 pb-8 px-6 overflow-y-auto bg-white">
          {/* Back Button */}
          {currentScreen !== 'welcome' && (
            <button
              onClick={handleBack}
              className="mb-4 p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}

          {currentScreen === 'welcome' && (
            <WelcomeScreen
              onSignUpClick={handleSignUpClick}
              onLoginClick={handleLoginClick}
              onGoogleAuth={handleGoogleAuth}
              isVerifying={isVerifying}
            />
          )}
          {currentScreen === 'signup' && (
            <SignUpScreen
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateAccount}
              onGoogleAuth={handleGoogleAuth}
              isVerifying={isVerifying}
            />
          )}
          {currentScreen === 'login' && (
            <LoginScreen
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleLogin}
              onGoogleAuth={handleGoogleAuth}
              isVerifying={isVerifying}
            />
          )}
          {currentScreen === 'otp' && (
            <OTPScreen
              otp={otp}
              onOtpChange={handleOtpChange}
              onOtpKeyDown={handleOtpKeyDown}
              isVerifying={isVerifying}
            />
          )}
          {currentScreen === 'success' && (
            <SuccessScreen onContinue={() => setCurrentScreen('profile')} />
          )}
          {currentScreen === 'profile' && (
            <ProfileScreen formData={formData} authMethod={authMethod} />
          )}
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({
  onSignUpClick,
  onLoginClick,
  onGoogleAuth,
  isVerifying
}: {
  onSignUpClick: () => void;
  onLoginClick: () => void;
  onGoogleAuth: () => void;
  isVerifying: boolean;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-between py-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-[#4F46E5] flex items-center justify-center mb-8 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        {/* Illustration */}
        <div className="w-full max-w-[280px] mb-8">
          <img
            src="https://images.unsplash.com/photo-1551651653-c5186a1fbba2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
            alt="Productivity illustration"
            className="w-full h-auto rounded-2xl shadow-md"
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl mb-3 text-gray-900">Welcome</h1>
        <p className="text-base text-gray-500 mb-8">Get started with your productivity journey</p>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={onGoogleAuth}
          disabled={isVerifying}
          className="w-full py-4 bg-white text-gray-700 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isVerifying ? 'Signing in...' : 'Continue with Google'}
        </button>

        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button
          onClick={onSignUpClick}
          className="w-full py-4 bg-[#4F46E5] text-white rounded-2xl shadow-lg hover:bg-[#4338CA] transition-colors"
        >
          Sign Up
        </button>
        <button
          onClick={onLoginClick}
          className="w-full py-4 bg-white text-gray-700 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
        >
          Log In
        </button>
      </div>
    </div>
  );
}

function SignUpScreen({
  formData,
  setFormData,
  onSubmit,
  onGoogleAuth,
  isVerifying
}: {
  formData: { fullName: string; email: string; password: string };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleAuth: () => void;
  isVerifying: boolean;
}) {
  return (
    <div className="h-full flex flex-col py-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2 text-gray-900">Sign Up</h1>
        <p className="text-base text-gray-500">Create your account to get started</p>
      </div>

      <button
        onClick={onGoogleAuth}
        disabled={isVerifying}
        className="w-full py-4 bg-white text-gray-700 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-center gap-3 mb-4 disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isVerifying ? 'Signing up...' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-3 py-3">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-sm text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <form onSubmit={onSubmit} className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a password"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              required
            />
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#4F46E5] text-white rounded-2xl shadow-lg hover:bg-[#4338CA] transition-colors mt-6"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

function LoginScreen({
  formData,
  setFormData,
  onSubmit,
  onGoogleAuth,
  isVerifying
}: {
  formData: { fullName: string; email: string; password: string };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleAuth: () => void;
  isVerifying: boolean;
}) {
  return (
    <div className="h-full flex flex-col py-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2 text-gray-900">Log In</h1>
        <p className="text-base text-gray-500">Welcome back! Sign in to continue</p>
      </div>

      <button
        onClick={onGoogleAuth}
        disabled={isVerifying}
        className="w-full py-4 bg-white text-gray-700 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-colors flex items-center justify-center gap-3 mb-4 disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isVerifying ? 'Logging in...' : 'Continue with Google'}
      </button>

      <div className="flex items-center gap-3 py-3">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-sm text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      <form onSubmit={onSubmit} className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all"
              required
            />
          </div>

          <button type="button" className="text-sm text-[#4F46E5] hover:underline">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#4F46E5] text-white rounded-2xl shadow-lg hover:bg-[#4338CA] transition-colors mt-6"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

function OTPScreen({
  otp,
  onOtpChange,
  onOtpKeyDown,
  isVerifying
}: {
  otp: string[];
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent) => void;
  isVerifying: boolean;
}) {
  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="h-full flex flex-col py-8">
      <div className="mb-8">
        <h1 className="text-3xl mb-2 text-gray-900">Verification</h1>
        <p className="text-base text-gray-500">We sent a code to your email</p>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <label className="block text-sm text-gray-700 mb-4">Enter 6-digit code</label>
          <div className="flex gap-2 justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => onOtpChange(index, e.target.value)}
                onKeyDown={(e) => onOtpKeyDown(index, e)}
                disabled={isVerifying}
                className={`w-12 h-14 text-center text-xl bg-gray-50 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all ${
                  digit ? 'border-[#4F46E5] bg-blue-50' : 'border-gray-200'
                } ${isVerifying ? 'opacity-50' : ''}`}
              />
            ))}
          </div>

          {isVerifying && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-5 h-5 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Verifying...</span>
            </div>
          )}

          <p className="text-sm text-gray-500 text-center">
            Didn't receive the code?{' '}
            <button type="button" className="text-[#4F46E5] hover:underline">
              Resend
            </button>
          </p>
        </div>

        {isComplete && !isVerifying && (
          <div className="text-center text-sm text-green-600 mb-4">
            Code complete! Verifying...
          </div>
        )}
      </div>
    </div>
  );
}

function SuccessScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-8">
      {/* Success Checkmark */}
      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-8 relative">
        <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* Success Message */}
      <h1 className="text-3xl mb-3 text-gray-900">Account Created Successfully!</h1>
      <p className="text-base text-gray-500 mb-12 max-w-[280px]">
        Welcome aboard! Your account has been created and you're ready to start your productivity journey.
      </p>

      {/* CTA Button */}
      <button
        onClick={onContinue}
        className="w-full py-4 bg-[#4F46E5] text-white rounded-2xl shadow-lg hover:bg-[#4338CA] transition-colors"
      >
        View Profile
      </button>
    </div>
  );
}

function ProfileScreen({
  formData,
  authMethod
}: {
  formData: { fullName: string; email: string; password: string };
  authMethod: 'email' | 'google';
}) {
  const joinDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="h-full flex flex-col py-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2 text-gray-900">Profile Details</h1>
        <p className="text-base text-gray-500">Your account information</p>
      </div>

      <div className="flex-1 space-y-4">
        {/* Profile Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
            <span className="text-white text-2xl">
              {formData.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <h2 className="text-xl text-gray-900">{formData.fullName}</h2>
            <p className="text-sm text-gray-500">Member</p>
          </div>
        </div>

        {/* Detail Cards */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-base text-gray-900">{formData.fullName}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-base text-gray-900">{formData.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-base text-gray-900">{joinDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Authentication Method</p>
                <p className="text-base text-gray-900 flex items-center gap-2">
                  {authMethod === 'google' ? (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google Account
                    </>
                  ) : (
                    <>Email & Password</>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100 mt-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-[#4F46E5]" />
              </div>
              <div>
                <p className="text-sm text-gray-900 mb-1">Account Status</p>
                <p className="text-xs text-gray-600">
                  Your account is active and verified. You have full access to all features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="w-full py-4 bg-[#4F46E5] text-white rounded-2xl shadow-lg hover:bg-[#4338CA] transition-colors mt-6">
        Get Started
      </button>
    </div>
  );
}