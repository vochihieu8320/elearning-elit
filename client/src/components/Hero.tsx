import React, { useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import SwiperClass from "swiper";
import "swiper/swiper-bundle.css";

import img1 from "../assets/banner_img/banner1.png";
import img2 from "../assets/banner_img/banner2.png";
import img3 from "../assets/banner_img/banner3.png";

export default function Hero() {

  const swiperRef = useRef<SwiperClass | null>(null);

  const handleClickPrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleClickNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    // <section className="relative rounded-xl overflow-hidden mb-12 bg-blue-800 shadow-lg">
    //   <div className="md:flex">
    //     <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
    //       <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Đầu tư cho kiến thức, thay đổi tương lai</h1>
    //       <p className="text-blue-100 mb-6">Truy cập hơn 1,000+ khóa học chất lượng cao từ các chuyên gia hàng đầu với giá cả phải chăng.</p>
    //       <div className="flex flex-wrap gap-3">
    //         <Link href="/courses">
    //           <Button variant="amber" size="lg">Khám phá ngay</Button>
    //         </Link>
    //         <Link href="/courses?price=free">
    //           <Button variant="outline" className="bg-white text-blue-800 border-white hover:bg-gray-100 hover:text-blue-900" size="lg">
    //             Xem khóa học miễn phí
    //           </Button>
    //         </Link>
    //       </div>
    //     </div>
    //     <div className="md:w-1/2 relative">
    //       <img 
    //         src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
    //         alt="Students learning online" 
    //         className="h-full w-full object-cover"
    //       />
    //     </div>
    //   </div>
    // </section>
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={30}
        loop={true}
        speed={1100}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="mySwiper rounded-2xl"
      >
        {/* Banner 1 */}
        <SwiperSlide>
          <div className="relative w-full h-[400px]">
            <img
              src={img1}
              alt="Slider Image"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="bg-white rounded-sm shadow-lg p-6 m-10 md:p-10 max-w-lg">
                <h2 className="leading-14 text-5xl font-bold mb-4 text-gray-900 font-serif">
                  Prep for your IT certificate
                </h2>
                <p className="mb-6 text-gray-700">
                  Explore a future in IT. Start learning toward AWS
                  certification, CompTIA A+ certification, and more.
                </p>
                <div className="flex gap-3">
                  <Link href="/courses">
                    <Button variant="blackWhite" size="lg">
                      Khám phá ngay
                    </Button>
                  </Link>
                  <Link href="/courses?price=free">
                    <Button
                      variant="outline"
                      className="bg-white text-black-800 border-white hover:bg-gray-100 hover:text-green-500"
                      size="lg"
                    >
                      Xem khóa học miễn phí
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Banner 2 */}
        <SwiperSlide>
          <div className="relative w-full h-[400px]">
            <img
              src={img2}
              alt="Slider Image"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center">
              <div className="bg-white rounded-sm shadow-lg p-6 m-10 md:p-10 max-w-lg">
                <h2 className="font-serif leading-14 text-5xl font-bold mb-4 text-gray-900">
                  Learn from anywhere
                </h2>
                <p className="mb-6 text-gray-700">
                  On the couch, from the backyard, or on your commute. Our app
                  lets you decide.
                </p>
                <div className="flex gap-3">
                  <Link href="/courses">
                    <Button variant="blackWhite" size="lg">
                      Khám phá ngay
                    </Button>
                  </Link>
                  <Link href="/courses?price=free">
                    <Button
                      variant="outline"
                      className="bg-white text-black-800 border-white hover:bg-gray-100 hover:text-green-500"
                      size="lg"
                    >
                      Xem khóa học miễn phí
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Banner 3 */}
        <SwiperSlide>
          <div className="relative w-full h-[400px]">
            <img
              src={img3}
              alt="Slider Image"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 flex items-center">
              <div className="bg-white rounded-sm shadow-lg p-6 m-10 md:p-10 max-w-lg">
                <h2 className="font-serif text-5xl font-bold mb-4 text-gray-900">
                  Keep moving up
                </h2>
                <p className="mb-6 text-gray-700">
                  Learn the skills you need to take the next step — and every
                  step after.
                </p>
                <div className="flex gap-3">
                  <Link href="/courses">
                    <Button variant="blackWhite" size="lg">
                      Khám phá ngay
                    </Button>
                  </Link>
                  <Link href="/courses?price=free">
                    <Button
                      variant="outline"
                      className="bg-white text-black-800 border-white hover:bg-gray-100 hover:text-green-500"
                      size="lg"
                    >
                      Xem khóa học miễn phí
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2"
        onClick={handleClickPrev}
      >
        <span className="text-[#4b4b4b] text-2xl">‹</span>
      </button>
      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2"
        onClick={handleClickNext}
      >
        <span className="text-[#4b4b4b] text-2xl">›</span>
      </button>
    </section>
  );
}
