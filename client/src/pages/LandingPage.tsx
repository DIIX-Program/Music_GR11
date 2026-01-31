import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="text-xl font-bold text-white">StreamFlow</span>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            Music for<br />
                            <span className="text-green-500">everyone.</span>
                        </h1>
                        <p className="text-xl text-zinc-400 mb-10 max-w-xl mx-auto">
                            Stream millions of songs. Build playlists. Discover new artists. All for free.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block bg-green-500 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-green-400 transition-colors"
                        >
                            Get Started Free →
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 bg-zinc-950">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Why StreamFlow?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Ad-free Music", desc: "Listen without any interruptions." },
                            { title: "High Quality Audio", desc: "Crystal clear sound, always." },
                            { title: "Offline Mode", desc: "Download and listen anywhere." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 rounded-xl bg-zinc-900 border border-zinc-800"
                            >
                                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                <p className="text-zinc-400 text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
                    <p className="text-zinc-400 mb-12">Free forever. Premium when you need it.</p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-xl bg-zinc-900 border border-zinc-800 text-left">
                            <h3 className="text-xl font-bold mb-2">Free</h3>
                            <p className="text-3xl font-bold mb-4">$0 <span className="text-sm text-zinc-500 font-normal">/month</span></p>
                            <ul className="text-zinc-400 text-sm space-y-2">
                                <li>• Unlimited streaming</li>
                                <li>• Create playlists</li>
                                <li>• Basic audio quality</li>
                            </ul>
                        </div>
                        <div className="p-8 rounded-xl bg-green-500/10 border border-green-500/30 text-left">
                            <h3 className="text-xl font-bold mb-2 text-green-500">Premium</h3>
                            <p className="text-3xl font-bold mb-4">$9.99 <span className="text-sm text-zinc-500 font-normal">/month</span></p>
                            <ul className="text-zinc-400 text-sm space-y-2">
                                <li>• Everything in Free</li>
                                <li>• No ads</li>
                                <li>• High-quality audio</li>
                                <li>• Offline downloads</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-zinc-950">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
                    <p className="text-zinc-400 mb-8">Join millions of listeners today.</p>
                    <Link
                        to="/register"
                        className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-colors"
                    >
                        Sign up for free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-zinc-800">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="text-lg font-bold">StreamFlow</span>
                    <div className="flex gap-6 text-sm text-zinc-400">
                        <a href="#" className="hover:text-white">About</a>
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Contact</a>
                    </div>
                    <span className="text-xs text-zinc-500">© 2026 StreamFlow. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
