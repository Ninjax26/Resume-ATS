"use client"

import React, { useRef } from "react"
import { motion, useInView, Variants } from "framer-motion"
import { cn } from "@/lib/utils"

interface TimelineContentProps {
  children: React.ReactNode
  animationNum?: number
  timelineRef?: React.RefObject<HTMLDivElement>
  customVariants?: Variants
  className?: string
  as?: React.ElementType
}

const defaultVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

export function TimelineContent({
  children,
  animationNum = 0,
  timelineRef: _timelineRef,
  customVariants,
  className,
  as: Component = "div",
}: TimelineContentProps) {
  const localRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(localRef, {
    once: true,
    margin: "-50px",
  })

  const variants = customVariants || defaultVariants

  return (
    <Component ref={localRef} className={cn(className)}>
      <motion.div
        custom={animationNum}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
      >
        {children}
      </motion.div>
    </Component>
  )
}
