import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Layout from '../components/Layout';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al registrarse');
            }

            // Auto-login after successful registration
            const loginResult = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (loginResult?.error) {
                // Should not happen if registration was successful
                router.push('/login');
            } else {
                router.push('/');
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center bg-brand-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[32px] shadow-premium">
                    <div>
                        <div className="mx-auto h-12 w-12 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-secondary/20">
                            D
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-black text-brand-gray-900 tracking-tight">
                            Crea tu cuenta
                        </h2>
                        <p className="mt-2 text-center text-sm text-brand-gray-500 font-medium">
                            ¿Ya tienes cuenta?{' '}
                            <Link href="/login" className="font-bold text-primary hover:text-secondary transition-colors">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold text-center animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="sr-only">Nombre Completo</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-brand-gray-200 placeholder-brand-gray-400 text-brand-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent focus:z-10 sm:text-sm font-medium transition-all"
                                    placeholder="Nombre Completo"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-brand-gray-200 placeholder-brand-gray-400 text-brand-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent focus:z-10 sm:text-sm font-medium transition-all"
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Contraseña</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-brand-gray-200 placeholder-brand-gray-400 text-brand-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent focus:z-10 sm:text-sm font-medium transition-all"
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="sr-only">Confirmar Contraseña</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-brand-gray-200 placeholder-brand-gray-400 text-brand-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent focus:z-10 sm:text-sm font-medium transition-all"
                                    placeholder="Confirmar contraseña"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all shadow-lg shadow-secondary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                        <svg className="h-5 w-5 text-white/50 group-hover:text-white transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                        </svg>
                                    </span>
                                )}
                                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
