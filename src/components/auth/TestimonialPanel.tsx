"use client";

import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./testimonial-panel.css";
import { TESTIMONIALS } from "@/data/testimonials";

const AUTOPLAY_DELAY_MS = 15000;
const SLIDE_TRANSITION_MS = 700;
const BACKGROUND_WIDTH_PX = 1600;
const BACKGROUND_HEIGHT_PX = 1818;

const AUTOPLAY_OPTIONS = {
  delay: AUTOPLAY_DELAY_MS,
  disableOnInteraction: false,
  pauseOnMouseEnter: false,
} as const;

export default function TestimonialPanel() {
  return (
    <div className="testimonial-panel">
      <Swiper
        className="testimonial-swiper h-full"
        modules={[Autoplay, Pagination]}
        loop
        slidesPerView={1}
        speed={SLIDE_TRANSITION_MS}
        autoplay={AUTOPLAY_OPTIONS}
        pagination={{ clickable: true }}
      >
        {TESTIMONIALS.map((testimonial) => (
          <SwiperSlide key={testimonial.id}>
            <Image
              src={testimonial.backgroundImage}
              alt=""
              width={BACKGROUND_WIDTH_PX}
              height={BACKGROUND_HEIGHT_PX}
              loading="eager"
              unoptimized
              className="testimonial-bg testimonial-bg--sharp"
            />
            <Image
              src={testimonial.backgroundImage}
              alt=""
              width={BACKGROUND_WIDTH_PX}
              height={BACKGROUND_HEIGHT_PX}
              loading="eager"
              unoptimized
              className="testimonial-bg testimonial-bg--soft"
            />
            <div className="testimonial-overlay" />

            <div className="testimonial-comment">
              <Image
                src="/images/login/quote.png"
                alt=""
                width={112}
                height={84}
                unoptimized
                className="block h-auto w-[90px]"
              />
              <p className="mt-[30px] mb-[40px]">{testimonial.quote}</p>
              <div className="testimonial-customer">
                <Image
                  src={testimonial.customerLogo}
                  alt={testimonial.customerName}
                  width={55}
                  height={55}
                  unoptimized
                  className="size-[55px]"
                />
                <div className="ml-3">
                  <p className="m-0 text-[17px] font-semibold">
                    {testimonial.customerName}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
