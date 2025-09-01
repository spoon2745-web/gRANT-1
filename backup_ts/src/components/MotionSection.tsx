'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { PropsWithChildren, useRef } from 'react'

export default function MotionSection({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [30, -30])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.6, 1, 0.9])

  return (
    <motion.section ref={ref} style={{ y, opacity }}>
      {children}
    </motion.section>
  )
}
