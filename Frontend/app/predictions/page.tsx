'use client'

import { motion, AnimatePresence } from 'framer-motion'
import AppLayout from '@/components/layout/app-layout'
import { useState } from 'react'
import {
    LineChart,
    TrendingUp,
    Calendar,
    Database,
    Cpu,
    ArrowRight,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function PredictionsPage() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<null | {
        rendement_predit_pct: number
        periode: string
        nb_lignes_utilisees: number
        modele: string
    }>(null)

    const simulatePrediction = async () => {
        setLoading(true)
        setResult(null)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2500))

        setResult({
            rendement_predit_pct: 84.2156,
            periode: "2026-02",
            nb_lignes_utilisees: 24,
            modele: "Ridge"
        })
        setLoading(false)
    }

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Page Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20 mb-4"
                    >
                        <Cpu className="w-4 h-4" />
                        Machine Learning Engine v2.0
                    </motion.div>
                    <motion.h1
                        className="text-5xl font-extrabold tracking-tight text-foreground"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Future Yield <span className="text-primary italic">Prediction</span>
                    </motion.h1>
                    <motion.p
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Leverage advanced regression models to forecast your production performance for the upcoming months.
                    </motion.p>
                </div>

                {/* Action Button Section */}
                {!result && !loading && (
                    <motion.div
                        className="flex justify-center py-12"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <button
                            onClick={simulatePrediction}
                            className="group relative px-10 py-6 bg-primary text-primary-foreground rounded-2xl font-bold text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-4 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <TrendingUp className="w-6 h-6" />
                            <span>Generate Forecast</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}

                {/* Loading State */}
                {loading && (
                    <motion.div
                        className="flex flex-col items-center justify-center py-20 space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="relative w-24 h-24">
                            <motion.div
                                className="absolute inset-0 border-4 border-primary/20 rounded-full"
                            />
                            <motion.div
                                className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <Cpu className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold">Model Inference in Progress</h3>
                            <p className="text-muted-foreground font-mono">Running Ridge Regression on production datasets...</p>
                        </div>
                    </motion.div>
                )}

                {/* Results Card */}
                <AnimatePresence>
                    {result && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
                        >
                            {/* Main Stat Card */}
                            <div className="bg-card border border-border rounded-3xl p-10 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-6 h-6 text-success" />
                                        <span className="text-sm font-bold text-success uppercase tracking-widest">Prediction Results</span>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-muted-foreground text-lg">Predicted Yield for <span className="text-foreground font-bold">{result.periode}</span></p>
                                        <div className="flex items-baseline gap-2">
                                            <h2 className="text-8xl font-black tracking-tighter text-primary">
                                                {result.rendement_predit_pct.toFixed(2)}
                                            </h2>
                                            <span className="text-4xl font-bold text-primary/60">%</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl">
                                            <Cpu className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-semibold">Model: <span className="text-foreground">{result.modele}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl">
                                            <Database className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-semibold">Data Points: <span className="text-foreground">{result.nb_lignes_utilisees} lines</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Insights Grid */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-card/40 border border-border rounded-2xl p-6 flex items-center gap-4 hover:border-primary/40 transition-colors group">
                                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                                        <Calendar className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Forecast Period</p>
                                        <p className="text-2xl font-bold">{result.periode}</p>
                                    </div>
                                </div>

                                <div className="bg-card/40 border border-border rounded-2xl p-6 flex items-center gap-4 hover:border-primary/40 transition-colors group">
                                    <div className="p-4 bg-green-500/10 rounded-2xl group-hover:bg-green-500/20 transition-colors">
                                        <TrendingUp className="w-8 h-8 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Confidence Interval</p>
                                        <p className="text-2xl font-bold">+/- 2.4 %</p>
                                    </div>
                                </div>

                                <div className="bg-card/40 border border-border rounded-2xl p-6 flex items-center gap-4 hover:border-primary/40 transition-colors group">
                                    <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                                        <Database className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Model Architecture</p>
                                        <p className="text-2xl font-bold">L2 Regularized Regression</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setResult(null)}
                                    className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:text-primary hover:border-primary/40 transition-all font-bold flex items-center justify-center gap-2"
                                >
                                    <Loader2 className="w-4 h-4" />
                                    Reset Prediction
                                </button>
                            </div>

                            {/* Raw JSON View */}
                            <div className="lg:col-span-2">
                                <details className="group border border-border rounded-2xl overflow-hidden transition-all bg-card/40">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/40 list-none">
                                        <div className="flex items-center gap-2">
                                            <Database className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground group-open:text-primary transition-colors">Raw API Response Schema</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90 group-open:text-primary" />
                                    </summary>
                                    <div className="p-6 bg-background/50 border-t border-border font-mono text-sm overflow-x-auto">
                                        <pre className="text-secondary-foreground p-4 bg-muted/50 rounded-lg">
                                            {JSON.stringify(result, null, 2)}
                                        </pre>
                                    </div>
                                </details>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Disclaimer */}
                <motion.p
                    className="text-center text-xs text-muted-foreground pt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Model outputs are estimates based on historical production logs and employee performance metrics.
                </motion.p>
            </div>
        </AppLayout>
    )
}
