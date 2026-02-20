// components/ui/Carousel.tsx
'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

type CarouselProps = {
  children: React.ReactNode[]
  options?: { loop?: boolean; dragFree?: boolean; [key: string]: any }
}

// @ts-ignore  ← ignora erro de tipos JSX aqui embaixo
export function Carousel({ children, options = { loop: true } }: CarouselProps) {
  const [emblaRef] = useEmblaCarousel(
    options,
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  return (
    <div className="embla overflow-hidden">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {React.Children.map(children, (child, index) => (
            <div key={index} className="embla__slide flex-[0_0_100%] min-w-0">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}